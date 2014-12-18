var floorSeat = new Array(0,0,0);
var priceColor = new Array("#FFFF80",
                           "#FF8080",
                           "#FF8040",
                           "#8080FF",
                           "#808000",
                           "#FF0000",
                           "#008080"
                           "#800040");
var defaultSeat = "gray";

function showCursor(){
	  var id = $(this.event.srcElement)[0].id;
	  $('#'+id+' .cursor').css("display","block");
}

function showSeatCursor(){
	 var id = $(this.event.srcElement)[0].id;
	  $('#'+id+' .seatCursor').css("display","block");
}

function cancelShowCursor(){
	 var id = $(this.event.srcElement)[0].id;
	  $('#'+id+' .cursor').css("display","none");
}

function cancelShowSeatCursor(){
	 var id = $(this.event.srcElement)[0].id;
	  $('#'+id+' .seatCursor').css("display","none");
}


function showRegionSeat(num){
	$('#region-'+num).css("display","block");
	$('#main-xq').css("display","none");
	$('#selectPriceDiv').css("display","block");
}

$('#region-1').ready(function(){
	var columnNum = 19;
 	var column = new Array(new Array(5,21,5),
						  new Array(6,21,6),
						  new Array(7,21,7),
						  new Array(8,21,8),
						  new Array(9,21,9),
						  new Array(9,21,9),
						  new Array(9,21,9),
						  new Array(9,21,9),
						  new Array(9,21,9),
						  new Array(9,21,9),
						  new Array(9,21,9),
						  new Array(9,21,9),
						  new Array(9,21,9),
						  new Array(9,21,9),
						  new Array(9,21,9),
						  new Array(8,21,8),
						  new Array(7,21,7),
						  new Array(6,21,6),
						  new Array(5,21,5));

 	var maxColumn = new Array(9,21,9);
 	var table = createTable(1,columnNum,column,maxColumn,1);

	$(table).css({
	    position: 'relative',
	    margin: '0 auto',
	});
$('#region-1').append(table);
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
	var table = createTable(20,columnNum,column,maxColumn,1);
	$(table).css({
    position: 'relative',
    margin: '0 auto',
});
	$('#region-2').append(table);
});

$('#region-3').ready(function(){
	var columnNum = 7;
	var column = new Array(new Array(16,16,20,16,16),
						   new Array(15,18,20,18,15),
						   new Array(14,19,20,19,14),
						   new Array(0,17,20,17,0),
						   new Array(0,12,20,12,0),
						   new Array(0,8,20,8,0),
						   new Array(0,4,12,4,0));
	var maxColumn = new Array(16,19,20,19,16);
	var table = createTable(1,columnNum,column,maxColumn,2);

	$(table).css({
	    position: 'relative',
	    margin: '0 auto',
	});

	$('#region-3').append(table);
});

$('#region-4').ready(function(){
	var columnNum = 7;
	var column = new Array(new Array(16,0,13,20,13,0,16),
						   new Array(10,0,15,20,15,0,10),
						   new Array(10,3,17,20,17,3,10),
						   new Array(0,0,17,20,17,0,0),
						   new Array(0,0,11,20,11,0,0),
						   new Array(0,0,8,20,8,0,0),
						   new Array(0,0,4,20,4,0,0));
	var maxColumn = new Array(16,3,17,20,17,3,16);
	var table = createTable(1,columnNum,column,maxColumn,3);

	$(table).css({
	    position: 'relative',
	    margin: '0 auto',
	});
	$('#region-4').append(table);
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

function alignLeft(tr,i,j,column,maxColumn,row,leftColumn,floor){
	for(var k=0;k<maxColumn[j];k++){
		var td = document.createElement('td');
		if(k >= column[i][j])
		{
			$(td).css({
				width: "25px",
				height: "25px"
			});
		}
		else{
			$(td).addClass("default-seat");
			$(td).attr({
				onclick: "changeColor()",
				onmouseover: "showSeatCursor()",
				onmouseout: "cancelShowSeatCursor()",
				id: floor+"-"+row+"-"+(k+1+leftColumn),
				state: 0,
				price: 0,
				row: row,
				column: (k+1+leftColumn),
				floor: floor
				});
			var div = document.createElement('div');
			$(div).addClass("seatCursor");
			div.innerText = (k+1+leftColumn);
			$(td).append(div);
		}
		$(tr).append(td);

		}
	return tr;
}

function alignCenter(tr,i,j,column,maxColumn,row,leftColumn,floor){
	for(var k=0;k<maxColumn[j];k++){
	var td = document.createElement('td');
	if(k < (maxColumn[j] - column[i][j])/2||k >= (maxColumn[j]-(maxColumn[j] - column[i][j])/2))
	{
		$(td).css({
			width: "25px",
			height: "25px"
		});
	}
	else{
		$(td).addClass("default-seat");
		$(td).attr({
			onclick: "changeColor()",
			onmouseover: "showSeatCursor()",
			onmouseout: "cancelShowSeatCursor()",
			id: floor+"-"+row+"-"+(k+1+leftColumn-(maxColumn[j] - column[i][j])/2),
			state: 0,
			price: 0,
			row: row,
			column: (k+1+leftColumn-(maxColumn[j] - column[i][j])/2),
			floor: floor
			});
		var div = document.createElement('div');
			$(div).addClass("seatCursor");
			div.innerText = (k+1+leftColumn-(maxColumn[j] - column[i][j])/2);
			$(td).append(div);
	}
	$(tr).append(td);
	}
	return tr;
}

function alignRight(tr,i,j,column,maxColumn,row,leftColumn,floor){
	for(var k=0;k<maxColumn[j];k++){
		var td = document.createElement('td');
		if(k < (maxColumn[j] - column[i][j]))
		{
			$(td).css({
				width: "25px",
				height: "25px"
			});
		}
		else{
			$(td).addClass("default-seat");
			$(td).attr({
				onclick: "changeColor()",
				onmouseover: "showSeatCursor()",
				onmouseout: "cancelShowSeatCursor()",
				id: floor+"-"+row+"-"+(k+1+leftColumn-(maxColumn[j] - column[i][j])),
				state: 0,
				price: 0,
				row: row,
				column: (k+1+leftColumn-(maxColumn[j] - column[i][j])),
				floor: floor
				});
			var div = document.createElement('div');
			$(div).addClass("seatCursor");
			div.innerText = (k+1+leftColumn-(maxColumn[j] - column[i][j]));
			$(td).append(div);
		}
		$(tr).append(td);
	}
	return tr;
}

function createTable(num,columnNum,column,maxColumn,floor){
	var table = document.createElement('table');
	for(var i=0;i<columnNum;i++){
		var tr = document.createElement('tr');
		for(var j=0;j<maxColumn.length;j++){
			if(j==0){
				tr = alignRight(tr,i,j,column,maxColumn,i+num,0,floor);
				var b = document.createElement('td');
                        $(b).addClass("colNum");
                        $(b).attr({
                        	state: 0,
                        	onclick: "selectOneRow()",
                        	onmouseover: "showButton()",
                        	onmouseout: "showNum("+(i+num)+")",
                        	id: floor+"-"+(i+num),
                        	floor: floor
                        });
                        b.innerText = i+num;
                        $(tr).append(b);
			}
			else if(j < (maxColumn.length-1)/2){
				var sum = 0;
				for(var k=0;k<j;k++){
					sum += column[i][k];
				}
				tr = alignRight(tr,i,j,column,maxColumn,i+num,sum,floor);
				var b = document.createElement('td');
                        $(b).css('width', '50px');
                        $(b).css('height', '25px');
                        $(b).css("text-align","center");
                        b.innerText = i+num;
                        $(tr).append(b);
			}
			else if(j == maxColumn.length-1){
				var sum = 0;
				for(var k=0;k<j;k++){
					sum += column[i][k];
				}
				tr = alignLeft(tr,i,j,column,maxColumn,i+num,sum ,floor)
			}
			else if(j == (maxColumn.length-1)/2){
				var sum = 0;
				for(var k=0;k<j;k++){
					sum += column[i][k];
				}
				tr = alignCenter(tr,i,j,column,maxColumn,i+num,sum ,floor);
				var b = document.createElement('td');
                        $(b).css('width', '50px');
                        $(b).css('height', '25px');
                         $(b).css("text-align","center");
                        b.innerText = i+num;
                        $(tr).append(b);
			}
			else{		
				var sum = 0;
				for(var k=0;k<j;k++){
					sum += column[i][k];
				}
				tr = alignLeft(tr,i,j,column,maxColumn,i+num,sum,floor);
				var b = document.createElement('td');
                        $(b).css('width', '50px');
                        $(b).css('height', '25px');
                         $(b).css("text-align","center");
                        b.innerText = i+num;
                        $(tr).append(b);
		}
		}
		$(table).append(tr);
	}
	return table;
}
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
    for(var j=1;j<=4;j++){
    for(i=0;i<$('#region-'+j+' td').length;i++)
        {
            if($('#region-'+j+' td')[i].id !=""&&$('#region-'+j+' td')[i].getAttribute("state")==1&&$('#region-'+j+' td')[i].getAttribute("onclick")=="changeColor()")
            {
                if(price == ""){
                    price = price + $('#region-'+j+' td')[i].getAttribute("price");
                }
                else{
                    price = price + " " + $('#region-'+j+' td')[i].getAttribute("price");
                }

                if(row == "") {
                    row = row + $('#region-'+j+' td')[i].getAttribute("row");
                }
                else{
                    row = row + " " + $('#region-'+j+' td')[i].getAttribute("row");
                }

                if(column == ""){
                    column = column + $('#region-'+j+' td')[i].getAttribute("column"); 
                }
                else {
                    column = column + " " + $('#region-'+j+' td')[i].getAttribute("column");                
                }
                    
                if(floor == ""){
                    floor = floor + $('#region-'+j+' td')[i].getAttribute("floor");
                }
                else{
                    floor = floor + " " + $('#region-'+j+' td')[i].getAttribute("floor");
                }
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