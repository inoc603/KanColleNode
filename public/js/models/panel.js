// models/panel.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/panels/tab.html'
  , 'text!templates/panels/general.html'
  , 'text!templates/panels/menu-item.html'
  ]
, function ($, _, Backbone, tabTpl, generalTpl, itemTpl){
    var PanelModel = Backbone.Model.extend({
      defaults: { name: 'panel'
                , title: 'panel'
                , template: 'panel'
                }
    })

    PanelModel.prototype.addPanel = function name () {
      var inner = _.template(this.attributes.template)({})
        , outter = _.template(generalTpl)({ id: this.attributes.name
                                          , panel: inner})
      // append the panel
      $('#info-block>.tab-content').append(outter)

      return this
    }

    PanelModel.prototype.addTab = function (display) {
      if (display == true) {
        var compiled = _.template(tabTpl)({ id: this.attributes.name
                                          , title: this.attributes.title
                                          })
        // append the tab
        $('#info-block>.nav').append(compiled)
      }

      return this
    }

    PanelModel.prototype.addItem = function (display) {
      var itemSelector = '#' + this.attributes.name + '-item'
        , item = _.template(itemTpl)({ id: this.attributes.name
                                     , content: this.attributes.title})

      $('#add-pill').next().append(item)
      // if the panel is displayed, hide the menu item
      if (display == true) $(itemSelector).hide()

      return this
    }

    PanelModel.prototype.render = function (display) {
      this.addPanel().addTab(display).addItem(display)

      return this
    }

    return PanelModel
  }
)
