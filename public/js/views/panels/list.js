// fleet.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/panels/list.html'
  , 'apps/updaters/list'
  , 'datatables'
  , 'dynatable'
  ]
, function ( $, _, Backbone, listTpl, listUpdater) {
    var listPanelView = Backbone.View.extend({
      el: '#info-block'
    , events: { 'click #update-ship-list': 'updateShipList'}
    , initialize: function (display, globalCollection) {
        this.collection = globalCollection
        this.model = this.collection.add({ name: 'list'
                                         , title:'一览'
                                         , template: listTpl})
        this.model.render(display)
        // $('#ship-table').DataTable()

        this.table = $('table#ship-table').DataTable({
          paginate: false,
          scrollY: 300
        })

        // this.table = $('table#ship-table').dynatable({
        //   readers: {
        //     'level': function(el, record) {
        //       return Number(el.innerHTML) || 0
        //     },
        //     'id': function (el, record) {
        //       return Number(el.innerHTML) || 0
        //     }
        //   },
        //   features: {
        //     paginate: true,
        //     search: false,
        //     recordCount: false,
        //     perPageSelect: false
        //   }
        // }).data('dynatable')
        listUpdater.initialize(this.table)
      }
    , updateShipList: function () {
        console.log('click')
        // $('#ship-table').DataTable()
        listUpdater.updateShipList()
                // $('#update-ship-list').ajax.reload('http://127.0.0.1:3001/rest/shps/')
      }
    , table: {}
    })
    return listPanelView
  }
)
