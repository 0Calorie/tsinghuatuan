var floorSeat = new Array(0,0,0);

$('#region-1').ready(function(){
    var columnNum = 17;
    var column = new Array(new Array(8,10,10,8),
                          new Array(9,10,10,9),
                          new Array(10,10,10,10),
                          new Array(10,10,10,10),
                          new Array(10,10,10,10),
                          new Array(10,10,10,10),
                          new Array(10,10,10,10),
                          new Array(10,10,10,10),
                          new Array(10,10,10,10),
                          new Array(10,10,10,10),
                          new Array(10,10,10,10),
                          new Array(10,10,10,10),
                          new Array(10,10,10,10),
                          new Array(8,10,10,8),
                          new Array(3,10,10,3),
                          new Array(3,10,10,3),
                          new Array(4,10,10,4));

    var maxColumn = new Array(10,10,10,10);
    var table = createTable(1,columnNum,column,maxColumn,1);

    $(table).css({
        position: 'relative',
        margin: '0 auto',
    });
$('#region-1').append(table);
});

$('#region-2').ready(function(){
    var columnNum = 4;
    var column = new Array(new Array(11,10,11,9,10,9,11,10,11),
                          new Array(10,10,11,9,10,9,11,10,10),
                          new Array(9,10,10,10,10,10,10,10,9),
                          new Array(9,10,9,6,10,6,9,10,9));
    var maxColumn = new Array(11,10,11,10,10,10,11,10,11);
    var table = createTable(1,columnNum,column,maxColumn,2);
    $(table).css({
    position: 'relative',
    margin: '0 auto',
});
    $('#region-2').append(table);
});



$("#selectPrice").ready(function() {
    var tr = document.createElement('tr');
    for(var i=0;i<price.length;i++)
    {
        var td = document.createElement('td');
        $(td).css({
            width: '75px',
            cursor: 'pointer',
            height: '50px',
            "font-size": '20px',
            background: priceColor[i],
            padding: '2px',
            border: '2px solid #fff',
            "-moz-border-radius": '10px',
            "-webkit-border-radius": '10px'
        });
        $(td).attr({
            align: 'center',
            onclick: 'selectPrice()',
            price: price[i]
        });
        $(td).css("background-size","contain");
        td.innerHTML = price[i] + "元";
        $(tr).append(td);
    }
    $('#selectPrice').append(tr);
});

$("#region-1").ready(function(){
    if(typeof(allSeat) != "undefined")
       showSeat(allSeat);
   //不能修改
   if(modify == 0)
    {
        $("td").attr("onclick","");
        $("#submitButton").css("display","none");
    }
});
