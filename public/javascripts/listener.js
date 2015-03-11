function update_material (data) {
	for (key in data)
		$('.amount', '.test_division#resource>#res'+key).text(data[key])
}

function update_basic (data) {
  for (key in data)
    $('#'+key, '#tab_basic').text(data[key])    
}

function update_fleet (data) {
  console.log(data)
  for (var i in data) {
    fleetNum = parseInt(i)+1
    $fleetTable = $('#fleet_' + fleetNum + '>table>tbody', '#tab_fleet')
    for (var j in data[i].ships) {
      ship = parseInt(j)+1
      $row = $(':nth-child('+ship+')', $fleetTable)
      if (data[i].ships[j]) {
        $('.ship_name', $row).text(data[i].ships[j].name)
        $('.ship_level', $row).text('LV.'+data[i].ships[j].level)
        $('.ship_health', $row).html(getProgressBarHtml(data[i].ships[j].max_hp
          , data[i].ships[j].current_hp))
      }        
    }
    console.log(j)
    for (var k = j+2; k < 7; k++) {
      console.log(k)
      $row = $(':nth-child('+k+')', $fleetTable)
      $row.each(function () {
        $(this).text('')
      })
    }
  }
}

function getProgressBarHtml (max, now) {
  var percentage = now/max*100
    , color = ""

  if (percentage > 75)
    color = "green"
  else if (percentage > 50)
    color = "yellow"
  else if (percentage > 25)
    color = "orange"
  else
    color = "red"

  res = '<div class="progress">'
        + '<div class="progress-bar" role="progressbar" aria-valuemax="' + max + '" aria-valuemin="0" aria-valuenow="'
    + now + '" style="width:'+percentage+'%;background-image:none;background-color:'+color+'">'+now+'/'+max+'</div></div>';
  return res
}