var Transform = require('stream').Transform
  , util = require('util')
  , httpStringParser = require('http-string-parser')
  , querystring = require('querystring')
  , request = require('request')

function getUrl (line) {
  var regUrl = /[A-Z]+ ([a-zA-z\.\\\/\:0-9]+) [a-zA-z\.\\\/0-9]+/
    , result = line.match(regUrl)
  if (result)
    return result[1]
  return null
}

function getContentLength (httpString) {
  var regCotentLength = /\r\nContent-Length: ([0-9]+)\r\n/
    , result = httpString.match(regCotentLength)
  if (result)
    return result[1]
  return null
}

function getTransferEncoding (httpString) {
  var regCotentEncoding = /\r\nTransfer-Encoding: ([0-9a-zA-Z\-]+)\r\n/
    , result = httpString.match(regCotentEncoding)
  if (result)
    return result[1]
  return null
}

util.inherits(RequestStreamParser, Transform)
function RequestStreamParser (myOptions, options) {
  if (!(this instanceof RequestStreamParser))
    return new RequestStreamParser(options)
  this.store = ''
  this.parsingBody = false
  this.master = myOptions.master
  this.target = myOptions.target
  this.isTarget = false
  this.body = ''
  this.url = ''
  this.contentLength = 0

  Transform.call(this, options)
}

RequestStreamParser.prototype.upload = function  (data) {
  this.emit('req', data)
}

RequestStreamParser.prototype._transform = function(chunk, encoding, done) {
  var str = chunk.toString()


  if (!this.parsingBody) {
    var reqLine = str.split('\r\n', 1)[0]
      , url = getUrl(reqLine)

    this.contentLength = getContentLength(str)
    if (url) {
      if (url.search(this.target) != -1) {
        this.isTarget = true
        this.body += str.split('\r\n\r\n')[1]
        if (this.body.length < this.contentLength) {
          this.parsingBody = true
          this.url = url
        }
        else {
          this.upload({url: url, param: this.body})
          this.body = ''
        }
      }
      else {
        this.isTarget = false
        this.body = ''
      }
    }
  }
  else {
    this.body += str
    if (this.body.length >= this.contentLength) {
      this.upload({url: this.url, param: this.body})
      this.body = ''
    }
  }



  if (str.search('User-Agent:\r\n')!=-1) {
    console.log('empty user agent detected')
    str = str.replace('User-Agent:', 'User-Agent: Mozilla/5.0 (Windows NT 6.3 WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36')
    this.push(new Buffer(str))
  }
  else {
    this.push(chunk)
  }

  done()
}

RequestStreamParser.prototype.flush = function () {
  this.store = ''
  this.parsingBody = false
}

util.inherits(ResponseStreamParser, Transform)
function ResponseStreamParser (myOptions, options) {
  if (!(this instanceof ResponseStreamParser))
    return new ResponseStreamParser(options)
  this.store = ''
  this.parsingBody = false
  this.master = myOptions.master
  this.isChunked = false

  Transform.call(this, options)
}

ResponseStreamParser.prototype.upload = function (data) {
  this.emit('body', data)
}

ResponseStreamParser.prototype._transform = function(chunk, encoding, done) {
  var str = chunk.toString()
  if (this.master.reqParser.isTarget) {
    if (!this.parsingBody) {
      this.contentLength = getContentLength(str)
      this.transferEncoding = getTransferEncoding(str)
      if (this.transferEncoding == 'chunked') {
        this.isChunked = true
      }
      this.store += str
      try {
        if (typeof str.split('\r\n\r\n')[1].length != 'undefined') {
          if (!this.isChunked)
            this.bodyRead = str.split('\r\n\r\n')[1].length
        }
        else
          this.bodyRead = 0
      }
      catch (e) {
        this.bodyRead = 0
      }
    }
    else {
      if (this.isChunked) {
        this.store += str
      }
      else {
        this.store += str
        this.bodyRead += str.length
      }
    }

    if (this.isChunked) {
      if ((str.search('\r\n\r\n') != -1) && this.parsingBody) {
        var split = this.store.search('\r\n\r\n')
          , body = this.store.slice(split+4)
          , bodyParts = body.split('\r\n')
          , newBody = ''
        for (var i = 1; i < bodyParts.length; i+=2)
          newBody += bodyParts[i]
        this.upload(newBody)
        this.store = ''
        this.bodyRead = 0
        this.contentLength = 0
        this.parsingBody = false
        this.isChunked = false
      }
      else if (!this.parsingBody) {
        this.parsingBody = true
      }
    }
    else if (this.bodyRead >= this.contentLength) {
      this.parsingBody = false
      var newBody = this.store.split('\r\n\r\n')[1]
      this.upload(newBody)
      this.store = ''
      this.bodyRead = 0
      this.contentLength = 0
    } else if (!this.parsingBody) {
      this.parsingBody = true
    }
  }
  else {
    this.parsingBody = false
    this.store = ''
    this.bodyRead = 0
    this.contentLength = 0
  }

  this.push(chunk)
  done()
}

function KcnFilter () {
  this.send = {}
  this.reqParser = new RequestStreamParser({ master: this
                                           , target: '/kcsapi/'})
  this.resParser = new ResponseStreamParser({master: this})
  var filter = this
  this.reqParser.on('req', function (data) {
    filter.send.url = data.url
    filter.send.param = data.param
  })
  this.resParser.on('body', function (data) {
    filter.send.data = data
    filter.sendToKCN()
  })

}

KcnFilter.prototype.sendToKCN = function () {
  request.post('http://127.0.0.1:3001/drop', {form: this.send})
}

module.exports = KcnFilter

// var httpProxy = net.createServer(function (socket) {
//     // Create a new connection to the TCP server
//   var proxy = net.connect(8889, '127.0.0.1')
//     , kcn = net.connect(3001, '127.0.0.1')
//     , kcnFilter = new KcnFilter()

//   socket.setKeepAlive(true)

//   // 2-way pipe between client and TCP server
//   // socket.pipe(reqParser).pipe(client).pipe(resParser).pipe(socket)
//   var unset = true
//   socket.on('data', function (data) {
//     if (unset) {
//       if (data.toString().search('Host: 127.0.0.1') != -1) {
//         // console.log('local')
//         proxy.end()
//         kcn.write(data)
//         socket.pipe(kcn).pipe(socket)
//       }
//       else {
//         // console.log('external')
//         kcn.end()
//         kcnFilter.reqParser.write(data)
//         socket
//           .pipe(kcnFilter.reqParser)
//           .pipe(proxy)
//           .pipe(kcnFilter.resParser)
//           .pipe(socket)
//       }
//       unset = false
//     }
//   })
//   socket.on('error', function (err) {
//     console.log(err)
//   })
//   proxy.on('error', function (err) {
//     console.log(err)
//   })
//   kcn.on('error', function (err) {
//     console.log(err)
//   })

// })

// httpProxy.listen(5051, '127.0.0.1')
