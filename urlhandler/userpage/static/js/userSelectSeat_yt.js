var seatObj = {   
    "A":{
        "row":"21",
        "column":"41",
        "floor":"1",
        "walkWay":[9,31],
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
        "row":"8",
        "column":"60",
        "floor":"1",
        "walkWay":[19, 40],
        "seat":[
            {"row":"1",  "seat":"52"},
            {"row":"2",  "seat":"56"},
            {"row":"4",  "seat":"54"},
            {"row":"5",  "seat":"44"},
            {"row":"6",  "seat":"36"},
            {"row":"7",  "seat":"28"},
            {"row":"8",  "seat":"12"},
        ]
    },
    "C":{
        "row":"8",
        "column":"60",
        "floor":"2",
        "walkWay":[19, 40],
        "seat":[
            {"row":"1",  "seat":"52"},
            {"row":"2",  "seat":"56"},
            {"row":"4",  "seat":"54"},
            {"row":"5",  "seat":"44"},
            {"row":"6",  "seat":"36"},
            {"row":"7",  "seat":"28"},
            {"row":"8",  "seat":"12"},
        ]
    },
    "D":{
        "row":"7",
        "column":"56",
        "floor":"3",
        "walkWay":[17, 38],
        "seat":[
            {"row":"1",  "seat":"46"},
            {"row":"2",  "seat":"48"},
            {"row":"5",  "seat":"42"},
            {"row":"6",  "seat":"46"},
            {"row":"7",  "seat":"28"},
        ]
    }
} 
var data;
var clientHeight = document.documentElement.clientHeight;
var clientWidth = document.documentElement.clientWidth;
change();
function change(){
    $("#selectRegion").css("width", clientWidth);
    $("#selectRegion").css("height", clientHeight);
}
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
                console.log(j, "walkWay");
            }
            else {
                $(td).addClass("seat_unit");
                $(td).attr({
                    id: floor + '-' + (i + 1) + '-' + (j + 1 + nWalkWay),
                    status: 0,
                    row: (i + 1),
                    column: (Number(j) + 1 + Number(nWalkWay)),
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
        var column_ = 1;
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
            }
            else
            {
                var row_ = $($("td")[n + j]).attr("row");
                $($("td")[n + j]).attr("column", column_- nWalkWay_);
                var floor_ = $($("td")[n + j]).attr("floor");
                $($("td")[n + j]).attr("id", floor_ + '-' + row_+ '-' + (column_+nWalkWay_));
                column_++;
            }
        }

    }
}

function showSeat_yt(place, section)
{
    var row;
    var column;
    $(".Information").css("display","block");
    if(place == "XQ")
    {
        $(".XQ").css("display","none");
        switch(section)
        {
            case 1:
            {
                section = seatObj.A;                     
                break;
            }
            case 2:
            {
                section = seatObj.B; 
                break;
            }
            case 3:
            {
                section = seatObj.C; 
                break;
            }
            case 4:
            {
                section = seatObj.D; 
                break;
            }
            default:break;
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

var color_defaultSeat = "rgb(211, 211, 211)";//light grey
var color_selectSeat = "rgb(255, 192, 203)";//pink
function changeColor(elem)
{
    var bg = $(elem).css("background-color");
    console.log(bg);
    if(bg == color_defaultSeat)
        $(elem).css("background-color",color_selectSeat);
    else
        $(elem).css("background-color",color_defaultSeat);
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