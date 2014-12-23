var floorSeat = new Array(0,0,0);


/*一楼座位*/
$('#region-1').ready(function(){
    var rowNum = 16;
    var seatDetail = new Array(new Array(5,8,5),
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
    var table = createTable(1,rowNum,seatDetail,maxColumn,1);

    $(table).css({
        position: 'relative',
        margin: '0 auto',
    });
$('#region-1').append(table);
});


/*二楼座位*/
$('#region-2').ready(function(){
    var rowNum = 1;
    var seatDetail = new Array(new Array(13,17,13));
    var maxColumn = new Array(13,17,13);
    var table = createTable(1,rowNum,seatDetail,maxColumn,2);
    $(table).css({
    position: 'relative',
    margin: '0 auto',
});
    $('#region-2').append(table);
});


/*三楼座位*/
$('#region-3').ready(function(){
    var rowNum = 5;
    var seatDetail = new Array(new Array(3,5,12,5,3),
                           new Array(3,5,12,4,3),
                           new Array(3,5,12,5,3),
                           new Array(3,5,12,4,3),
                           new Array(3,5,12,5,3));
    var maxColumn = new Array(3,5,12,5,3);
    var table = createTable(1,rowNum,seatDetail,maxColumn,3);

    $(table).css({
        position: 'relative',
        margin: '0 auto',
    });

    $('#region-3').append(table);
});


/*设置座位区*/
$("#selectPrice").ready(function() {
    var tr = document.createElement('tr');
    for(var i=0;i<price.length;i++)
    {
        var td = document.createElement('td');
       $(td).css({
            background: priceColor[i]
        });
        $(td).addClass("price-seat");
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
