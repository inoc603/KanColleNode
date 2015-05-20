// apps/updater/timers.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'collections/updater'
  , 'apps/common/socket'
  , 'apps/common/globals'
  ]
, function($, _, Backbone, UpdaterCollection, socket, globals){
    var listUpdater = {

      initialize: function (table) {
        this.collection = new UpdaterCollection()
        this.collection.add({name: 'list'})
        this.table = table

      }
    , updateShipList: function () {
        var updater = this
        console.log(globals.mixId)
        $.get('http://127.0.0.1:3001/rest/ships/'+globals.mixId,function (data) {
          // console.log(data)
          globals.ships = data
          updater.table.destroy()
          var tableData = []
          var $tbody = $('#ship-table>tbody')
          // console.log(data)
          // console.log($tbody)
          $tbody.html('')
          for (var i in data) {
            // console.log(getShipListRow(data[i]))
            $tbody.append(getShipListRow(data[i]))
          }
          console.log('before', $tbody.html())
          // updater.table.state.save()
          // updater.table.draw(false)

          updater.table = $('table#ship-table').DataTable({
            paginate: false,
            scrollY: 300
          })
          console.log('after', $tbody.html())

          // $tbody = $('#ship-table>tbody')
          // $tbody.html('')
          // for (var i in data) {
          //   $tbody.append(getShipListRow(data[i]))
          // }
          // // shipDynatable.settings.dataset.originalRecords = data
          // newRecords = updater.table.records.getFromTable()
          // console.log(newRecords)
          // // updater.table.records.updateFromJson(data)
          // updater.table.settings.dataset.originalRecords = newRecords
          // console.log(updater.table.settings.dataset.originalRecords)
          // updater.table.process()
          // updater.table.dom.update()

        })


      }
    }
    return listUpdater
  }
)

function getShipListRow (ship) {
  var res = '<tr>'
          +   '<td class="ship_id">'+ship.id+'</td>'
          +   '<td class="ship_name">'+ship.name+'</td>'
          +   '<td class="ship_level">'+ship.level+'</td>'
          + '</tr>'
  return res
}
