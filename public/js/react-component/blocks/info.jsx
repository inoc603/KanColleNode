define(
  [ 'jquery'
  , 'underscore'
  , 'react'
  , 'jsx!react-component/tabs/fleet'
  ]
, function ($, _, React) {
    var testView = {}
    var R = React.DOM

    var FleetPanel = require('jsx!react-component/tabs/fleet').Panel

    var elem = (
      <div role="tabpanel" id="info-block" className="my-panel">
        <ul className="nav nav-pills" role="tablist">
          <div className="dropdown"
               style={{ 'float': 'right'
                      , height: '40px'}}>
            <button className="btn btn-default" id="add-pill"
                    data-toggle="dropdown" aria-expanded="true">
                <span className="glyphicon glyphicon-plus"></span>
            </button>
            <ul className="dropdown-menu dropdown-menu-right" role="menu"
                aria-labelledby="add-pill">
            </ul>
          </div>
        </ul>
        <div className="tab-content">
          <FleetPanel />
        </div>
      </div>
    )

    var InfoBlock = React.createClass({
      render: function () {
        // return R.h1(null, 'CLASS!')
        return elem
      }
    })

    testView.initialize = function () {
      React.render(
        <InfoBlock />
      , $('#main-container')[0]
      )
    }
    return testView
  }
)
