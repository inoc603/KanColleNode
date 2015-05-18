$(document).ready(function () {
  $('#disp_main_panel').draggable({ addClasses: false
                      , handle: 'ul#disp_main_pills'
                      })

  $('.panel_wrapper').draggable({ addClasses: false
                                , handle: 'div.panel-heading'
                                , revert: revertInside
                                , stack: '.panel'
                                })
  $('#timer_panel').resizable({ minWidth:220
                              , alsoResize:'#timer_panel_wrapper'})
  $('#fleet_panel').resizable({ alsoResize:'#fleet_panel_wrapper'
                              , minWidth:420})
  $('#quest_panel').resizable({ minWidth:420
                              , alsoResize:'#quest_panel_wrapper'})
  $('#exp_panel').resizable({ minWidth:500
                            , alsoResize:'#exp_panel_wrapper'})
  $('#battle_panel').resizable({ minWidth:530
                               , alsoResize:'#battle_panel_wrapper'})
  $('#flist_panel').resizable({ minWidth:530
                               , alsoResize:'#flist_panel_wrapper'})
    
    
  $('.droppable_pane').droppable({
    drop: function (event, ui) {
      console.log('dropped')
    }
    , out: function (event, ui) {
      console.log('out')
    }

    , greedy: true
    // , accept: '.outside_draggable'
  })
  $('body').droppable({
    drop: function (event, ui) {
      console.log('dropped outside')
      // console.log(ui.draggable)
      if (ui.draggable.hasClass('panel_wrapper')) {
        var wrapperId = ui.draggable[0].id
        if (!ui.draggable.hasClass('outside_panel')) {
          var pillId = ui.draggable.parent()[0].id
            , targetLink = $('a[aria-controls='+pillId+']')
          targetLink.css('display', 'none')

          targetLink.parent().next().children('a').tab('show')
          ui.draggable.addClass('outside_panel')
          ui.draggable.detach().insertAfter($('#game_panel'))
          w = $('#'+wrapperId).children('.panel')
                            .resizable('option', 'minWidth')
          console.log(w)
          $('#'+wrapperId).css('width', w)
          pos = $('#'+wrapperId).position()
          parentPos = $('#disp_main_panel').offset()
          // parentPos = $('#disp_main_panel>.tab-content').offset()
          console.log(pos, parentPos)
          pos.left += parentPos.left
          pos.top += parentPos.top
          console.log(pos)
          $('#'+wrapperId).css('position', 'absolute')
          // .css('left', pos.left).css('top', pos.top)  
          $('#'+wrapperId).offset(pos)
        }
      }
    }
    , greedy: true
    // , accept: '.outside_draggable'
  })
})
