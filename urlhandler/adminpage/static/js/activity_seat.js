

$('#region-1').ready(function(){
    var columnNum = 16;
    var column = new Array(new Array(5,8,5),
                          new Array(6,8,5),
                          new Array(6,8,6),
                          new Array(6,8,5),
                          new Array(6,8,5),
                          new Array(6,8,5),
                          new Array(6,8,6),
                          new Array(7,8,6),
                          new Array(6,8,6),
                          new Array(7,8,6),
                          new Array(7,8,7),
                          new Array(7,8,6),
                          new Array(7,8,7),
                          new Array(7,8,6),
                          new Array(7,8,7),
                          new Array(8,8,7));

    var maxColumn = new Array(8,8,7);
    var table = createTable(1,columnNum,column,maxColumn,1);

    $(table).css({
        position: 'relative',
        margin: '0 auto',
    });
$('#region-1').append(table);
});

$('#region-2').ready(function(){
    var columnNum = 1;
    var column = new Array(new Array(13,17,13));
    var maxColumn = new Array(13,17,13);
    var table = createTable(1,columnNum,column,maxColumn,2);
    $(table).css({
    position: 'relative',
    margin: '0 auto',
});
    $('#region-2').append(table);
});

$('#region-3').ready(function(){
    var columnNum = 5;
    var column = new Array(new Array(3,5,12,5,3),
                           new Array(3,5,12,4,3),
                           new Array(3,5,12,5,3),
                           new Array(3,5,12,4,3),
                           new Array(3,5,12,5,3));
    var maxColumn = new Array(3,5,12,5,3);
    var table = createTable(1,columnNum,column,maxColumn,3);

    $(table).css({
        position: 'relative',
        margin: '0 auto',
    });

    $('#region-3').append(table);
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
