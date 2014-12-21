var seatObj = {   
    "A":{
        "row":"21",
        "column":"41",
        "floor":"1",
        "walkWay":[9,31],
        "rowStart":0,
        "columnStart":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        "seat":[
            {"row":"1",  "seat":"29"},
            {"row":"2",  "seat":"31"},
            {"row":"3",  "seat":"33"},
            {"row":"4",  "seat":"35"},
            {"row":"5",  "seat":"37"},
            {"row":"21",  "seat":"21"},
            {"row":"20",  "seat":"31"},
            {"row":"19",  "seat":"33"},
            {"row":"18",  "seat":"35"},
            {"row":"17",  "seat":"37"}
        ]
    },
    "B":{
        "row":"6",
        "column":"60",
        "floor":"1",
        "walkWay":[19, 40],
        "rowStart":21,
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
        "rowStart":22,
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
        "floor":"1",
        "walkWay":[16,17],
        "rowStart":0,
        "columnStart":[68,71,72],
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
            {"row":"5",  "seat":"42"},
            {"row":"6",  "seat":"36"},
            {"row":"7",  "seat":"28"},
        ]
    },
    "DD":{
        "row":"3",
        "column":"34",
        "floor":"1",
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

var data;
var clientHeight = document.documentElement.clientHeight;
var clientWidth = document.documentElement.clientWidth;
$("#selectRegion").css("width", clientWidth);
$("#selectRegion").css("height", clientHeight);

function isWalkWay(row, walkWay)
{
    for(var i = 0; i < walkWay.length; i++)
    {
        if(row == walkWay[i])
            return true;
    }
    return false;
}

function loadSeat(obj) {
    //load basic table
    var row = Number(obj.row);
    var column = Number(obj.column);
    var floor = Number(obj.floor);
    var walkWay = obj.walkWay;
    var table = document.createElement('table');
    var rowStart = obj.rowStart;
    var columnStart = [0,0,0,0,0, 0,0,0,0,0 ,0,0,0,0,0, 0,0,0,0,0,0,0];
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
                    id: floor + '-' + (i + 1) + '-' + (j + 1 + nWalkWay),
                    status: 0,
                    row: (i + 1 + obj.rowStart),
                    column: (Number(j) + 1 - nWalkWay+ columnStart[i]),
                    floor: floor,
                    onclick: "onclick_seat()"
                });
            }
            $(tr).append(td);
        }
        $(table).append(tr);
    }
    $(".seat").append(table);
    //delete some seat

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

}

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
        var gridHeight = $("td").css("width").replace("px","");
        $("td").css("height", gridHeight);
        //$("table").attr("cellspacing", Number(gridHeight));

    }
}

function back()
{
    $(".XQ").css("display","block");
    $(".Information").css("display","none");
    $(".seat").empty();
    $(".seatSelectSeats").empty();
}

function confirm()
{

}

function onclick_seat()
{
    var element = $(this.event.srcElement)[0];
    changeColor(element);
    addToBottom(element);
}

var color_onSaleSeat = "rgb(224, 222, 210)";
var color_defaultSeat = "rgb(150, 246, 185)";
var color_selectSeat = "rgb(255, 214, 0)";

function changeColor(elem)
{
    var bg = $(elem).css("background-color");
    console.log(bg);
    if(bg == color_onSaleSeat)
        $(elem).css("background-color",color_selectSeat);
    else
        $(elem).css("background-color",color_onSaleSeat);
}

function addToBottom(elem)
{
    var click = elem;
    var children = $(".seatSelectSeats").children();
    var row = $(click).attr("row");
    var column = $(click).attr("column");
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
        div.innerText = row + "排" + column + "座";
        console.log(div);
        $(".seatSelectSeats").append(div);
    }
}

function addIllustration(word, color)
{
    var div_illu = document.createElement("div");
    var div_color = document.createElement("div");
    var div_word = document.createElement("div");
    $(div_color).addClass("illu_color");
    $(div_color).css("background-color",color);
    $(div_word).addClass("illu_word");
    div_word.innerText = word;
    $(div_illu).addClass("illu_wrap");
    $(div_illu).append(div_color, div_word);
    $(".illustration").append(div_illu);
}

$(document).ready(function(){
    addIllustration("不可选",color_onSaleSeat);
    addIllustration("可选",color_defaultSeat);
    addIllustration("选中",color_selectSeat);
});
