/*定义全局变量*/
var floorSeat = new Array(0,0);


/*一楼座位*/
$('#region-1').ready(function(){
    var rowNum = 17;
    var seatDetail = new Array(new Array(8,10,10,8),
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
    var table = createTable(1,rowNum,seatDetail,maxColumn,1);

    $(table).css({
        position: 'relative',
        margin: '0 auto',
    });
$('#region-1').append(table);
});

/*二楼座位*/
$('#region-2').ready(function(){
    var rowNum = 4;
    var seatDetail = new Array(new Array(11,10,11,9,10,9,11,10,11),
                          new Array(10,10,11,9,10,9,11,10,10),
                          new Array(9,10,10,10,10,10,10,10,9),
                          new Array(9,10,9,6,10,6,9,10,9));
    var maxColumn = new Array(11,10,11,10,10,10,11,10,11);
    var table = createTable(1,rowNum,seatDetail,maxColumn,2);
    $(table).css({
    position: 'relative',
    margin: '0 auto',
});
    $('#region-2').append(table);
});


/*设置价位区*/
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
