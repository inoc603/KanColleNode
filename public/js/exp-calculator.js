var levelExp = [ 0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500
             , 5500, 6600, 7800, 9100, 10500, 12000, 13600, 15300
             , 17100, 19000, 21000, 23100, 25300, 27600, 30000, 32500
             , 35100, 37800, 40600, 43500, 46500, 49600, 52800, 56100
             , 59500, 63000, 66600, 70300, 74100, 78000, 82000, 86100
             , 90300, 94600, 99000, 103500, 108100, 112800, 117600
             , 122500, 127500, 132700, 138100, 143700, 149500, 155500
             , 161700, 168100, 174700, 181500, 188500, 195800, 203400
             , 211300, 219500, 228000, 236800, 245900, 255300, 265000
             , 275000, 285400, 296200, 307400, 319000, 331000, 343400
             , 356200, 369400, 383000, 397000, 411500, 426500, 442000
             , 458000, 474500, 491500, 509000, 527000, 545500, 564500
             , 584500, 606500, 631500, 661500, 701500, 761500, 851500
             , 1000000, 1000000, 1010000, 1011000, 1013000, 1016000
             , 1020000, 1025000, 1031000, 1038000, 1046000, 1055000
             , 1065000, 1077000, 1091000, 1107000, 1125000, 1145000
             , 1168000, 1194000, 1223000, 1255000, 1290000, 1329000
             , 1372000, 1419000, 1470000, 1525000, 1584000, 1647000
             , 1714000, 1785000, 1860000, 1940000, 2025000, 2115000
             , 2210000, 2310000, 2415000, 2525000, 2640000, 2760000
             , 2887000, 3021000, 3162000, 3310000, 3465000, 3628000
             , 3799000, 3978000, 4165000, 4360000
             ]
, mapExp = [ [30,50,80,100,150]
           , [120,150,200,300,250]
           , [310,320,330,350,400]
           , [310,320,330,340]
           , [360,380,400,420,450]
           , [380,420]
           ]
, rankFactor = { 's': 1.2
               , 'a': 1
               , 'b': 1
               , 'c': 0.8
               , 'd': 0.7
               }

function invokeCalculate () {
  $('span#one_turn').trigger('calculate')
  $('span#turns_left').trigger('calculate')
}

$('button#update_ship').click(function () {
  $.get('/rest/ships/'+globalMixId, function (data) {
    globalShips = data
    
    var temp = []
    for (var i in data) temp.push(data[i])
    temp.sort(function (a, b) {return b.level - a.level})

    $('select#ship_select_picker').html('')
    for (var i in temp) {
      opt = '<option value="'+ temp[i].id +'">'
          + temp[i].name + '-lv.' + temp[i].level
          + '</option>'
      $('select#ship_select_picker').append(opt)
    }
    $('select#ship_select_picker').val(globalFleet[0].ships[0].id)
    $('select#ship_select_picker').selectpicker('refresh')
    $('select#ship_select_picker').change()
    invokeCalculate()
  })
})

$('#exp_target_level').change(function () {
  $('#exp_target').val(levelExp[$(this).val()-1])
  invokeCalculate()
})

$('#exp_now_level').change(function () {
  $('#exp_target_level').attr('data-min', $('#exp_now_level').val())
  $('#exp_now').val(levelExp[$(this).val()-1])
  invokeCalculate()
})

$('select#ship_select_picker').change(function () {
  var tempId = $('select#ship_select_picker option:selected').val()
    , nowLevel = globalShips[tempId].level
    , afterLevel = globalShips[tempId].afterlv
    , targetLv = (nowLevel < afterLevel ? afterLevel : nowLevel+1)
  $('input#exp_now_level').val(globalShips[tempId].level)
  $('input#exp_now').val(globalShips[tempId].exp[0])
  $('input#exp_target_level').val(targetLv)
  $('input#exp_target').val(levelExp[targetLv])
  invokeCalculate()
})

$('#exp_now').change(invokeCalculate)
$('#exp_target').change(invokeCalculate)
$('input#flagship').change(invokeCalculate)
$('input#mvp').change(invokeCalculate)
$('select#map_area').change(invokeCalculate)
$('select#map').change(invokeCalculate)
$('select#rank').change(invokeCalculate)

$('span#one_turn').on('calculate', function () {
  var mapArea = $('select#map_area option:selected').val()
    , map = $('select#map option:selected').val()
    , baseExp = mapExp[mapArea-1][map-1]
    , res = baseExp * rankFactor[$('select#rank').val()]
  if ($('input#flagship').is(':checked'))
    res *= 2
  if ($('input#mvp').is(':checked'))
    res *= 1.5
  $(this).text(res)
})

$('span#turns_left').on('calculate', function () {
  var mapArea = $('select#map_area option:selected').val()
    , map = $('select#map option:selected').val()
    , baseExp = mapExp[mapArea-1][map-1]
    , oneTurnExp = baseExp * rankFactor[$('select#rank').val()]
    , expNeed = $('#exp_target').val() - $('#exp_now').val()

  if ($('input#flagship').is(':checked'))
    oneTurnExp *= 2
  if ($('input#mvp').is(':checked'))
    oneTurnExp *= 1.5
  
  $(this).text(Math.ceil(expNeed/oneTurnExp))
})