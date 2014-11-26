var price = new Array(20,40,60);
var priceColor = new Array("url(/static/img/seat1.png) no-repeat","url(/static/img/seat3.png) no-repeat","url(/static/img/seat4.png) no-repeat");
var defaultSeat = "url(/static/img/seat-default.png) no-repeat";

var chosenSeat = null;
var chosenSeatID = '';
var currentSection = {
    pointer: null,
    num: 0,
    row: 0,
    column: 0
};
function showSeat(num) {
    //remove old seat table
    var oldTable = document.getElementById('section');
    if (oldTable != null) {
        backIsHit();
    }
    
    var row;
    var column;
    if (num == 1) {
        row = 7;
        column = 7;
    }
    if (num == 2) {
        row = 7;
        column = 7;
    }
    if (num == 3) {
        row = 7;
        column = 4;
    }
    var newTables = document.createElement('div');
    newTables.id = 'section';
    newTables.setAttribute('class', 'sectionDiv');
    var toBeClone = document.getElementById('seat2');
    for (i = 0; i < row; i++) {
        var line = document.createElement('div');
        line.setAttribute('class', 'aRowOfSeats');
            var a = document.createElement('div');
            a.innerHTML = (i + 1);
            a.setAttribute('class', 'rowHeader');
            $(line).append(a);
            for (j = 0; j < column; j++) {
                var a = document.createElement('div');
                    $(a).attr('class', 'smallSeat');
                    $(a).attr({
                        id: (i+1) + "-" + (row*(num-1) + (j + 1)),
                        state: -1,
                        price: 0,
                        row: i + 1,
                        column: j + 1
                    });
                    $(a).css("background", "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat2.png) no-repeat center")
                    $(a).css("background-size", "contain");
                    $(a).css("text-align", "center");

                    $(line).append(a);
                    a.innerHTML = row*(num-1) + (j + 1);
            }
            $(newTables).append(line);
            var clearBoth = document.createElement('div');
            clearBoth.style.clear = 'both';
            $(line).append(clearBoth);
    }
    
    $('#seat').append(newTables);
    addThreeButton();
    $('#seat').css('display', 'block');
    //$('#selectRegion').animate({
    //    //left: '200px'
    //    opacity: '0'
    //});
    $('#selectRegion').css('display', 'none');
    var place = document.getElementById('place');
    place.innerHTML = 'Sector ' + num;

    currentSection.pointer = newTables;
    currentSection.row = row;
    currentSection.column = column;
    currentSection.num = num;
    layer2();
}

function addThreeButton() {
    var backButton = document.createElement('div');
    backButton.id = 'backButton';
    backButton.setAttribute('class', 'threeButton');
    backButton.style.marginLeft = '10%';
    backButton.innerHTML = "Back";
    backButton.setAttribute('onclick', 'backIsHit();');
    var confirmButton = document.createElement('div');
    confirmButton.id = 'confirmButton';
    confirmButton.setAttribute('class', 'threeButton');
    confirmButton.innerHTML = 'Confirm';
    confirmButton.setAttribute('onclick', 'confirmIsHit()');
    var refreshButton = document.createElement('div');
    refreshButton.id = 'refreshButton';
    refreshButton.setAttribute('class', 'threeButton');
    refreshButton.innerHTML = 'Refresh';
    refreshButton.setAttribute('onclick', 'refreshIsHit();');
    var clearBoth = document.createElement('div');
    clearBoth.id = 'clearBoth';
    clearBoth.style.clear = 'both';
    $('#seat').append(backButton);
    $('#seat').append(confirmButton);
    $('#seat').append(refreshButton);
    $('#seat').append(clearBoth);
}

function backIsHit() {
    var oldTable = document.getElementById('section');
    var backButton = document.getElementById('backButton');
    var confirmButton = document.getElementById('confirmButton');
    var clearBoth = document.getElementById('clearBoth');
    var place = document.getElementById('place');
    place.innerHTML = '';
    if (oldTable != null) {
        var divSeat = document.getElementById('seat');
        divSeat.removeChild(oldTable);
        divSeat.removeChild(backButton);
        divSeat.removeChild(confirmButton);
        divSeat.removeChild(refreshButton);
        divSeat.removeChild(clearBoth);
        divSeat.style.display = 'none';
    }
    var tab = document.getElementById('selectRegion');
    tab.style.display = 'block';
    chosenSeat = null;
    chosenSeatID = 0;

}

function confirmIsHit() {
    var chosenColumn = chosenSeat.column;
    var chosenRow = chosenSeat.row;
    var ticketID = ticketPack.ticketID;
    var url = 'http://wx3.igeek.asia/u/chooseSeat/' + weixinOpenID + '/' + ticketID + '/' + chosenRow + '/' + chosenColumn;
    sender = new XMLHttpRequest();
    sender.open('GET', url, true);
    sender.onreadystatechange = function () {
        if (sender.readyState == 4) {
            if (sender.status == 200) {
                var response = sender.responseText;
                switch (response) {
                    case 'Ok':
                        backIsHit();
                        var tab = document.getElementById('selectRegion');
                        tab.style.display = 'none';
                        var ok = document.getElementById('successHolder');
                        var mes = document.createElement('p');
                        mes.innerHTML = chosenSeatID;
                        ok.appendChild(mes);
                        ok.style.display = 'block';
                    default:
                        var place = document.getElementById('place');
                        place.innerHTML = 'Fail. Try Again.';
                }
            }
        }
    }
    sender.send();
}

function refreshIsHit() {
    backIsHit();
    showSeat();
}

function chooseSeat() {
    var theChosen = $(this.event.srcElement)[0];
    var toBeClone_Empty = document.getElementById('seat3');
    var toBeClone_Chosen = document.getElementById('seat2');
    if (chosenSeat != null) {
        chosenSeat.style.background = "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat4.png) no-repeat center";
        chosenSeat.style.backgroundSize = "contain";
    }
    theChosen.style.background = "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat3.png) no-repeat center";
    theChosen.style.backgroundSize = "contain";
    chosenSeat = theChosen;
    chosenSeatID = theChosen.id;
}

function layer2()
{
    len = allSeat.length;
    for(var i = 0; i < len; i++)
    {
        floor = allSeat[i].floor;
        seatprice = allSeat[i].price;
        status= allSeat[i].status;
        row = allSeat[i].row;
        column = allSeat[i].column;
        id = row + "-" + column;
        ss = document.getElementById(id);
        if(ss != undefined){
            $("#"+id).attr("price", seatprice);
            $("#"+id).attr("status", status);
            if(status==0)
            {
                $("#"+id).css("background", "url(https://raw.githubusercontent.com/0Calorie/tsinghuatuan/master/img/seat4.png) no-repeat center");
                $("#"+id).css("background-size", "contain");
                $("#" + id).attr('onclick', 'chooseSeat();');

            }
        }
               
    }
}