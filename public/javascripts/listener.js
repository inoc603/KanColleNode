function update_material (data) {
	for (key in data)
		$('.amount', '.test_division#resource>#res'+key).text(data[key])
}

function update_basic (data) {
  for (key in data)
    $('#'+key, '.test_division#basic').text(data[key])    
}

function update_fleet (data) {
  for (var i in data) {
    for (var j in data[i].ships) {
      if (data[i].ships[j])
        console.log(data[i].ships[j].name)
        ship = parseInt(j)+1
        fleet = parseInt(i)+1
        console.log(ship, fleet, i, j)
        $('#ship'+ship, 'div#fleets>ul#fleet'+fleet)
          .text(data[i].ships[j].name)
    }
  }
}