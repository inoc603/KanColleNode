function update_material (data) {
	for (key in data)
		$('.amount', '.test_division#resource>#res'+key).text(data[key])
}

function update_basic (data) {
  for (key in data)
    $('#'+key, '#tab_basic').text(data[key])    
}

var fleetTableRowHtml = '<tr>'
                      + '<td class="col-md-4">'
                      +   '<span class="ship_name"></span>'
                      +   '</br>'
                      +   '<span class="ship_type"></span>'
                      + '</td>'
                      + '<td class="col-md-4">'
                      +   '<span class="ship_level"></span>'
                      +   '</br>'
                      +   '<span class="exp_next"></span>'
                      + '</td>'
                      + '<td class="col-md-6">'
                      +   '<span class="ship_health_number"></span>'
                      +   '</br>'
                      +   '<span class="ship_health"></span>'
                      + '</td>'
                      + '<td class="ship_condition col-md-2"></td>'
                      + '</tr>'


function update_fleet (data) {
  console.log(data)
  for (var i in data) {
    fleetNum = parseInt(i)+1
    $fleetTable = $('#fleet_' + fleetNum + '>table>tbody', '#tab_fleet')
    $fleetTable.html(Array(data[i].ships.length+1).join(fleetTableRowHtml))
    for (var j in data[i].ships) {
      ship = parseInt(j)+1
      console.log(ship)
      $row = $('tr:nth-child('+ship+')', $fleetTable)
      if (data[i].ships[j]) {
        $('.ship_name', $row).text(data[i].ships[j].name)
        $('.ship_type', $row).text(data[i].ships[j].type)
        console.log($('.ship_level', $row))
        $('.ship_level', $row).text('LV.'+data[i].ships[j].level)
        $('.exp_next', $row).text('Next: '+data[i].ships[j].exp[1]) 
        $('.ship_condition', $row).html(getLabelHtml(data[i].ships[j].condition))

        $('.ship_health_number', $row).text('HP: '+data[i].ships[j].current_hp +'/'+data[i].ships[j].max_hp)
        $('.ship_health', $row).html(
          getProgressBarHtml( data[i].ships[j].max_hp
                            , data[i].ships[j].current_hp)
        )
      }        
    }
  }
}

function getProgressBarHtml (max, now) {
  var percentage = now/max*100
    , color = ""

  if (percentage > 75)
    color = "green"
  else if (percentage > 50)
    color = "yellow"
  else if (percentage > 25)
    color = "orange"
  else
    color = "red"

  res = '<div class="progress health_bar">'
      + '<div class="progress-bar"'
      +     ' role="progressbar"'
      +     ' aria-valuemax="'+ max + '"'
      +     ' aria-valuemin="0"'
      +     ' aria-valuenow="'+ now + '"'
      +     ' style="width:'+percentage+'%;'
      +             'background-image:none;'
      +             'background-color:'+color+'">'
      // +  now + '/' + max
      + '</div></div>'
  return res
}

function getLabelHtml (cond) {
  if (cond > 49)
    color = 'yellow'
  else if (cond > 39)
    color = 'grey'
  else if (cond > 29)
    color = '#F5DEB3'
  else if (cond > 19)
    color = 'orange'
  else 
    color = 'red'

  res = '<span class="label" style="background-color:'
      + color
      + ';">'+cond+'</span>'
  return res
}