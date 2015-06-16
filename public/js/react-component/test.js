// define(
//   [ 'jquery'
//   , 'underscore'
//   , 'react'
//   ]
// , function ($, _, React) {
//     var testView = {}
//     var R = React.DOM

//     var elem = <h1>Hello World</h1>

//     var MyClass = React.createClass({
//       render: function () {
//         return elem
//       }
//     })

//     testView.initialize = function () {
//       React.render(
//         <MyClass />
//       , $('#main-container')[0]
//       )
//     }
//     return testView
//   }
// )
import $ from 'jquery'
import React from 'react'
import ReactBs from 'react-bs'

var Alert = ReactBs.Alert
  , TabbedArea = ReactBs.TabbedArea
  , TabPane = ReactBs.TabPane
  , Nav = ReactBs.Nav
  , NavItem = ReactBs.NavItem

function log (key) {
  // console.log('LOG')
  console.log(this)
  // this.setState({key})
  // this.activeKey = this.eventKey
}

class MyClass extends React.Component {
  render() {
    return (
      <TabbedArea bsStyle='pills' defaultActiveKey={2}
                  onContextMenu={(e)=>{e.preventDefault();console.log(e.target)}} >
        <TabPane eventKey={1} tab='Tab 1'>TabPane 1 content</TabPane>
        <TabPane eventKey={2} tab='Tab 2'>TabPane 2 content</TabPane>
        <TabPane eventKey={3} tab='Tab 3'>
          TabPane 3 content
        </TabPane>
      </TabbedArea>
      
   )
  }
}



export var testView = {
  init: function () {
    React.render(
       <MyClass />
    , $('#main-container')[0]
    )
  }
}