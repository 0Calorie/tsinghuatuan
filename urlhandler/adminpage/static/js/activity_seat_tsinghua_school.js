var floorSeat = new Array(0,0,0);
var priceColor = new Array("#FFFF80",
                           "#FF8080",
                           "#FF8040",
                           "#8080FF",
                           "#808000",
                           "#FF0000",
                           "#008080",
                           "#800040");
var defaultSeat = "gray";

function showCursor(){
	  var id = $(this.event.srcElement)[0].id;
	  $('#'+id+' .cursor').css("display","block");
}

function cancelShowCursor(){
	 var id = $(this.event.srcElement)[0].id;
	  $('#'+id+' .cursor').css("display","none");
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