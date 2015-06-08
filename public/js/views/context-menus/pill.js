// pill.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/context-menus/pill.html'
  , 'collections/context-menu'
  , 'bootstrap-contextmenu'
  ]
, function ( $, _, Backbone, pillTpl, ContextMenuCollection) {
    var fleetPanelView = Backbone.View.extend({
      // el: $('#context-menus'),
      initialize: function () {
        this.el = $('#info-block>.nav')
        this.render()
        this.collection = new ContextMenuCollection()
        this.collection.add({name: 'pill'})
        this.bindEvent('#info-block>.nav li a')
      },
      render: function(){
        var compiled = _.template(pillTpl)()
        this.el.append(compiled)
      },
      bindEvent: function (selector) {
        var $contextMenu = $("#pill-contextmenu")
          , targetPill

        $(selector).parent().contextmenu({
          target:'#pill-contextmenu',
          before: function(e,context) {
            targetPill = $(e.target)
          },
          onItem: function(context,e) {
            var itemSelector = targetPill.attr('href').replace( /\-pill/
                                                              , '-item')
            if (targetPill.parent().hasClass('active')) {
              // deactive current pill
              $(this).removeClass('active')
              $('.my-panel').removeClass('active')

              // if (targetPill.parent.next())
              console.log(targetPill.parent().next('li'))
              // active next pill, if none, active previous pill
              var nextPill = (targetPill.parent().next('li').length > 0
                             ? targetPill.parent().next('li')
                             : targetPill.parent().prev('li')
                             )
                , nextBody = $(nextPill.children('a').attr('href'))

              nextPill.addClass('active')
              nextBody.addClass('active')
            }
            else
              console.log('is not active')
            // remove the current pill
            targetPill.parent().remove()
            // show menu item
            $(itemSelector).show()
          }
        })
      }
    })
    return fleetPanelView
  }
)


