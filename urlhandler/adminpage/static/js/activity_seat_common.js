
/*定义全局变量*/
var priceColor = new Array("#FFFF80",
                           "#FF8080",
                           "#FF8040",
                           "#8080FF",
                           "#808000",
                           "#FF0000",
                           "#008080",
                           "#800040");
var defaultSeat = "gray";


/*显示座位号*/
function cancelShowSeatCursor(){
	 var id = $(this.event.srcElement)[0].id;
	  $('#'+id+' .seatCursor').css("display","none");
}
function showSeatCursor(){
     var id = $(this.event.srcElement)[0].id;
      $('#'+id+' .seatCursor').css("display","block");
}

/*将座位左对齐*/
function alignLeft(tr,i,j,seatDetail,maxColumn,row,leftColumn,floor){
	for(var k=0;k<maxColumn[j];k++){
		var td = document.createElement('td');
		if(k >= seatDetail[i][j])
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


/*将座位居中排列*/
function alignCenter(tr,i,j,seatDetail,maxColumn,row,leftColumn,floor){
	for(var k=0;k<maxColumn[j];k++){
	var td = document.createElement('td');
	if(k < (maxColumn[j] - seatDetail[i][j])/2||k >= (maxColumn[j]-(maxColumn[j] - seatDetail[i][j])/2))
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
			id: floor+"-"+row+"-"+(k+1+leftColumn-(maxColumn[j] - seatDetail[i][j])/2),
			state: 0,
			price: 0,
			row: row,
			column: (k+1+leftColumn-(maxColumn[j] - seatDetail[i][j])/2),
			floor: floor
			});
		var div = document.createElement('div');
			$(div).addClass("seatCursor");
			div.innerText = (k+1+leftColumn-(maxColumn[j] - seatDetail[i][j])/2);
			$(td).append(div);
	}
	$(tr).append(td);
	}
	return tr;
}


/*将座位右对齐*/
function alignRight(tr,i,j,seatDetail,maxColumn,row,leftColumn,floor){
	for(var k=0;k<maxColumn[j];k++){
		var td = document.createElement('td');
		if(k < (maxColumn[j] - seatDetail[i][j]))
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
				id: floor+"-"+row+"-"+(k+1+leftColumn-(maxColumn[j] - seatDetail[i][j])),
				state: 0,
				price: 0,
				row: row,
				column: (k+1+leftColumn-(maxColumn[j] - seatDetail[i][j])),
				floor: floor
				});
			var div = document.createElement('div');
			$(div).addClass("seatCursor");
			div.innerText = (k+1+leftColumn-(maxColumn[j] - seatDetail[i][j]));
			$(td).append(div);
		}
		$(tr).append(td);
	}
	return tr;
}


/*创建座位表*/
function createTable(num,columnNum,seatDetail,maxColumn,floor){
	var table = document.createElement('table');
	for(var i=0;i<columnNum;i++){
		var tr = document.createElement('tr');
		for(var j=0;j<maxColumn.length;j++){
			if(j==0){
				tr = alignRight(tr,i,j,seatDetail,maxColumn,i+num,0,floor);
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
					sum += seatDetail[i][k];
				}
				tr = alignRight(tr,i,j,seatDetail,maxColumn,i+num,sum,floor);
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
					sum += seatDetail[i][k];
				}
				tr = alignLeft(tr,i,j,seatDetail,maxColumn,i+num,sum ,floor)
			}
			else if(j == (maxColumn.length-1)/2){
				var sum = 0;
				for(var k=0;k<j;k++){
					sum += seatDetail[i][k];
				}
				tr = alignCenter(tr,i,j,seatDetail,maxColumn,i+num,sum ,floor);
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
					sum += seatDetail[i][k];
				}
				tr = alignLeft(tr,i,j,seatDetail,maxColumn,i+num,sum,floor);
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


/*座位点击函数*/
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
    $(".ticket")[0].innerText = "总共" + ticketNum +"张票"  + "已选择" + seatNum +"个座位";
	for(var i=0;i<3;i++){
    	$('#floor-'+(i+1))[0].innerText = floorSeat[i];
    }
}


/*选择价位的点击函数*/
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

/*显示全选或者取消*/
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


/*选择一排函数*/
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
	for(var i=0;i<3;i++){
    	$('#floor-'+(i+1))[0].innerText = floorSeat[i];
    }
}


/*取消全选一排*/
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
	for(var i=0;i<3;i++){
    	$('#floor-'+(i+1))[0].innerText = floorSeat[i];
    }
}

/*提交座位*/
function postSeat() {

    /*如果座位数和数据库一致，则可以提交*/
    if(ticketNum == seatNum)
    {
        postSeat_();
        $("#submitButton1").click();
    }
    else
    {
        alert("票数和选的座位数不符！请重新修改！");
    }

}

/*提交数据到数据库*/
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
    for(var i=0;i<floorSeat.length;i++){
    	$('#floor-'+(i+1))[0].innerText = floorSeat[i];
    }
}
