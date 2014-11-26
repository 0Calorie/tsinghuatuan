 var rowNum = 10;
 var columnNum = 10;
 var tables = document.createElement('table');
            for(i=0;i<2*rowNum;i++)
            {
                var line = document.createElement('tr');
                if(i%2==0)
                {
                var a = document.createElement('td');
                 $(a).css('width', '60px');
                 $(a).css('height', '25px');
                
                $(a).append("<p>第"+(i/2+1)+"排");
                $(line).append(a);
                for(j=0;j<columnNum*2;j++)
                { 
                    
                    var a = document.createElement('td');
                    

                    if(i%2==0&&j%2==0)
                    {

                    $(a).css('background', "gray");
                    $(a).attr('onclick', 'changeColor();');
                    $(a).css({
                        width: '33px',
                        height: '25px',
                        cursor: 'pointer'
                    });
                    $(a).attr({
                        id:(i/2+1)+"-"+(j/2+1),
                        state:0,
                        price:0,
                        row:i/2+1,
                        column:j/2+1
                    });
                    $(a).css("background","url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat2.png) no-repeat");
                    $(a).css("background-size","contain");
                    }
                    else if(i==2&&(j==5||j==13))
                    {
                        $(a).css('width', '100px');
                        $(a).css('height', '25px');
                    }
                    else{
                         $(a).css('width', '10px');
                        $(a).css('height', '25px');
                    }
                    $(line).append(a);
                }
                var select = document.createElement('td');
                $(select).attr({
                    state: '0',
                    onclick: 'selectOneRow()',
                    row:i/2+1,
                });
                $(select).css({
                    width: '50px',
                    height: '25px',
                    cursor: 'pointer'
                });
                select.innerText = "全选";
                $(line).append(select);
                var notselect = document.createElement('td');
                $(notselect).attr({
                    state: '0',
                    onclick: 'cancelselectOneRow()',
                    row:i/2+1,
                });
                $(notselect).css({
                    width: '100px',
                    height: '25px',
                    cursor: 'pointer'
                });
                notselect.innerText = "取消全部";

                $(line).append(notselect);
            }
                $(tables).append(line);
            }
$(tables).css({
    position: 'relative',
    margin: '0 auto',
});
$('#firstfloor').append(tables);






//var price = new Array(0,40,60,80,100,120);
var priceColor = new Array("url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat1.png) no-repeat",
                           "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat3.png) no-repeat",
                           "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat4.png) no-repeat",
                           "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat5.png) no-repeat",
                           "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat6.png) no-repeat",
                           "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat7.png) no-repeat");
var defaultSeat = "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat2.png) no-repeat";
$("#selectPrice").ready(function() {
    var tr = document.createElement('tr');
    for(var i=0;i<price.length;i++)
    {
        var td = document.createElement('td');
        $(td).css({
            width: '70px',
            cursor: 'pointer',
            height: '50px',
            "font-size": '20px',
            background: priceColor[i]
        });
        $(td).attr({
            align: 'center',
            onclick: 'selectPrice()',
            price: price[i],
        });
        $(td).css("background-size","contain");
        td.innerHTML = price[i] + "元";
        $(tr).append(td);
    }
    $('#selectPrice').append(tr);
});


function changeColor(){
    var id = $(this.event.srcElement)[0].id;
    var color;
    var i;
    var price = 0;
    for(i=0;i<$('#selectPrice td').length;i++)
    {
        if($('#selectPrice td')[i].getAttribute("state")==1)
        {
            color = $('#selectPrice td')[i].style.background;
            price = $('#selectPrice td')[i].getAttribute("price");
            break;
        }
    }
    if(i>=$('#selectPrice td').length)
    {
        if($(this.event.srcElement)[0].getAttribute("state")==0)
        {
        alert("请选择一种价位~");
        return;
        }
        else{
             $(this.event.srcElement)[0].setAttribute("state","0");
             $(this.event.srcElement)[0].setAttribute("price","0");
             $('#'+id).css('background', defaultSeat);
             $('#'+id).css("background-size","contain");
             seatNum--;
             $(".ticket")[0].innerText = "总共" + ticketNum +"张票"  + "已选择" + seatNum +"个座位";
             return;
        }
    }

    if($(this.event.srcElement)[0].getAttribute("state")==0)
    {
        $(this.event.srcElement)[0].setAttribute("state","1");
        $(this.event.srcElement)[0].setAttribute("price",price);
        $('#'+id).css('background', color);
        $('#'+id).css("background-size","contain");
        seatNum++;
        $(".ticket")[0].innerText = "总共" + ticketNum +"张票"  + "已选择" + seatNum +"个座位";

    }
    else if($(this.event.srcElement)[0].style.background == color)
    {
        $(this.event.srcElement)[0].setAttribute("state","0");
        $(this.event.srcElement)[0].setAttribute("price","0");
        $('#'+id).css('background', defaultSeat);
        $('#'+id).css("background-size","contain");
        seatNum--;
        $(".ticket")[0].innerText = "总共" + ticketNum +"张票"  + "已选择" + seatNum +"个座位";

    }
    else
    {
        $('#'+id).css('background', color);
        $('#'+id).css("background-size","contain");
        $(this.event.srcElement)[0].setAttribute("price",price);
    }
}

function selectPrice(){
    if($(this.event.srcElement)[0].getAttribute("state")==1)
    {
        $(this.event.srcElement)[0].setAttribute("state","0");
        $(this.event.srcElement)[0].style.color = "black";
    }
    else{
        for(var i=0;i<$('#selectPrice td').length;i++)
        {
            $('#selectPrice td')[i].style.color = "black";
            $('#selectPrice td')[i].setAttribute("state","0");
        }
        $(this.event.srcElement)[0].style.color = "white";
        $(this.event.srcElement)[0].setAttribute("state","1");
    }
}

function selectOneRow(){

    for(i=0;i<$('#selectPrice td').length;i++)
    {
        if($('#selectPrice td')[i].getAttribute("state")==1)
        {
            color = $('#selectPrice td')[i].style.background;
            price = $('#selectPrice td')[i].getAttribute("price");
            break;
        }
    }
    if(i>=$('#selectPrice td').length)
    {
        alert("请选择一种价位~");
        return;
    }
    var row = $(this.event.srcElement)[0].getAttribute("row");
    for(var j=1;j<columnNum+1;j++)
    {
        //alert('#'+row+"-"+j);
        if($('#'+row+"-"+j)[0].getAttribute("state") == 0)
        {
            seatNum++;
        }
        $('#'+row+"-"+j)[0].setAttribute("state","1");
        $('#'+row+"-"+j)[0].setAttribute("price",price);
        $('#'+row+"-"+j).css('background', color);
        $('#'+row+"-"+j).css("background-size","contain");
    }
    $(".ticket")[0].innerText = "总共" + ticketNum +"张票"  + "已选择" + seatNum +"个座位";
}

function cancelselectOneRow(){

    var row = $(this.event.srcElement)[0].getAttribute("row");
    for(var j=1;j<columnNum+1;j++)
    {
        if($('#'+row+"-"+j)[0].getAttribute("state") == 1)
        {
            seatNum--;
        }
        $('#'+row+"-"+j)[0].setAttribute("state","0");
        $('#'+row+"-"+j)[0].setAttribute("price","0");
        $('#'+row+"-"+j).css('background', defaultSeat);
        $('#'+row+"-"+j).css("background-size","contain");
    }
    $(".ticket")[0].innerText = "总共" + ticketNum +"张票"  + "已选择" + seatNum +"个座位";
}
function postSeat() {
    if(ticketNum == seatNum)
    {
        postSeat_();
        $("#submitButton1").click();
        /*
        var url = "http://127.0.0.1:8000/saveSeat/"+actID+"/";
        var data = {
            'aid'   : actID,
            'floor' : $("#floor").attr("value"),
            'column': $("#column").attr("value"),
            'price' : $("#price").attr("value"),
            'row'   : $("#row").attr("value")
        }
        $.Ajaxs
        timeGeter = new XMLHttpRequest();
        timeGeter.onreadystatechange = function (){            
        }
        timeGeter.open('POST', url, true);
        timeGeter.send(data);
        */
    }
    else
    {
        alert("票数和选的座位数不符！请重新修改！");
    }

}
function postSeat_() {
    var price = "";
    var row = "";
    var column = "";
    var floor = "";
    for(i=0;i<$('#firstfloor td').length;i++)
        {
            if($('#firstfloor td')[i].id !=""&&$('#firstfloor td')[i].getAttribute("state")==1)
            {
                if(price == ""){
                    price = price + $('#firstfloor td')[i].getAttribute("price");
                }
                else{
                    price = price + " " + $('#firstfloor td')[i].getAttribute("price");
                }

                if(row == "") {
                    row = row + $('#firstfloor td')[i].getAttribute("row");
                }
                else{
                    row = row + " " + $('#firstfloor td')[i].getAttribute("row");
                }

                if(column == ""){
                    column = column + $('#firstfloor td')[i].getAttribute("column"); 
                }
                else {
                    column = column + " " + $('#firstfloor td')[i].getAttribute("column");                
                }
                    
                if(floor == ""){
                    floor = floor + "1";
                }
                else{
                    floor = floor + " " + "1";
                }
            }
        }
    $("#floor").attr("value",floor);
    $("#column").attr("value",column);
    $("#price").attr("value",price);
    $("#row").attr("value",row);
}


//从数据库中载入数据到界面
$("#firstfloor").ready(function(){
    if(typeof(allSeat) != "undefined")
       showSeat(allSeat);
   //不能修改
   if(modify == 0)
    {
        $("td").attr("onclick","");
        $("#submitButton").css("display","none");
    }
});

function showSeat(allSeat)
{
    len = allSeat.length;
    for(var i = 0; i < len; i++)
    {
        floor = allSeat[i].floor;
        column = allSeat[i].column;
        row = allSeat[i].row;
        seatprice = allSeat[i].price;
        id = row + "-" + column;
        $("#"+id).attr("price", seatprice);
        $("#"+id).attr("column", column);
        $("#"+id).attr("row", row);
        $("#"+id).attr("state", 1);

        for(var j = 0; j < price.length; j++)
        {
            if(price[j] == seatprice)
            {
                $("#"+id).css("background",priceColor[j]);
                $("#"+id).css("background-size","contain");
                break;
            }
        }        
    }
}

/*

$('#submitForm').on('submit', function (e) {
    e.preventDefault();

    $.ajax({
        url: "/saveSeat/"+actID +"/",
        type: "POST",
        data: {
            'floor': $("#floor").val(),
            'column': $("column").val(),
            'row': $("row").val(),
            'price': $("price").val()
        },
        dataType: "json",
        success: function(data) {
            alert("success");
        },
        error: function() {
            alert('Unknown Error');
        }
    });
}
*/