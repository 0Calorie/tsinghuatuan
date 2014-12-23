var color_onSaleSeat = "rgb(150, 246, 185)";
var color_defaultSeat = "rgb(224, 222, 210)";//不可选作为
var color_selectSeat = "rgb(255, 214, 0)";//选中座位
var color_dualNeighborSeat = "rgb(0, 0, 255)";//邻居座位
//不同票价座位颜色
var seatPalette= ["#FFFF80", "#FF8080","#FF8040","#8080FF","#808000", "#FF0000","#008080","#800040"];
var chosenSeat = null;
var chosenDualOne = null;
var chosenDualTwo = null;
var totalPrice = activityPack.totalPrice.split(" ");
var totalPriceLength = totalPrice.length;
//新清华学堂座位图
var seatObj = {   
    "A":{
        "row":"19",
        "column":"41",
        "floor":"1",
        "walkWay":[9,31],
        "rowStart":0,
        "columnStart":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        "seat":[
            {"row":"1",  "seat":"31"},
            {"row":"2",  "seat":"33"},
            {"row":"3",  "seat":"35"},
            {"row":"4",  "seat":"37"},
            {"row":"5",  "seat":"39"},
            {"row":"19",  "seat":"21"},
            {"row":"18",  "seat":"31"},
            {"row":"17",  "seat":"33"},
            {"row":"16",  "seat":"35"},
            {"row":"15",  "seat":"37"}
        ]
    },
    "B":{
        "row":"6",
        "column":"60",
        "floor":"1",
        "walkWay":[19, 40],
        "rowStart":19,
        "columnStart":[16,15,14,0,0,0],
        "seat":[
            {"row":"1",  "seat":"60"},
            {"row":"2",  "seat":"56"},
            {"row":"3",  "seat":"58"},
            {"row":"4",  "seat":"60"},
            {"row":"5",  "seat":"42"},
            {"row":"6",  "seat":"36"},
        ]
    },
    "BB":{
        "row":"3",
        "column":"34",
        "floor":"1",
        "walkWay":[16,17],
        "rowStart":19,
        "columnStart":[76,71,72,0,0,0],
        "seat":[
            {"row":"2",  "seat":"30"},
            {"row":"3",  "seat":"28"},
          ]
    },
    "C":{
        "row":"7",
        "column":"60",
        "floor":"2",
        "walkWay":[19, 40],
        "rowStart":0,
        "columnStart":[16,15,14,0,0,0,0],
        "seat":[
            {"row":"1",  "seat":"52"},
            {"row":"2",  "seat":"56"},
            {"row":"3",  "seat":"58"},
            {"row":"4",  "seat":"54"},
            {"row":"5",  "seat":"44"},
            {"row":"6",  "seat":"36"},
            {"row":"7",  "seat":"20"},
        ]
    },
    "CC":{
        "row":"3",
        "column":"34",
        "floor":"2",
        "walkWay":[16,17],
        "rowStart":0,
        "columnStart":[52,56,58],
        "seat":[
            {"row":"2",  "seat":"30"},
            {"row":"3",  "seat":"28"},
          ]
    },
    "D":{
        "row":"7",
        "column":"56",
        "floor":"3",
        "walkWay":[17, 38],
        "rowStart":0,
        "columnStart":[16,10,13,0,0,0,0],
        "seat":[
            {"row":"1",  "seat":"46"},
            {"row":"2",  "seat":"50"},
            {"row":"3",  "seat":"56"},
            {"row":"4",  "seat":"56"},
            {"row":"5",  "seat":"42"},
            {"row":"6",  "seat":"36"},
            {"row":"7",  "seat":"28"},
        ]
    },
    "DD":{
        "row":"3",
        "column":"34",
        "floor":"3",
        "walkWay":[16,17],
        "rowStart":0,
        "columnStart":[62,60,55],
        "seat":[
            {"row":"2",  "seat":"20"},
            {"row":"3",  "seat":"26"},
          ]
    },
}
var PLACE;
var SECTION;

var clientHeight = document.documentElement.clientHeight;
var clientWidth = document.documentElement.clientWidth;
$("#selectRegion").css("width", clientWidth);
$("#selectRegion").css("height", clientHeight);

$(document).ready(function(){
    //检验用户的合法性
    switch(validity)
    {
        case "Valid":showPlace();break;
        case "ex":
            showException("出现了奇怪的错误，我们已经记下来了");
            break;
        case "Has_Chosen":
            showException("你已经选过座位了，忘记了吗？快去查票");
            break;
        case "Not_Now":
            showException("现在不是你的选座时间");
            break;
        case "No_Such_Ticket":
            showException("查无此票");
            break;
        case "No_Seat_Choosing":
            showException("当前活动不能选座");
            break;
        default:
            showException("出现了奇怪的错误，我们已经记下来了，请稍后重试");
            break;
    }
});

//显示错误提示，参数：文本
function showException(info)
{
    $("#result").css("display", "block");
    $("#exception_info").css("display", "block");
    $("#exception_info").text(info);
}

//显示分区座位图
function showPlace()
{
    $(".XQ").css("display", "block");
    addIllustration("不可选",color_defaultSeat);
    addIllustration("选中",color_selectSeat);
    var colorIndex = 0;
    for(colorIndex;colorIndex<totalPriceLength;colorIndex++){
        addIllustration((" " + totalPrice[colorIndex] + " "), seatPalette[colorIndex]);
    }

    scale();//缩放
    drag();//拖动
}
//判断是否是过道
function isWalkWay(row, walkWay)
{
    for(var i = 0; i < walkWay.length; i++)
    {
        if(row == walkWay[i])
            return true;
    }
    return false;
}
//载入座位图
function loadSeat(obj) {
    //load basic table
    var row = Number(obj.row);
    var column = Number(obj.column);
    var floor = Number(obj.floor);
    var walkWay = obj.walkWay;
    var table = document.createElement('table');
    var rowStart = obj.rowStart;
    var columnStart = [0,0,0,0,0, 0,0,0,0,0 ,0,0,0,0,0, 0,0,0,0,0,0,0];
    //ABCD区，行列号开始数量
    if(SECTION == "B" || SECTION == "C" || SECTION == "A" || SECTION == "D")
        columnStart = obj.columnStart;

    for (var i = 0; i < row; i++)
    {
        var tr = document.createElement('tr');
        var nWalkWay = 0;
        for (var j = 0; j < column; j++)
        {
            var td = document.createElement('td');
            if (isWalkWay(j, walkWay)) {
                $(td).addClass("seat_walkWay");
                $(td).attr({
                    id: "walkWay",
                });
                nWalkWay++;
                columnStart[i] = obj.columnStart[i];
                console.log(j, "walkWay");
            }
            else {
                $(td).addClass("seat_unit");
                $(td).attr({
                    id: floor + '-' + (i + 1 + obj.rowStart) + '-' + (j + 1 - nWalkWay + columnStart[i]),
                    status: -1,
                    row: (i + 1 + obj.rowStart),
                    column: (Number(j) + 1 - nWalkWay+ columnStart[i]),
                    floor: floor,
                });
            }
            $(tr).append(td);
        }
        $(table).append(tr);
    }

    //delete some seat
    $(".seat").append(table);
    $(".seat").css("-webkit-transform","translate3d(0px, 0px, 0px)");//居中
    $(".seat").attr("draggable","true");
    $("td").attr("draggable","false");
    $("tr").attr("draggable", "false");
    //更改掉删除座位的ID
    var len = obj.seat.length;
    var n, seat_start, seat_end, nWalkWay_;
    for (var i = 0; i < len; i++)
    {
        n = (Number(obj.seat[i].row) - 1) * column;
        seat_start = (column - Number(obj.seat[i].seat)) / 2;
        seat_end = seat_start + Number(obj.seat[i].seat);
        var count = 0;
        nWalkWay_ = 0;
        console.log(column);
        console.log(seat_start, seat_end);
        for (var j = 0; j < column; j++)
        {

            if($($("td")[n + j]).hasClass("seat_walkWay"))
                    nWalkWay_++;

            if (j < seat_start - 1 || j > seat_end)
            {
                $($("td")[n + j]).removeClass("seat_unit");
                $($("td")[n + j]).addClass("seat_delete");
                $($("td")[n + j]).removeAttr("onclick");
                $($("td")[n + j]).removeAttr("id");
                $($("td")[n + j]).removeAttr("column");
                $($("td")[n + j]).removeAttr("floor");
                $($("td")[n + j]).removeAttr("row");
                count ++;
            }
            else
            {
                var row_ = $($("td")[n + j]).attr("row");
                var column_ = Number($($("td")[n + j]).attr("column"));
                $($("td")[n + j]).attr("column", column_ -count);
                var floor_ = $($("td")[n + j]).attr("floor");
                $($("td")[n + j]).attr("id", floor_ + '-' + row_+ '-' + (column_-count));
            }
        }

    }
    //载入可以选择的座位
    layer2();
}

//根据地点和显示的区域展示座位
function showSeat_yt(place, sec)
{
    var row;
    var column;
    PLACE = place;
    SECTION = sec;
    $(".Information").css("display","block");
    if(place == "XQ")
    {
        $(".XQ").css("display","none");
        switch(sec)
        {
            case "A":section = seatObj.A; break;
            case "B":section = seatObj.B; break;
            case "C":section = seatObj.C; break;
            case "D":section = seatObj.D; break;
            case "BB":section = seatObj.BB; break;
            case "CC":section = seatObj.CC; break;
            case "DD":section = seatObj.DD; break;
            default:alert("none Select");break;
        }
        loadSeat(section);
        //设置宽度
        var gridHeight = $("td").css("width").replace("px","");
        $("td").css("height", gridHeight);
    }
}

//返回到选区界面
function back()
{
    $(".XQ").css("display","block");
    $(".Information").css("display","none");
    $(".seat").empty();
    $(".seatSelectSeats").empty();
    $("#result").css("display","none");
    $(".failure").css("display","none");
    //$("#target_drag").css("-webkit-transform", "translate3d(0px, 0px, 0px)");
    chosenSeat = null;
    chosenSeat = null;
    chosenDualOne = null;
    chosenDualTwo = null;
}
//添加选中的座位到上方信息栏
function addToBottom(elem)
{
    var click = elem;
    var children = $(".seatSelectSeats").children();
    var row = $(click).attr("row");
    var column = $(click).attr("column");
    var floor = $(click).attr("floor");
    var flag = 0; //尚未选中
    for(var i = 0; i < children.length; i++)
    {
        if($(children[i]).attr("row") == row && $(children[i]).attr("column") == column)
        {
            $(children[i]).remove();
            flag = 1;//取消选择
        }
    }
    if(flag == 0) {
        var div = document.createElement('div');
        $(div).addClass("userSelect");
        $(div).attr({row: row, column: column});
        div.innerText = floor+"层" + row + "排" + column + "座";
        console.log(div);
        $(".seatSelectSeats").append(div);
    }
}

//添加颜色说明
function addIllustration(word, color)
{
    var div_illu = document.createElement("div");
    var div_color = document.createElement("div");
    var p_word = document.createElement("p");
    $(div_color).addClass("illu_color");
    $(div_color).css("background-color",color);
    $(p_word).addClass("illu_word");
    p_word.innerText = word;
    $(div_illu).addClass("illu_wrap");
    $(div_illu).append(div_color, p_word);
    $(".illustration").append(div_illu);
}


//拖动
function drag()
{
    touch.on('#target_drag', 'touchstart', function(ev){
        ev.preventDefault();
    });

    var target = document.getElementById("target_drag");
    var dx, dy;

    touch.on('#target_drag', 'drag', function(ev){
        dx = dx || 0;
        dy = dy || 0;

        var offx = dx + ev.x + "px";
        var offy = dy + ev.y + "px";
        target_width = document.getElementById("target").clientWidth;
        target_height = document.getElementById("target").clientHeight;
        var backx;
        var backy;
        console.log("dx dy" + dx+" " + dy);
        console.log("evx evy" + ev.x+" " + ev.y);

        if(dx + ev.x < 50 - target_width)
            backx = 50 - target_width + "px";

        else if(dx +ev.x > target_width - 20)
            backx = target_width - 20 + "px";

        if(dy + ev.y < 20 - target_height)
            backy  = 20 - target_height + "px";
        else
        {
            if (dy + ev.y > clientHeight/2)
                backy = clientHeight/2 + "px";
        }

        target.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)";
        if(backx != "undefined") {
            target.style.webkitTransform = "translate3d(" + backx + "," + offy + ",0)";
        }
        if(backy != "undefined")
             target.style.webkitTransform = "translate3d(" + offx + "," + backy + ",0)";
    });

    touch.on('#target_drag', 'dragend', function(ev){
        dx += ev.x;
        dy += ev.y;
    });
}
//双指缩放
function scale()
{
    var target = document.getElementById("target");
    target.style.webkitTransition = 'all ease 1s';

    touch.on('#target', 'touchstart', function(ev){
        ev.preventDefault();
    });

    var initialScale = 1;
    var currentScale;

    touch.on('#target', 'pinchend', function(ev){
        currentScale = ev.scale - 1;
        currentScale = initialScale + currentScale;
        currentScale = currentScale > 8 ? 8 : currentScale;
        currentScale = currentScale < 1 ? 1 : currentScale;
        target.style.webkitTransform = 'scale(' + currentScale + ')';
    });

    touch.on('#target', 'pinchend', function(ev){
        initialScale = currentScale;
    });

}

function confirmIsHit() {
    disableOne("backer", 1);
    disableOne("confirmer", 1);
    if(ticketPack.additionalTicketID <= 0)
        confirmIsHit_single();
    else
        confirmIsHit_dual();
    disableOne("backer", 0);
    disableOne("confirmer", 0);
}

function confirmIsHit_single(){
    if(chosenSeat == null)
        return;
    var chosenFloor = chosenSeat.getAttribute('floor');
    var chosenColumn = chosenSeat.getAttribute('column') ;
    var chosenRow = chosenSeat.getAttribute('row') ;
    var url = 'http://wx3.igeek.asia/u/chooseSeatSingle/try/' + weixinOpenID + '/' + ticketPack.ticketID + '/' + chosenFloor + '/' + chosenColumn + '/' + chosenRow;
    sender = new XMLHttpRequest();
    sender.open('GET', url, true);
    confirmIsHit_sendRequest(sender);
}

function confirmIsHit_dual(){
    if(chosenDualOne == null || chosenDualTwo == null)
        return;

    var dualOneRow = chosenDualOne.getAttribute('row');
    var dualOneColumn = chosenDualOne.getAttribute('column');
    var dualOneFloor = chosenDualOne.getAttribute('floor');
    var dualTwoRow = chosenDualTwo.getAttribute('row');
    var dualTwoColumn = chosenDualTwo.getAttribute('column');
    var dualTwoFloor = chosenDualTwo.getAttribute('column');
    var url = 'http://wx3.igeek.asia/u/chooseSeatDual/try/' + weixinOpenID + '/' + ticketPack.ticketID + '/' + dualOneFloor + '/'
     + dualOneColumn + '/' + dualOneRow + '/' + ticketPack.additionalTicketID + '/' + dualTwoFloor + '/' + dualTwoColumn + '/' + dualTwoRow;
     sender = new XMLHttpRequest();
     sender.open('GET', url, true);
     confirmIsHit_sendRequest(sender);
}

function confirmIsHit_sendRequest(sender){
    sender.onreadystatechange = function () {
        if (sender.readyState == 4) {
            if (sender.status == 200) {
                var response = sender.responseText;
                $("#result").css("display","block");
                switch (response) {
                    case 'Ok':
                        $("#success_info").css("display","block");
                        return;
                    case 'No_Such_Ticket':
                        showException("查无此票");
                        return;
                    case 'Has_Side_Ticket':
                        showException("你的票在你的小伙伴手里~");
                        return;
                    case 'No_Such_Side_Ticket':
                        showException("出现了奇怪的双人票错误");
                        return;
                    case 'ex':
                        showException("出现了奇怪的错误");
                        return;
                    default:
                        $("#failure_info").css("display", "block");
                        if(response != 'Selected' || response != 'oneSelected' || response != 'twoSelected'){
                            $("#failure_info")[0].innerText = response;
                            chooseSeat_seatStatusUpdate();
                        }

                        return;
                }
            }
            else{
                $("#result").css("display","block");
                $("#failure_info").css("display", "block");
                $("#failure_info")[0].innerText = '服务器连接异常，请稍后重试。'
            }
        }
    }
    sender.send();
}

/* chooseSeat series start from here */
function chooseSeat() {
    if(ticketPack.additionalTicketID <= 0){
        chooseSeat_single();
    }
    else{
        if(dualSeatCheckShortcut(chooseSeat_SECTIONTransformer(SECTION)) == true){
            chooseSeat_dualOne();
        }
        else{
            chooseSeat_dualSingle();
        }
    }
}
/*选择单人座*/
function chooseSeat_single(){
    var theChosen = $(this.event.srcElement)[0];
    if (chosenSeat != null) {
        chooseSeat_interfaceProcess(0, chosenSeat);
        chosenSeat = null;
    }
    chooseSeat_interfaceProcess(1, theChosen);
    chosenSeat = theChosen;
}
/*选择双人座*/
function chooseSeat_dualOne(){
    var theChosen = $(this.event.srcElement)[0];
    if(chosenDualOne != null){
        chooseSeat_interfaceProcess(0, chosenDualOne);
        chooseSeat_dualOne_chosenDualOneIsNotNull();
        chosenDualOne = null;
    }
    chooseSeat_interfaceProcess(1, theChosen);
    chosenDualOne = theChosen;
    chooseSeat_dualOne_restrictChoices();
}

function chooseSeat_dualOne_chosenDualOneIsNotNull(){
    // set chosenDualOne's neighbors' onclick to chooseSeat, and set chosenDualTwo to null

    var dualOneRow = chosenDualOne.getAttribute('row');
    var dualOneColumn = chosenDualOne.getAttribute('column');
    var dualOneFloor = chosenDualOne.getAttribute('floor');
    var rightNeighborID = dualOneFloor + '-' + dualOneRow + '-' + (dualOneColumn+1);
    var leftNeighborID = dualOneFloor + '-' + dualOneRow + '-' + (dualOneColumn-1);

    var rightNeighbor = document.getElementById(rightNeighborID);
    var leftNeighbor = document.getElementById(leftNeighborID);
    if(rightNeighbor != undefined){
        rightNeighbor.setAttribute('onclick', 'chooseSeat();');
        chooseSeat_setSeatToUnchosen(rightNeighbor);
        if(chosenDualTwo == rightNeighbor){
            addToBottom(chosenDualTwo);
        }
    }
    if(leftNeighbor != undefined){
        leftNeighbor.setAttribute('onclick', 'chooseSeat();');
        chooseSeat_setSeatToUnchosen(leftNeighbor);
        if(chosenDualTwo == leftNeighbor){
            addToBottom(chosenDualTwo);
        }
    }

    chosenDualOne = null;
    chosenDualTwo = null;
}

function chooseSeat_dualOne_restrictChoices(){
    // set neighbors' onclick to chooseSeat_dual2, while others don't change a thing
    var dualOneRow = chosenDualOne.getAttribute('row');
    var dualOneColumn = chosenDualOne.getAttribute('column');
    var dualOneFloor = chosenDualOne.getAttribute('floor');
    var rightNeighborID = dualOneFloor + '-' + dualOneRow + '-' + (dualOneColumn+1);
    var leftNeighborID = dualOneFloor + '-' + dualOneRow + '-' + (dualOneColumn-1);

    var rightNeighbor = document.getElementById(rightNeighborID);
    var leftNeighbor = document.getClientWidth(leftNeighborID);
    if(rightNeighbor != undefined){
        rightNeighbor.setAttribute('onclick', 'chooseSeat_dualTwo();');
        chooseSeat_setSeatToUnchosenDualTwo(rightNeighbor);
    }
    if(leftNeighbor != undefined){
        leftNeighbor.setAttribute('onclick', 'chooseSeat_dualTwo();');
        chooseSeat_setSeatToUnchosenDualTwo(leftNeighbor);
    }
}

function chooseSeat_dualTwo(){
    var theChosen = $(this.event.srcElement)[0];
    if(chosenDualTwo != null){
        chooseSeat_interfaceProcess(0, chosenDualTwo);
        chosenDualTwo = null;
    }
    chooseSeat_interfaceProcess(1, theChosen);
    chosenDualTwo = theChosen;
}

function chooseSeat_dualSingle(){
    var theChosen = $(this.event.srcElement)[0];
    if(chosenDualOne == theChosen){
        chooseSeat_interfaceProcess(0, chosenDualOne);
        chosenDualOne = null;
        return;
    }
    if(chosenDualTwo == theChosen){
        chooseSeat_interfaceProcess(0, chosenDualTwo);
        chosenDualTwo = null;
        return;
    }
    if(chosenDualOne == null){
        chooseSeat_interfaceProcess(1, theChosen);
        chosenDualOne = theChosen;
        return;
    }
    if(chosenDualTwo == null){
        chooseSeat_interfaceProcess(1, theChosen);
        chosenDualTwo = theChosen;
        return;
    }

}

function chooseSeat_interfaceProcess(toChosenOrUnchosen, theChosen){
    addToBottom(theChosen)
    if(toChosenOrUnchosen == 1){
        chooseSeat_setSeatToChosen(theChosen);
    }
    else if(toChosenOrUnchosen == 0){
        chooseSeat_setSeatToUnchosen(theChosen);
    }
}

function chooseSeat_setSeatToUnchosen(theChosen){
    //theChosen.style.background = "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat4.png) no-repeat center";
    //theChosen.style.backgroundSize = "contain";
    var colorIndex = 0;
    var seatPrice = theChosen.getAttribute("price");
    for(colorIndex;colorIndex<totalPriceLength;colorIndex++){
        if(seatPrice == totalPrice[colorIndex])
            break;
    }
    theChosen.style.backgroundColor = seatPalette[colorIndex];
}

function chooseSeat_setSeatToChosen(theChosen){
    //theChosen.style.background = "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat3.png) no-repeat center";
    //theChosen.style.backgroundSize = "contain";
    theChosen.style.backgroundColor = color_selectSeat;
}

function chooseSeat_setSeatToUnchosenDualTwo(theChosen){
    //theChosen.style.background = "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat6.png) no-repeat center";
    //theChosen.style.backgroundSize = "contain";
    theChosen.style.backgroundColor = color_dualNeighborSeat;
}

function chooseSeat_seatStatusUpdate(){
    var updater = new XMLHttpRequest();
    var url = 'http://wx3.igeek.asia/u/chooseSeat/update/' + weixinOpenID + '/' + ticketPack.ticketID;
    updater.open('GET', url, true);
    updater.onreadystatechange = function(){
        if(updater.readyState == 4){
            if(updater.status == 200){
                allSeat = JSON.parse(updater.responseText);
            }
            else {
                $("#result").css("display","block");
                $("#failure_info").css("display", "block");
                $("#failure_info")[0].innerText = '服务器连接异常，请稍后重试。'
            }
        }
    }
}

function layer2(){


    var len = allSeat.length;
    for(var i = 0; i < len; i++)
    {
        var floor = allSeat[i].seat_floor;
        var seatprice = allSeat[i].seat_price;
        var status= allSeat[i].status;
        var row = allSeat[i].seat_row;
        var column = allSeat[i].seat_column;
        var id = floor + "-" + row + "-" + column;
        var ss = document.getElementById(id);
        if(ss != undefined){
            if(status==0)
            {
                //$("#"+id).css("background", "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat4.png) no-repeat center");
                //$("#"+id).css("background-size", "contain");
                ss.setAttribute('price', seatprice);
                ss.setAttribute('status', status);
                chooseSeat_setSeatToUnchosen(ss);
                //ss.setAttribute('onclick', 'chooseSeat();');
                touch.on(ss, 'tap', function(ev){
                    chooseSeat();
                });
            }
        }
    }
}

function chooseSeat_SECTIONTransformer(section){
    if(section == 'A')
        return 0;
    if(section == 'B' || section == 'BB')
        return 1;
    if(section == 'C' || section == 'CC')
        return 2;
    if(section == 'D' || section == 'DD')
        return 3;
}

/* chooseSeat series ends here */

/* dualSeat Checker series will check if there are two seats that are consecutive*/
/* dualSeat Checker series starts here */
var firstFloorPoolSeats = new Array(new Array(5,21,5),
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
                          new Array(5,21,5),
                          new Array(0,21,0));

var firstFloorStairSeats = new Array(new Array(16,14,22,14,16),
                           new Array(15,17,22,17,15),
                           new Array(14,19,22,19,14),
                           new Array(0,14,22,14,0),
                           new Array(0,10,22,10,0),
                           new Array(0,4,18,4,0));

var secondFloorStairSeats = new Array(new Array(16,16,20,16,16),
                           new Array(15,18,20,18,15),
                           new Array(14,19,20,19,14),
                           new Array(0,17,20,17,0),
                           new Array(0,12,20,12,0),
                           new Array(0,8,20,8,0),
                           new Array(0,4,12,4,0));

var thirdFloorStairSeats = new Array(new Array(16,0,13,20,13,0,16),
                           new Array(10,0,15,20,15,0,10),
                           new Array(10,3,17,20,17,3,10),
                           new Array(0,0,17,20,17,0,0),
                           new Array(0,0,11,20,11,0,0),
                           new Array(0,0,8,20,8,0,0),
                           new Array(0,0,4,20,4,0,0));

function dualSeatChecker(floor, seats, numberOfColumn, numberOfRow){
    var dualCounter = 0;
    var column = 0, row = 0, sectorIndex = 1, seatIndex = 1;
    for(column = 0; column < numberOfColumn; column++){
        seatIndex = 1;
        for(row = 0; row < numberOfRow; row++){
            dualCounter = 0;
            for(sectorIndex = 1; sectorIndex <= seats[column][row]; sectorIndex++, seatIndex++){
                var seatID = floor + "-" + column + "-" + seatIndex;
                var seat = document.getElementById(seatID);
                if(seat == null)
                    continue;
                if(seat.getAttribute('status') == 0){
                    dualCounter++;
                    if(dualCounter == 2){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function firstFloorDualSeatCheck_pool(){
    var poolSeatState = dualSeatChecker(1, firstFloorPoolSeats, 19, 3);
    return poolSeatState;
}

function firstFloorDualSeatCheck_stair(){
    var stairSeatState = dualSeatChecker(1, firstFloorStairSeats, 6, 5);
    return stairSeatState;
}

function secondFloorDualSeatCheck(){
    var stairSeatState = dualSeatChecker(2, secondFloorStairSeats, 7, 5);
    return stairSeatState;
}

function thirdFloorDualSeatCheck(){
    var stairSeatState = dualSeatChecker(3, thirdFloorStairSeats, 7, 7);
    return stairSeatState;
}

function dualSeatCheckShortcut(targetSector){
    if(targetSector == 0){
        return dualSeatChecker(1, firstFloorPoolSeats, 19, 3);
    }
    if(targetSector == 1){
        return dualSeatChecker(1, firstFloorStairSeats, 6, 5);
    }
    if(targetSector == 2){
        return dualSeatChecker(2, secondFloorStairSeats, 7, 5);
    }
    if(targetSector == 3){
        return dualSeatChecker(3, thirdFloorStairSeats, 7, 7);
    }
}
/* dualSeat Checker series ends here */

function disableOne(id, flag) {
    var dom = document.getElementById(id);
    if (flag) {
        dom.setAttribute('disabled', 'disabled');
    } else {
        dom.removeAttribute('disabled');
    }
}