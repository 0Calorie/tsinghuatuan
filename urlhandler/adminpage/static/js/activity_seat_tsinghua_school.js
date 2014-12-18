var floorSeat = new Array(0,0,0);
var priceColor = new Array("#FFFF80",
                           "#FF8080",
                           "#FF8040",
                           "#8080FF",
                           "#8080FF",
                           "#808000");
var defaultSeat = "gray";

document.getElementById('selectA').onmouseover = function () {
	$('#selectA .cursor').css("display","block");
};
document.getElementById('selectA').onmouseout = function () {
	$('#selectA .cursor').css("display","none");
};
document.getElementById('selectB').onmouseover = function () {
	$('#selectB .cursor').css("display","block");
};
document.getElementById('selectB').onmouseout = function () {
	$('#selectB .cursor').css("display","none");
};
document.getElementById('selectC').onmouseover = function () {
	$('#selectC .cursor').css("display","block");
};
document.getElementById('selectC').onmouseout = function () {
	$('#selectC .cursor').css("display","none");
};
document.getElementById('selectD').onmouseover = function () {
	$('#selectD .cursor').css("display","block");
};
document.getElementById('selectD').onmouseout = function () {
	$('#selectD .cursor').css("display","none");
};

function showRegionSeat(num){
	$('#region-'+num).css("display","block");
	$('#main-xq').css("display","none");
	$('#selectPriceDiv').css("display","block");
}

$('#region-1').ready(function(){
	var rowNum = 19;
 	var columnNum = new Array(31,33,35,37,39,
 							  39,39,39,39,39,
 							  39,39,39,39,39,
 							  39,35,33,31
 							  );
 	var column = 39;
 	var tables = document.createElement('table');
            for(i=0;i<2*rowNum;i++)
            {
                var line = document.createElement('tr');
                if(i%2==0)
                {
              
                for(j=0;j<column;j++)
                {   
                	var a = document.createElement('td');
                    if(j<(column - columnNum[i/2])/2 || j >= (column - (column - columnNum[i/2])/2))
                    {
                    	$(a).css("width","25px");
                    	$(a).css("height","25px");
                    	$(line).append(a);
                    	continue;
                    }
                  
                    $(a).attr('onclick', 'changeColor();');
                    $(a).attr({
                        id:1+"-"+(i/2+1)+"-"+((j+1)-(column - columnNum[i/2])/2),
                        state:0,
                        price:0,
                        row:i/2+1,
                        column:j+1,
                        floor:1
                    });
                   $(a).addClass("default-seat");
				   $(line).append(a);
    				if(j==8||j==29)
                    {
                    	var b = document.createElement('td');
                        $(b).css('width', '50px');
                        $(b).css('cursor', 'pointer');
                        $(b).css('height', '25px');
                        if(j == 8){
                        $(b).attr({
                        	state: 0,
                        	onclick: "selectOneRow()",
                        	onmouseover: "showButton()",
                        	onmouseout: "showNum("+(i/2+1)+")",
                        	id: "1-"+(i/2+1),
                        	floor: 1
                        });
                    }
                        b.innerText = i/2+1;
                        $(line).append(b);
                    }

                }
              
            }
                $(tables).append(line);
            }
$(tables).css({
    position: 'relative',
    margin: '0 auto',
});
$('#region-1').append(tables);
});

$('#region-2').ready(function(){
	var columnNum = 6;
	var column = new Array(new Array(16,14,22,14,16),
						   new Array(15,17,22,17,15),
						   new Array(14,19,22,19,14),
						   new Array(0,14,22,14,0),
						   new Array(0,10,22,10,0),
						   new Array(0,4,18,4,0));
	var maxColumn = new Array(16,19,22,19,16);
	var table = document.createElement('table');
	for(var i=0;i<6;i++){
		var tr = document.createElement('tr');
		for(var j=0;j<5;j++){
			if(j==1){
				for(var k=0;k<maxColumn[j];k++){
					var td = document.createElement('td');
					if(k < (maxColumn[j] - column[i][j]))
					{
						$(td).css({
							width: 25px,
							height: 25px
						});
					}
					else{
						$(td).addClass("default-seat");
						$(td).attr({
							onclick: "changeColor()",
							id: "1-"+(20+i)+(k-(maxColumn[j] - column[i][j])),
							state: 0,
							price: 0,
							row: (i+20),
							column: (k-(maxColumn[j] - column[i][j])),
							floor: 1
							)};
					}
					$(tr).append(td);

				}
			}
		}
		$(table).append(tr);
	}
	$('#region-2').append(table);
});

$("#selectPrice").ready(function() {
    var tr = document.createElement('tr');
    for(var i=0;i<price.length;i++)
    {
        var td = document.createElement('td');
        $(td).css({
            width: '50px',
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
            price: price[i],
        });
        $(td).css("background-size","contain");
        td.innerHTML = price[i] + "元";
        $(tr).append(td);
    }
    var td = document.createElement('td');
    var button = document.createElement('button');
    $(button).addClass("btn");
    $(button).addClass("btn-warning");
    $(button).attr("onclick","returnMain();");
    button.innerText = "返回";
    $(td).append(button);
    $(tr).append(td);
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
             floorSeat[$(this.event.srcElement)[0].getAttribute('floor')-1]--;
             return;
        }
    }

    if($(this.event.srcElement)[0].getAttribute("state")==0)
    {
        $(this.event.srcElement)[0].setAttribute("state","1");
        $(this.event.srcElement)[0].setAttribute("price",price);
        $('#'+id).css('background', color);
        $('#'+id).css("background-size","contain");
        floorSeat[$(this.event.srcElement)[0].getAttribute('floor')-1]++;
        seatNum++;
	 }
    else if($(this.event.srcElement)[0].style.background == color)
    {
        $(this.event.srcElement)[0].setAttribute("state","0");
        $(this.event.srcElement)[0].setAttribute("price","0");
        $('#'+id).css('background', defaultSeat);
        $('#'+id).css("background-size","contain");
        floorSeat[$(this.event.srcElement)[0].getAttribute('floor')-1]--;
        seatNum--;

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

function showButton(){
	var id2 = $(this.event.srcElement)[0].id;
	if($(this.event.srcElement)[0].getAttribute("state") == 0)
	{
	   $('#'+id2)[0].innerText = "全选";
	   $('#'+id2)[0].setAttribute("onclick","selectOneRow()");
	}
	else
	{
	   $('#'+id2)[0].innerText = "取消";
	   $('#'+id2)[0].setAttribute("onclick","cancelselectOneRow()");
	}
}

function showNum(id){
 var id2 = $(this.event.srcElement)[0].id;
	$('#'+id2)[0].innerText = id;
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
    var row = $(this.event.srcElement)[0].getAttribute("id");
    $(this.event.srcElement)[0].setAttribute("state","1");
    for(var j=1; ;j++)
    {
        if($('#'+row+"-"+j)[0] == undefined)
        	break;
        if($('#'+row+"-"+j)[0].getAttribute("state") == 0)
        {
            seatNum++;
            floorSeat[$(this.event.srcElement)[0].getAttribute("floor")-1]++;
        }
        $('#'+row+"-"+j)[0].setAttribute("state","1");
        $('#'+row+"-"+j)[0].setAttribute("price",price);
        $('#'+row+"-"+j).css('background', color);
        $('#'+row+"-"+j).css("background-size","contain");
    }
    $(".ticket")[0].innerText = "总共" + ticketNum +"张票"  + "已选择" + seatNum +"个座位";
}

function cancelselectOneRow(){

    var row = $(this.event.srcElement)[0].getAttribute("id");
     $(this.event.srcElement)[0].setAttribute("state","0");
    for(var j=1;;j++)
    {
    	if($('#'+row+"-"+j)[0] == undefined)
        	break;
        if($('#'+row+"-"+j)[0].getAttribute("state") == 1)
        {
            seatNum--;
            floorSeat[$(this.event.srcElement)[0].getAttribute("floor")-1]--;
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
        floorSeat[floor-1]++;
        column = allSeat[i].column;
        row = allSeat[i].row;
        seatprice = allSeat[i].price;
        id = floor + "-" + row + "-" + column;
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
    for(var i=0;i<3;i++){
    	$('#floor-'+(i+1))[0].innerText = floorSeat[i];
    }
}

function returnMain(){
	for(var i=1;i<5;i++){
		$('#region-'+i).css("display","none");
	}
	$('#selectPriceDiv').css("display","none");
	$('#main-xq').css("display","block");
	$(".ticket")[0].innerText = "总共" + ticketNum +"张票"  + "已选择" + seatNum +"个座位";
	for(var i=0;i<3;i++){
    	$('#floor-'+(i+1))[0].innerText = floorSeat[i];
    }
}