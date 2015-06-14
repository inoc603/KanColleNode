define(
  [ 'jquery'
  , 'underscore'
  , 'react'
  ]
, function ($, _, React) {
    var testView = {}
    var R = React.DOM

    var elem = <h1>Hello World</h1>

    var MyClass = React.createClass({
      render: function () {
        return elem
      }
    })

    testView.initialize = function () {
      React.render(
        <MyClass />
      , $('#main-container')[0]
      )
    }
    return testView
  }
)
