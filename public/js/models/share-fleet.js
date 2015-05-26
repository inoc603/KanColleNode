define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  ]
, function($, _, Backbone){
    var ShareFleet = function (fleet, name, tags) {
      this.name = name
      this.tags = tags
      this.least_level = null
      this.ships = []
      for (var i in fleet.ships) {
        var ship = fleet.ships[i]
          . shipTpl = _.pick(ship, ['id', 'ship_id', 'name', 'type'
                                   , 'slot_number'])
        shipTpl.least_level = null
        shipTpl.equipment = []
        for (var j in ship.equipment) {
          var slot = ship.equipment[j]
          if (slot) {
            var slotTpl = _.pick(slot, ['id', 'item_id', 'name', 'type'])
            shipTpl.equipment.push(slotTpl)
          }
          else {
            shipTpl.equipment.push(null)
          }

        }
        this.ships.push(shipTpl)
      }
    }
    return ShareFleet
  }
)
