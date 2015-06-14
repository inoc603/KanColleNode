// boilerplate.js

define(
  [ 'jquery'
  , 'underscore'
  , 'react'
  ]
, function($, _, React){
    var R = React.DOM
    var titleBarElem = (
      <nav className="navbar navbar-default navbar-fixed-top"
           id="page-nav">
        <a className="navbar-brand" href="#">KCN</a>
        <div className="navbar-header"
             style={{ paddingRight:'6px'
                    , 'float': 'right'}}>
          <div id="frame-btns">
            <i className="title-btn fa fa-refresh" id="refresh-window"></i>
            <i className="title-btn fa fa-terminal" id="open-console"></i>
            <i className="title-btn fa fa-minus" id="minimize-window"></i>
            <i className="title-btn fa fa-expand" id="maximize-window"></i>
            <i className="title-btn fa fa-times" id="close-window"></i>
          </div>
        </div>
      </nav>
    )

    var TitleBar = React.createClass({
      render: function () {
        return titleBarElem
      }
    })

    var titleBarView = {}
    titleBarView.initialize = function () {
      React.render(
        React.createElement(TitleBar)
      , $('#title-bar')[0]
      )
    }

    return titleBarView
  }
)
