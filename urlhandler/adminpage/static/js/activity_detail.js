/**
 * Created with PyCharm.
 * User: Epsirom
 * Date: 13-11-30
 * Time: 上午11:43
 */
/*
var datetimepicker_option = {
    format: "yyyy年mm月dd日 - hh:ii",
    autoclose: true,
    pickerPosition: "bottom-left",
    weekStart: 1,
    todayBtn:  1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    forceParse: 0,
    showMeridian: 1,
    language: 'zh-CN'
};

$(".form_datetime").datetimepicker(datetimepicker_option);

function enableDatetimePicker(dom) {
    dom.datetimepicker(datetimepicker_option);
    dom.children('.input-group-addon').css('cursor', 'pointer').children().css('cursor', 'pointer');
}

function disableDatetimePicker(dom) {
    dom.datetimepicker('remove');
    dom.children('.input-group-addon').css('cursor', 'no-drop').children().css('cursor', 'no-drop');
}
*/
var dateInterfaceMap = {
    'year': 'getFullYear',
    'month': 'getMonth',
    'day': 'getDate',
    'hour': 'getHours',
    'minute': 'getMinutes'
}, actionMap = {
    'value': function(dom, value) {
        dom.val(value);
    },
    'text': function(dom, value) {
        dom.text(value);
    },
    'time': function(dom, value) {
        if (value instanceof Object) {
            var parts = dom.children(), i, len, part;
            for (i = 0, len = parts.length; i < len; ++i) {
                part = $(parts[i]).children();
                if (part.attr('date-part')) {
                    part.val(value[part.attr('date-part')]);
                }
            }
        }
    }
}, keyMap = {
    'name': 'value',
    'key': 'value',
    'description': 'value',
    'start_time': 'time',
    'end_time': 'time',
    'place': 'value',
    'book_start': 'time',
    'book_end': 'time',
    'select_start': 'time',
    'select_end': 'time',
    'pic_url': 'value',
    'total_tickets': 'value',
    'seat_status': 'value',
    'group_size': 'value',
    'group_interval': 'value',
    'total_price':'value'
}, lockMap = {
    'value': function(dom, lock) {
        dom.prop('disabled', lock);
    },
    'text': function(dom, lock) {
        dom.prop('disabled', lock);
    },
    'time': function(dom, lock) {
        var parts = dom.children(), i, len, part;
        for (i = 0, len = parts.length; i < len; ++i) {
            part = $(parts[i]).children();
            if (part.attr('date-part')) {
                part.prop('disabled', lock);
            }
        }
        dom.prop('disabled', lock);
    }
};

var curstatus = 0;

function updateActivity(nact) {
    var key, key2, tdate;
    for (key in nact) {
        if (keyMap[key] == 'time') {
            activity[key] = {};
            tdate = new Date(nact[key])
            for (key2 in dateInterfaceMap) {
                activity[key][key2] = tdate[dateInterfaceMap[key2]]() + ((key2 == 'month') ? 1 : 0);
            }
        } else {
            activity[key] = nact[key];
        }
    }
}

function initializeForm(activity) {
    var key;
    for (key in keyMap) {
        actionMap[keyMap[key]]($('#input-' + key), activity[key]);
    }

    $('#activity-start-input')[0].value = "" + $('#input-start-year')[0].value;
    if($('#input-start-month')[0].value < 10)
        $('#activity-start-input')[0].value += "-0" + $('#input-start-month')[0].value;
    else
        $('#activity-start-input')[0].value += "-" + $('#input-start-month')[0].value;
    if($('#input-start-day')[0].value  < 10)
        $('#activity-start-input')[0].value +=   "-0" + $('#input-start-day')[0].value;
    else
        $('#activity-start-input')[0].value +=   "-" + $('#input-start-day')[0].value;
    if($('#input-start-hour')[0].value < 10 )
        $('#activity-start-input')[0].value += " 0" + $('#input-start-hour')[0].value;
    else
        $('#activity-start-input')[0].value += " " + $('#input-start-hour')[0].value;
    if($('#input-start-minute')[0].value < 10) 
        $('#activity-start-input')[0].value += ":0" + $('#input-start-minute')[0].value;
    else
        $('#activity-start-input')[0].value += ":" + $('#input-start-minute')[0].value;


     $('#activity-end-input')[0].value = "" + $('#input-end-year')[0].value;
    if($('#input-end-month')[0].value < 10)
        $('#activity-end-input')[0].value += "-0" + $('#input-end-month')[0].value;
    else
        $('#activity-end-input')[0].value += "-" + $('#input-end-month')[0].value;
    if($('#input-end-day')[0].value  < 10)
        $('#activity-end-input')[0].value +=   "-0" + $('#input-end-day')[0].value;
    else
        $('#activity-end-input')[0].value +=   "-" + $('#input-end-day')[0].value;
    if($('#input-end-hour')[0].value < 10 )
        $('#activity-end-input')[0].value += " 0" + $('#input-end-hour')[0].value;
    else
        $('#activity-end-input')[0].value += " " + $('#input-end-hour')[0].value;
    if($('#input-end-minute')[0].value < 10) 
        $('#activity-end-input')[0].value += ":0" + $('#input-end-minute')[0].value;
    else
        $('#activity-start-input')[0].value += ":" + $('#input-start-minute')[0].value;
   

    $('#book-start-input')[0].value = "" + $('#input-book-start-year')[0].value;
    if($('#input-book-start-month')[0].value < 10)
        $('#book-start-input')[0].value += "-0" + $('#input-book-start-month')[0].value;
    else
        $('#book-start-input')[0].value += "-" + $('#input-book-start-month')[0].value;
    if($('#input-book-start-day')[0].value  < 10)
        $('#book-start-input')[0].value +=   "-0" + $('#input-book-start-day')[0].value;
    else
        $('#book-start-input')[0].value +=   "-" + $('#input-book-start-day')[0].value;
    if($('#input-book-start-hour')[0].value < 10 )
        $('#book-start-input')[0].value += " 0" + $('#input-book-start-hour')[0].value;
    else
        $('#book-start-input')[0].value += " " + $('#input-book-start-hour')[0].value;
    if($('#input-book-start-minute')[0].value < 10) 
        $('#book-start-input')[0].value += ":0" + $('#input-book-start-minute')[0].value;
    else
        $('#book-start-input')[0].value += ":" + $('#input-book-start-minute')[0].value;

     $('#book-end-input')[0].value = "" + $('#input-book-end-year')[0].value;
    if($('#input-book-end-month')[0].value < 10)
        $('#book-end-input')[0].value += "-0" + $('#input-book-end-month')[0].value;
    else
        $('#book-end-input')[0].value += "-" + $('#input-book-end-month')[0].value;
    if($('#input-book-end-day')[0].value  < 10)
        $('#book-end-input')[0].value +=   "-0" + $('#input-book-end-day')[0].value;
    else
        $('#book-end-input')[0].value +=   "-" + $('#input-book-end-day')[0].value;
    if($('#input-book-end-hour')[0].value < 10 )
        $('#book-end-input')[0].value += " 0" + $('#input-book-end-hour')[0].value;
    else
        $('#book-end-input')[0].value += " " + $('#input-book-end-hour')[0].value;
    if($('#input-book-end-minute')[0].value < 10) 
        $('#book-end-input')[0].value += ":0" + $('#input-book-end-minute')[0].value;
    else
        $('#book-end-input')[0].value += ":" + $('#input-book-end-minute')[0].value;

    $('#seat-start-input')[0].value = "" + $('#input-select-start-year')[0].value;
    if($('#input-select-start-month')[0].value < 10)
        $('#seat-start-input')[0].value += "-0" + $('#input-select-start-month')[0].value;
    else
        $('#seat-start-input')[0].value += "-" + $('#input-select-start-month')[0].value;
    if($('#input-select-start-day')[0].value  < 10)
        $('#seat-start-input')[0].value +=   "-0" + $('#input-select-start-day')[0].value;
    else
        $('#seat-start-input')[0].value +=   "-" + $('#input-select-start-day')[0].value;
    if($('#input-select-start-hour')[0].value < 10 )
        $('#seat-start-input')[0].value += " 0" + $('#input-select-start-hour')[0].value;
    else
        $('#seat-start-input')[0].value += " " + $('#input-select-start-hour')[0].value;
    if($('#input-select-start-minute')[0].value < 10) 
        $('#seat-start-input')[0].value += ":0" + $('#input-select-start-minute')[0].value;
    else
        $('#seat-start-input')[0].value += ":" + $('#input-select-start-minute')[0].value;

     $('#seat-end-input')[0].value = "" + $('#input-select-end-year')[0].value;
    if($('#input-select-end-month')[0].value < 10)
        $('#seat-end-input')[0].value += "-0" + $('#input-select-end-month')[0].value;
    else
        $('#seat-end-input')[0].value += "-" + $('#input-select-end-month')[0].value;
    if($('#input-select-end-day')[0].value  < 10)
        $('#seat-end-input')[0].value +=   "-0" + $('#input-select-end-day')[0].value;
    else
        $('#seat-end-input')[0].value +=   "-" + $('#input-select-end-day')[0].value;
    if($('#input-select-end-hour')[0].value < 10 )
        $('#seat-end-input')[0].value += " 0" + $('#input-select-end-hour')[0].value;
    else
        $('#seat-end-input')[0].value += " " + $('#input-select-end-hour')[0].value;
    if($('#input-select-end-minute')[0].value < 10) 
        $('#seat-end-input')[0].value += ":0" + $('#input-select-end-minute')[0].value;
    else
        $('#seat-end-input')[0].value += ":" + $('#input-select-end-minute')[0].value;
    
    if (!activity.id) {
        $('#input-name').val('');
        //新增活动，自动生成年份
        var curyear = new Date().getFullYear();
        var curmonth = new Date().getMonth() + 1;
        $('#input-start-year').val(curyear);
        $('#input-end-year').val(curyear);
        $('#input-book-start-year').val(curyear);
        $('#input-book-end-year').val(curyear);
        $('#input-start-month').val(curmonth);
        $('#input-end-month').val(curmonth);
        $('#input-book-start-month').val(curmonth);
        $('#input-book-end-month').val(curmonth);
        $('#input-start-day').val(curmonth);
        $('#input-end-day').val(curmonth);
        $('#input-book-start-day').val(curmonth);
        $('#input-book-end-day').val(curmonth);
        $('#input-start-minute').val(0);
        $('#input-end-minute').val(0);
        $('#input-start-hour').val(0);
        $('#input-end-hour').val(0);
        $('#input-book-start-minute').val(0);
        $('#input-book-end-minute').val(0);
        $('#input-book-start-hour').val(0);
        $('#input-book-end-hour').val(0);
        $('#input-seat_status').val(0);
        $('#activity-start-input')[0].value = "";
        $('#activity-end-input')[0].value = "";
        $('#book-start-input')[0].value = "";
        $('#book-end-input')[0].value = "";
        $('#seat-start-input')[0].value = "";
        $('#seat-end-input')[0].value = "";
    }
    if (typeof activity.checked_tickets !== 'undefined') {
        initialProgress(activity.checked_tickets, activity.ordered_tickets, activity.total_tickets);
    }
    curstatus = activity.status;
    lockByStatus(curstatus, activity.book_start, activity.start_time, activity.end_time);
}

function check_percent(p) {
    if (p > 100.0) {
        return 100.0;
    } else {
        return p;
    }
}

function checktime(){
    var actstart = new Date($('#input-start-year').val(), $('#input-start-month').val()-1, $('#input-start-day').val(), $('#input-start-hour').val(), $('#input-start-minute').val());
    var actend = new Date($('#input-end-year').val(), $('#input-end-month').val()-1, $('#input-end-day').val(), $('#input-end-hour').val(), $('#input-end-minute').val());
    var bookstart = new Date($('#input-book-start-year').val(), $('#input-book-start-month').val()-1, $('#input-book-start-day').val(), $('#input-book-start-hour').val(), $('#input-book-start-minute').val());
    var bookend = new Date($('#input-book-end-year').val(), $('#input-book-end-month').val()-1, $('#input-book-end-day').val(), $('#input-book-end-hour').val(), $('#input-book-end-minute').val());
    var now = new Date();
    if(curstatus == 0){
        if(bookstart < now){
            $('#input-book-start-year').popover({
                    html: true,
                    placement: 'top',
                    title:'',
                    content: '<span style="color:red;">“订票开始时间”应晚于“当前时间”</span>',
                    trigger: 'focus',
                    container: 'body'
            });
            $('#input-book-start-year').focus();
            return false;
        }

        if(bookend < bookstart){
            $('#input-book-end-year').popover({
                html: true,
                placement: 'top',
                title:'',
                content: '<span style="color:red;">“订票结束时间”应晚于“订票开始时间”</span>',
                trigger: 'focus',
                container: 'body'
            });
            $('#input-book-end-year').focus();
            return false;
        }
    }
    if(actstart < bookend){
        $('#input-start-year').popover({
                html: true,
                placement: 'top',
                title:'',
                content: '<span style="color:red;">“活动开始时间”应晚于“订票结束时间”</span>',
                trigger: 'focus',
                container: 'body'
        });
         $('#input-start-year').focus();
        return false;
    }
    if(actend < actstart){
        $('#input-end-year').popover({
            html: true,
            placement: 'top',
            title:'',
            content: '<span style="color:red;">“活动结束时间”应晚于“活动开始时间”</span>',
            trigger: 'focus',
            container: 'body'
        });
         $('#input-end-year').focus();
        return false;
    }
    return true;
}

function initialProgress(checked, ordered, total) {
    $('#tickets-checked').css('width', check_percent(100.0 * checked / total) + '%')
        .tooltip('destroy').tooltip({'title': '已检入：' + checked + '/' + ordered + '=' + (100.0 * checked / ordered).toFixed(2) + '%'});
    $('#tickets-ordered').css('width', check_percent(100.0 * (ordered - checked) / total) + '%')
        .tooltip('destroy').tooltip({'title': '订票总数：' + ordered + '/' + total + '=' + (100.0 * ordered / total).toFixed(2) + '%' + '，其中未检票：' + (ordered - checked) + '/' + ordered + '=' + (100.0 * (ordered - checked) / ordered).toFixed(2) + '%'});
    $('#tickets-remain').css('width', check_percent(100.0 * (total - ordered) / total) + '%')
        .tooltip('destroy').tooltip({'title': '余票：' + (total - ordered) + '/' + total + '=' + (100.0 * (total - ordered) / total).toFixed(2) + '%'});
}

function changeView(id) {
    var opt = ['noscript', 'form', 'processing', 'result'], len = opt.length, i;
    for (i = 0; i < len; ++i) {
        $('#detail-' + opt[i]).hide();
    }
    $('#detail-' + id).show();
}

function showForm() {
    changeView('form');
}

function showProcessing() {
    changeView('processing');
}

function showResult() {
    changeView('result');
}

function setResult(str) {
    $('#resultHolder').text(str);
}

function appendResult(str) {
    var dom = $('#resultHolder');
    dom.text(dom.text() + str + '\r\n');
}

function lockForm() {
    var key;
    for (key in keyMap) {
        lockMap[keyMap[key]]($('#input-' + key), true);
    }
    $('#publishBtn').hide();
    $('#saveBtn').hide();
    $('#resetBtn').hide();
}

function lockByStatus(status, book_start, start_time, end_time) {
    // true means lock, that is true means disabled
    var statusLockMap = {
        // saved but not published
        '0': {
        },
        // published but not determined
        '1': {
            'name': true,
            'key': true,
            'place': function() {
                return (new Date() >= getDateByObj(start_time));
            },
            'book_start': true,
            'book_end': function() {
                return (new Date() >= getDateByObj(start_time));
            },
            'total_tickets': function() {
                return (new Date() >= getDateByObj(book_start));
            },
            'start_time': function() {
                return (new Date() >= getDateByObj(end_time));
            },
            'end_time': function() {
                return (new Date() >= getDateByObj(end_time));
            },
            'seat_status': function() {
                return (new Date() >= getDateByObj(book_start));
            }
        }
    }, key;
    for (key in keyMap) {
        var flag = !!statusLockMap[status][key];
        if (typeof statusLockMap[status][key] == 'function') {
            flag = statusLockMap[status][key]();
        }
        lockMap[keyMap[key]]($('#input-' + key), flag);
    }
    showProgressByStatus(status, book_start);
    if (status >= 1) {
        $('#saveBtn').hide();
    } else {
        $('#saveBtn').show();
    }
    showPublishByStatus(status, end_time);
    showPubTipsByStatus(status);
}

function showProgressByStatus(status, book_start) {
    if ((status >= 1) && (new Date() >= getDateByObj(book_start))) {
        $('#progress-tickets').show();
    } else {
        $('#progress-tickets').hide();
    }
}

function showPublishByStatus(status, linetime) {
    if ((status >= 1) && (new Date() >= getDateByObj(linetime))) {
        $('#publishBtn').hide();
        $('#resetBtn').hide();
    } else {
        $('#resetBtn').show();
        $('#publishBtn').show();
    }
}

function showPubTipsByStatus(status){
    if(status < 1){
        $('#publishBtn').tooltip({'title': '发布后不能修改“活动名称”、“活动代称”和“订票开始时间”'});
        $('#saveBtn').tooltip({'title': '暂存后可以“继续修改”'});
    }
}

function getDateString(tmpDate) {
    return tmpDate.year + '-' + tmpDate.month + '-' + tmpDate.day + ' ' + tmpDate.hour + ':' + tmpDate.minute + ':00';
}

function getDateByObj(obj) {
    return new Date(obj.year, obj.month - 1, obj.day, obj.hour, obj.minute);
}

function wrapDateString(dom, formData, name) {
    var parts = dom.children(), i, len, tmpDate = {}, part;
    for (i = 0, len = parts.length; i < len; ++i) {
        part = $(parts[i]).children();
        if (part.attr('date-part')) {
            if (part.val().length == 0) {
                return false;
            } else {
                tmpDate[part.attr('date-part')] = parseInt(part.val());
            }
        }
    }
    formData.push({
        name: name,
        required: false,
        type: 'string',
        value: getDateString(tmpDate)
    });
    return true;
}

function beforeSubmit(formData, jqForm, options) {
    var i, len, nameMap = {
        'name': '活动名称',
        'key': '活动代码',
        'place': '活动地点',
        'description': '活动简介',
        'start_time': '活动开始时间',
        'end_time': '活动结束时间',
        'total_tickets': '活动总票数',
        'pic_url': '活动配图',
        'book_start': '订票开始时间',
        'book_end': '订票结束时间',
        'seat_status': '座位分配设置',
        'group_interval':'阶段抢票时常',
        'group_size':'阶段抢票人数',
        'total_price':'票价',

    }, lackArray = [], dateArray = [
        'start_time', 'end_time', 'book_start', 'book_end','select_end','select_start'
    ];
    for (i = 0, len = formData.length; i < len; ++i) {
        if (!formData[i].value && formData[i].required) {
            lackArray.push(nameMap[formData[i].name]);
        }
    }
    for (i = 0, len = dateArray.length; i < len; ++i) {
        if (!$('#input-' + dateArray[i]).prop('disabled')) {
            if (!wrapDateString($('#input-' + dateArray[i]), formData, dateArray[i])) {
                lackArray.push(nameMap[dateArray[i]]);
            }
        }
    }
    if (lackArray.length > 0) {
        setResult('以下字段是必须的，请补充完整后再提交：\r\n' + lackArray.join('、'));
        $('#continueBtn').click(function() {
            showForm();
        });
        showResult();
        return false;
    }
    if (activity.id) {
        formData.push({
            name: 'id',
            required: false,
            type: 'number',
            value: activity.id.toString()
        });
    }
    return true;
}

function beforePublish(formData, jqForm, options) {
    if (beforeSubmit(formData, jqForm, options)) {
        showProcessing();
        if (activity.id) {
            formData.push({
                name: 'id',
                required: false,
                type: 'number',
                value: activity.id.toString()
            });
        }
        formData.push({
            name: 'publish',
            required: false,
            type: 'number',
            value: '1'
        });
        return true;
    } else {
        return false;
    }
}

function submitResponse(data) {
    if (!data.error) {
        updateActivity(data.activity);
        initializeForm(activity);
        appendResult('成功');
    } else {
        appendResult('错误：' + data.error);
    }
    if (data.warning) {
        appendResult('警告：' + data.warning);
    }
    if (data.updateUrl) {
        $('#continueBtn').click(function() {
            window.location.href = data.updateUrl;
        });
    } else {
        $('#continueBtn').click(function() {
            showForm();
        });
    }

}

function submitError(xhr) {
    setResult('ERROR!\r\nStatus:' + xhr.status + ' ' + xhr.statusText + '\r\n\r\nResponseText:\r\n' + (xhr.responseText || '<null>'));
    $('#continueBtn').click(function() {
        showForm();
    });
}

function submitComplete(xhr) {
    showResult();
}

initializeForm(activity);
showForm();


$('.form-control').on('focus', function() {var me = $(this); setTimeout(function(){me.select();}, 100)});

$(document).ready(function(){

    if(activity.id>0)
    {
        selectSeat();
    }

});
$(".allocateSeat").css("display","none");
function selectSeat(){
    var id = $('#input-seat_status');
    var index = id.val();
    if(index > 0)
        $(".allocateSeat").css("display","block");
    else
        $(".allocateSeat").css("display","none");
}

//===========================================================================
function publishMyActivity1()
{
    alert("publishMyActivity");
    $('#saveBtn').click();
}


function publishMyActivity() {
    if(!$('#activity-form')[0].checkValidity || $('#activity-form')[0].checkValidity()){
        if(!checktime())
            return false;
        showProcessing();
        setResult('');
        var options = {
            dataType: 'json',
            beforeSubmit: beforePublish,
            success: submitResponse,
            error: submitError,
            complete: submitComplete
        };
        $('#activity-form').ajaxSubmit(options);
        return false;
    } else {
        $('#saveBtn').click();
    }
    return false;
}



$('#activity-form').submit(function() {
    showProcessing();
    setResult('');
    var options = {
        dataType: 'json',
        beforeSubmit: beforeSubmit,
        success: submitResponse,
        error: submitError,
        complete: submitComplete
    };
    $(this).ajaxSubmit(options);
    return false;
}).on('reset', function() {
    //initializeForm(activity);
    return false;
});

$(document).ready(function(){
    $('#activity-start').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
});
     $('#activity-end').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
});
      $('#book-start').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
});
     $('#book-end').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
});
      $('#seat-start').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
});
     $('#seat-end').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
});
     if(activity.id){
    var now = new Date();
    var nowtime = "";
    nowtime += now.getFullYear();
    if(now.getMonth()>=9)
        nowtime += "-"+ ( now.getMonth()+1);
    else
        nowtime = nowtime + "-"+ 0 + (now.getMonth+1);
    if(now.getDate()<=9)
        nowtime += "-0" + now.getDate();
    else
        nowtime += "-" + now.getDate();
    if(now.getHours()<=9)
        nowtime += " 0"+now.getHours();
    else
        nowtime += " "+now.getHours();
    if(now.getMinutes()<=9)
        nowtime += ":0" + now.getMinutes();
    else
        nowtime += ":" + now.getMinutes();
    $('#seat-start .input-group-addon').css("display","none");
    $('#seat-start-input').attr("disabled","true");
    $('#book-start .input-group-addon').css("display","none");
    $('#book-start-input').attr("disabled","true");
     }

});
function checkTime(){
    if($('#activity-start-input')[0].value >= $('#activity-end-input')[0].value && $('#activity-end-input')[0].value !="" )
        alert("活动结束时间应大于活动开始时间~");
    if($('#book-end-input')[0].value >= $('#activity-start-input')[0].value && $('#activity-start-input')[0].value !="" )
        alert("活动开始时间应大于抢票结束时间~");
    if($('#book-start-input')[0].value >= $('#book-end-input')[0].value && $('#book-end-input')[0].value != "")
        alert("抢票结束时间应大于抢票开始时间~");
    if($('#seat-start-input')[0].value < $('#book-end-input')[0].value && $('#seat-start-input')[0].value !="")
        alert("选座开始时间应大于抢票结束时间~");
    if($('#seat-start-input')[0].value >= $('#seat-end-input')[0].value && $('#seat-end-input')[0].value !="")
        alert("选座结束时间应大于选座开始时间~");
    if($('#seat-end-input')[0].value >= $('#activity-start-input')[0].value && $('#activity-start-input')[0].value !="")
        alert("活动开始时间应大于选座结束时间");

    var now = new Date();
    var nowtime = "";
    nowtime += now.getFullYear();
    if(now.getMonth()>=9)
        nowtime += "-"+ ( now.getMonth()+1);
    else
        nowtime = nowtime + "-"+ 0 + (now.getMonth+1);
    if(now.getDate()<=9)
        nowtime += "-0" + now.getDate();
    else
        nowtime += "-" + now.getDate();
    if(now.getHours()<=9)
        nowtime += " 0"+now.getHours();
    else
        nowtime += " "+now.getHours();
    if(now.getMinutes()<=9)
        nowtime += ":0" + now.getMinutes();
    else
        nowtime += ":" + now.getMinutes();
    if (!activity.id) {

        if($('#book-start-input')[0].value !="" && $('#book-start-input')[0].value <= nowtime)
        {
            alert("抢票开始时间应大于当前时间~");
            $('#book-start-input')[0].value = "";
        }
    }

    if($('#activity-start-input')[0].value != "")
    {
        var string = $('#activity-start-input')[0].value;
        $('#input-start-year')[0].value = string.substring(0,4);
        $('#input-start-month')[0].value = string.substring(5,7);
        $('#input-start-day')[0].value = string.substring(8,10);
        $('#input-start-hour')[0].value = string.substring(11,13);
        $('#input-start-minute')[0].value = string.substring(14,16);
    }

    if($('#activity-end-input')[0].value != "")
    {
        var string = $('#activity-end-input')[0].value;
        $('#input-end-year')[0].value = string.substring(0,4);
        $('#input-end-month')[0].value = string.substring(5,7);
        $('#input-end-day')[0].value = string.substring(8,10);
        $('#input-end-hour')[0].value = string.substring(11,13);
        $('#input-end-minute')[0].value = string.substring(14,16);
    }

     if($('#book-start-input')[0].value != "")
    {
        var string = $('#book-start-input')[0].value;
        $('#input-book-start-year')[0].value = string.substring(0,4);
        $('#input-book-start-month')[0].value = string.substring(5,7);
        $('#input-book-start-day')[0].value = string.substring(8,10);
        $('#input-book-start-hour')[0].value = string.substring(11,13);
        $('#input-book-start-minute')[0].value = string.substring(14,16);
    }

     if($('#book-end-input')[0].value != "")
    {
        var string = $('#book-end-input')[0].value;
        $('#input-book-end-year')[0].value = string.substring(0,4);
        $('#input-book-end-month')[0].value = string.substring(5,7);
        $('#input-book-end-day')[0].value = string.substring(8,10);
        $('#input-book-end-hour')[0].value = string.substring(11,13);
        $('#input-book-end-minute')[0].value = string.substring(14,16);
    }

     if($('#seat-start-input')[0].value != "")
    {
        var string = $('#seat-start-input')[0].value;
        $('#input-select-start-year')[0].value = string.substring(0,4);
        $('#input-select-start-month')[0].value = string.substring(5,7);
        $('#input-select-start-day')[0].value = string.substring(8,10);
        $('#input-select-start-hour')[0].value = string.substring(11,13);
        $('#input-select-start-minute')[0].value = string.substring(14,16);
    }

     if($('#seat-end-input')[0].value != "")
    {
        var string = $('#seat-end-input')[0].value;
        $('#input-select-end-year')[0].value = string.substring(0,4);
        $('#input-select-end-month')[0].value = string.substring(5,7);
        $('#input-select-end-day')[0].value = string.substring(8,10);
        $('#input-select-end-hour')[0].value = string.substring(11,13);
        $('#input-select-end-minute')[0].value = string.substring(14,16);
    }

}