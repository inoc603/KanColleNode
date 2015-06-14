define(
  [ 'jquery'
  , 'underscore'
  , 'react'
  , 'apps/common/socket'
  , 'apps/common/globals'
  , 'bootstrap'
  ]
, function ($, _, React, socket) {
    var R = React.DOM

    var InsideTab = React.createClass({
      render: function () {
        var num = this.props.fleetNum
        return (
          <li className={"fleet-tab"+(this.props.fleetNum=='1'?' active':'')}>
          <a href={'#fleet-' + num} data-toggle="tab">
            <span className="fleet-num">{num}</span>&nbsp;
            <span className="fleet-name-shown" id={"fleet-name-"+num}> </span>
          </a>
          </li>
        )
      }
    })

    var TableRow = React.createClass({
      render: function () {
        return (
          <tr>
          <td>
            <span className="ship-name"></span>
            <br />
            <span className="ship-type"></span>
          </td>
          <td>
            <span className="ship-level"></span>
            <br />
            <span className="exp-next"></span>
          </td>
          <td>
            <span className="ship-health-number"></span>
            <br />
            <span className="ship-health"></span>
          </td>
          <td className="ship-condition"></td>
          <td className="ship-equipment hidden-td" id="slot-1"></td>
          <td className="ship-equipment hidden-td" id="slot-2"></td>
          <td className="ship-equipment hidden-td" id="slot-3"></td>
          <td className="ship-equipment hidden-td" id="slot-4"></td>
          </tr>
        )
      }
    })

    var InsidePanel = React.createClass({
      render: function () {
        var self = this
        this.props.rows = _.range(1, 7).map(function (cv) {
          return <TableRow key={cv} ref={'fleet-table-row-'+cv} />
        })
        this.props.update = function (data) {
          var shipNum = 1
          for (var ship of data.ships) {
            $row = $(React.findDOMNode(self.refs['fleet-table-row-'+shipNum]))
            $('.ship-name', $row).text(ship.name)
            $('.ship-type', $row).text(ship.type)
            $('.ship-level', $row).text('LV.'+ship.level)
            $('.exp-next', $row).text('Next: '+ship.exp[1])
            shipNum++
          }
        }
        return (
          <div className={"tab-pane"+(this.props.fleetNum=='1'?' active':'')} 
               id={"fleet-" + this.props.fleetNum}>
            <div className="fleet-status alert" role="alert">
              <span className="status-info">No data</span>
              <span className="status-detail"></span>
              <span className="status-timer"></span>
            </div>
            <table className="table fleet-table">
              <tbody>
              {this.props.rows}
              </tbody>
            </table>
          </div>
        )
      }
    })

    var Panel = React.createClass({
      render: function () {
        var self = this
        this.tabs = _.range(1, 5).map(function (cv) {
          return <InsideTab fleetNum={cv} key={cv} />
        })
        this.panels = _.range(1, 5).map(function (cv) {
          return <InsidePanel fleetNum={cv} key={cv} />
        })
        socket.on('fleet_update', function (data) {
          for (var i = 0; i< data.length; i++) {
            self.panels[i].props.update(data[i])
          }
        })
        return (
          <div className="panel panel-default" id="fleet-panel">
            <div className="panel-heading">
              <div className="panel-title">舰队</div>
              <span className="my-icons" style={{'float':'right'}}>
                <i className="fa fa-minus minify-panel"></i>&nbsp;
                <i className="fa fa-times hide-panel"></i>
              </span>
            </div>
            <div className="panel-body">
              <div className="tabable" id="tab-fleet">
                <ul className="nav nav-tabs">
                  {this.tabs}
                  <span id="fleet-icons">
                    <i className="fa fa-floppy-o" id="save-fleet"
                       data-toggle="tooltip" data-placement="top"
                       title="保存配置"></i>
                  </span>
                </ul>
                <div className="tab-content">
                  {this.panels}
                </div>
              </div>
            </div>
          </div>
        )
      }
    })

    var fleet = {}
    fleet.Panel = Panel

    return fleet
  }
)
