#-*- coding:utf-8 -*-

from django.http import HttpResponse, Http404
from django.template import RequestContext
from django.forms.models import model_to_dict
from datetime import datetime
import json
import time
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.contrib import auth
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.db.models import F
import urllib
import urllib2
from urlhandler.models import Activity, Ticket, Seat
from urlhandler.models import User as Booker
from weixinlib.custom_menu import get_custom_menu, modify_custom_menu, add_new_custom_menu, auto_clear_old_menus
from weixinlib.settings import get_custom_menu_with_book_acts, WEIXIN_BOOK_HEADER
from adminpage.safe_reverse import *


import xlwt
import re
from django.utils.http import urlquote
from django.utils.encoding import smart_str
#serializer model into json
from django.core import serializers


@csrf_protect
def home(request):
    if not request.user.is_authenticated():
        return render_to_response('login.html', context_instance=RequestContext(request))
    else:
        return HttpResponseRedirect(s_reverse_activity_list())


def activity_list(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect(s_reverse_admin_home())

    actmodels = Activity.objects.filter(status__gte=0).order_by('-id').all()
    activities = []
    for act in actmodels:
        activities += [wrap_activity_dict(act)]
    permission_num = 1 if request.user.is_superuser else 0
    return render_to_response('activity_list.html', {
        'activities': activities,
        'permission': permission_num,
    })




def activity_checkin(request, actid):
    if not request.user.is_authenticated():
        return HttpResponseRedirect(s_reverse_admin_home())
    try:
        activity = Activity.objects.get(id=actid)
        if datetime.now() > activity.end_time:
            raise 'Time out!'
    except:
        return HttpResponseRedirect(s_reverse_activity_list())

    return render_to_response('activity_checkin.html', {
        'activity': activity,
    }, context_instance=RequestContext(request))


def activity_checkin_post(request, actid):
    if (not request.POST) or (not ('uid' in request.POST)):
        raise Http404
    try:
        activity = Activity.objects.get(id=actid)
    except:
        return HttpResponse(json.dumps({'result': 'error', 'stuid': 'Unknown', 'msg': 'noact'}),
                            content_type='application/json')

    rtnJSON = {'result': 'error', 'stuid': 'Unknown', 'msg': 'rejected'}
    flag = False
    uid = request.POST['uid']
    if len(uid) == 10:
        if not uid.isdigit():
            rtnJSON['result'] = 'error'
            rtnJSON['stuid'] = 'Unknown'
            rtnJSON['msg'] = 'rejected'
            flag = True
        if not flag:
            rtnJSON['stuid'] = uid
            try:
                student = Booker.objects.get(stu_id=uid, status=1)
            except Exception as e:
                rtnJSON['msg'] = 'nouser'
                flag = True
            if not flag:
                try:
                    ticket = Ticket.objects.get(stu_id=student.stu_id, activity=activity)
                    if ticket.status == 0:
                        raise 'noticket'
                    elif ticket.status == 2:
                        rtnJSON['result'] = 'warning'
                        rtnJSON['msg'] = 'used'
                        flag = True
                    elif ticket.status == 1:
                        ticket.status = 2
                        ticket.save()
                        rtnJSON['msg'] = 'accepted'
                        rtnJSON['result'] = 'success'
                        flag = True
                except:
                    rtnJSON['msg'] = 'noticket'
                    flag = True
    elif len(uid) == 32:
        try:
            ticket = Ticket.objects.get(unique_id=uid, activity=activity)
            if ticket.status == 0:
                raise 'rejected'
            elif ticket.status == 2:
                rtnJSON['msg'] = 'used'
                rtnJSON['stuid'] = ticket.stu_id
                rtnJSON['result'] = 'warning'
                flag = True
            else:
                ticket.status = 2
                ticket.save()
                rtnJSON['result'] = 'success'
                rtnJSON['stuid'] = ticket.stu_id
                rtnJSON['msg'] = 'accepted'
                flag = True
        except:
            rtnJSON['result'] = 'error'
            rtnJSON['stuid'] = 'Unknown'
            rtnJSON['msg'] = 'rejected'
            flag = True

    return HttpResponse(json.dumps(rtnJSON), content_type='application/json')


def login(request):
    if not request.POST:
        raise Http404

    rtnJSON = {}

    username = request.POST.get('username', '')
    password = request.POST.get('password', '')

    user = auth.authenticate(username=username, password=password)
    if user is not None and user.is_active:
        auth.login(request, user)
        rtnJSON['message'] = 'success'
        rtnJSON['next'] = s_reverse_activity_list()
    else:
        time.sleep(2)
        rtnJSON['message'] = 'failed'
        if User.objects.filter(username=username, is_active=True):
            rtnJSON['error'] = 'wrong'
        else:
            rtnJSON['error'] = 'none'

    return HttpResponse(json.dumps(rtnJSON), content_type='application/json')


def logout(request):
    auth.logout(request)
    return HttpResponseRedirect(s_reverse_admin_home())


def str_to_datetime(strg):
    return datetime.strptime(strg, '%Y-%m-%d %H:%M:%S')

def str_to_datetime_(strg):
    return datetime.strptime(strg, '%Y %m %d %H %M %S')

def activity_create(activity):
    # print activity
    preDict = dict()
    for k in ['name','key', 'description', 'place', 'pic_url', 'seat_status', 'total_tickets']:
        preDict[k] = activity[k]
    for k in ['start_time', 'end_time', 'book_start', 'book_end']:
       preDict[k] = str_to_datetime(activity[k])
    if not (activity['seat_status'] == u'0'):
        for k in ['group_interval','group_size']:
            preDict[k] = activity[k]
        for k in ['select_start','select_end']:
            preDict[k] = str_to_datetime(activity[k])
    else:
        preDict['group_interval'] = '0'
        preDict['group_size'] = '0'
        preDict['select_start'] = datetime.now()
        preDict['select_end'] = datetime.now()
    preDict['status'] = 1 if ('publish' in activity) else 0
    if ('total_price' in activity):
        preDict['total_price'] = activity['total_price']
    preDict['remain_tickets'] = preDict['total_tickets']
    newact = Activity.objects.create(**preDict)
    return newact


def activity_modify(activity):
    # print "MODIFY"
    # print activity
    nowact = Activity.objects.get(id=activity['id'])
    now = datetime.now()
    if nowact.status == 0:
        keylist = ['name', 'total_price','key', 'description', 'place', 'pic_url', 'seat_status', 'total_tickets']
        timelist = [ 'start_time', 'end_time', 'book_start', 'book_end']
        if not (nowact.seat_status == u'0'):
            keylist = keylist + ['group_interval', 'group_size']
            timelist = timelist + ['select_start', 'select_end']
    elif nowact.status == 1:
        if now >= nowact.start_time:
            keylist = ['description', 'pic_url']
            timelist = ['start_time', 'end_time']
        elif now >= nowact.book_start:
            keylist = ['description', 'place', 'pic_url']
            timelist = ['start_time', 'end_time', 'book_end']
        else:
            keylist = ['description', 'place', 'pic_url', 'seat_status', 'total_tickets']
            timelist = ['start_time', 'end_time', 'book_end']
        if not (nowact.seat_status == u'0'):
            keylist = keylist + ['group_interval', 'group_size','total_price']
            timelist = timelist + ['select_end','select_start']
    else:
        keylist = []
        timelist = []
    for key in keylist:
        if key == 'total_tickets':
            setattr(nowact, 'remain_tickets', activity[key])
        setattr(nowact, key, activity[key])
    for key in timelist:
        setattr(nowact, key, str_to_datetime(activity[key]))
    if (nowact.status == 0) and ('publish' in activity):
        nowact.status = 1
    nowact.save()
    return nowact


@csrf_exempt
def activity_delete(request):
    requestdata = request.POST
    if not requestdata:
        raise Http404
    curact = Activity.objects.get(id=requestdata.get('activityId', ''))
    curact.status = -1
    curact.save()
    #删除后刷新界面
    return HttpResponse('OK')


def get_checked_tickets(activity):
    return Ticket.objects.filter(activity=activity, status=2).count()


def wrap_activity_dict(activity):
    dt = model_to_dict(activity)
    if (dt['status'] >= 1) and (datetime.now() >= dt['book_start']):
        dt['tickets_ready'] = 1
        dt['ordered_tickets'] = int(activity.total_tickets) - int(activity.remain_tickets)
        dt['checked_tickets'] = get_checked_tickets(activity)
    return dt


def activity_add(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect(s_reverse_admin_home())

    return render_to_response('activity_detail.html', {
        'activity': {
            'name': u'新建活动',
        }
    }, context_instance=RequestContext(request))


def activity_detail(request, actid):
    if not request.user.is_authenticated():
        return HttpResponseRedirect(s_reverse_admin_home())
    try:
        activity = Activity.objects.get(id=actid)

        unpublished = (activity.status == 0)
    except:
        raise Http404
    return render_to_response('activity_detail.html', {
        'activity': wrap_activity_dict(activity),
        'unpublished': unpublished
    }, context_instance=RequestContext(request))


class DatetimeJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        else:
            return json.JSONEncoder.default(self, obj)


def activity_post(request):
    # print "POST"
    if not request.user.is_authenticated():
        return HttpResponseRedirect(s_reverse_admin_home())

    if not request.POST:
        raise Http404
    post = request.POST
    rtnJSON = dict()
    try:
        if 'id' in post:
            activity = activity_modify(post)
        else:
            iskey = Activity.objects.filter(key=post['key'])
            if iskey:
                now = datetime.now()
                for keyact in iskey:
                    if now < keyact.end_time:
                        rtnJSON['error'] = u"当前有活动正在使用该活动代称"
                        return HttpResponse(json.dumps(rtnJSON, cls=DatetimeJsonEncoder),
                                            content_type='application/json')
            activity = activity_create(post)
            rtnJSON['updateUrl'] = s_reverse_activity_detail(activity.id)
        rtnJSON['activity'] = wrap_activity_dict(activity)
        if 'publish' in post:
            updateErr = json.loads(add_new_custom_menu(name=activity.key, key=WEIXIN_BOOK_HEADER + str(activity.id))).get('errcode', 'err')
            if updateErr != 0:
                rtnJSON['error'] = u'活动创建成功，但更新微信菜单失败，请手动更新:(  \r\n错误代码：%s' % updateErr
    except Exception as e:
        rtnJSON['error'] = str(e)
    return HttpResponse(json.dumps(rtnJSON, cls=DatetimeJsonEncoder), content_type='application/json')


def order_index(request):
    return render_to_response('print_login.html', context_instance=RequestContext(request))


def order_login(request):
    if not request.POST:
        raise Http404

    rtnJSON = {}

    username = request.POST.get('username', '')
    password = request.POST.get('password', '')

    try:
        Booker.objects.get(stu_id=username)
    except:
        rtnJSON['message'] = 'none'
        return HttpResponse(json.dumps(rtnJSON), content_type='application/json')

    req_data = urllib.urlencode({'userid': username, 'userpass': password, 'submit1': u'登录'.encode('gb2312')})
    request_url = 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/teacher/loginteacher.jsp'
    req = urllib2.Request(url=request_url, data=req_data)
    res_data = urllib2.urlopen(req)

    try:
        res = res_data.read()
    except:
        raise Http404

    if 'loginteacher_action.jsp' in res:
        request.session['stuid'] = username
        request.session.set_expiry(0)
        rtnJSON['message'] = 'success'
        rtnJSON['next'] = s_reverse_order_list()
    else:
        rtnJSON['message'] = 'failed'

    return HttpResponse(json.dumps(rtnJSON), content_type='application/json')


def order_logout(request):
    return HttpResponseRedirect(s_reverse_order_index())


def order_list(request):

    if not 'stuid' in request.session:
        return HttpResponseRedirect(s_reverse_order_index())

    stuid = request.session['stuid']

    orders = []
    qset = Ticket.objects.filter(stu_id = stuid)

    for x in qset:
        item = {}

        activity = Activity.objects.get(id = x.activity_id)

        item['name'] = activity.name

        item['start_time'] = activity.start_time

        item['end_time'] = activity.end_time
        item['place'] = activity.place
        item['seat'] = x.seat
        item['valid'] = x.status
        item['unique_id'] = x.unique_id
        orders.append(item)

    return render_to_response('order_list.html', {
        'orders': orders,
        'stuid':stuid
    }, context_instance=RequestContext(request))


def print_ticket(request, unique_id):

    if not 'stuid' in request.session:
        return HttpResponseRedirect(s_reverse_order_index())

    try:
        ticket = Ticket.objects.get(unique_id = unique_id)
        activity = Activity.objects.get(id = ticket.activity_id)
        qr_addr = "http://tsinghuaqr.duapp.com/fit/" + unique_id
    except:
        raise Http404

    return render_to_response('print_ticket.html', {
        'qr_addr': qr_addr,
        'activity': activity,
        'stu_id':ticket.stu_id
    }, context_instance=RequestContext(request))


def adjust_menu_view(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect(s_reverse_admin_home())
    if not request.user.is_superuser:
        return HttpResponseRedirect(s_reverse_activity_list())
    activities = Activity.objects.filter(end_time__gt=datetime.now(), status=1)
    return render_to_response('adjust_menu.html', {
        'activities': activities,
    }, context_instance=RequestContext(request))


def custom_menu_get(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect(s_reverse_admin_home())
    if not request.user.is_superuser:
        return HttpResponseRedirect(s_reverse_activity_list())
    custom_buttons = get_custom_menu()
    current_menu = []
    for button in custom_buttons:
        sbtns = button.get('sub_button', [])
        if len(sbtns) > 0:
            tmpkey = sbtns[0].get('key', '')
            if (not tmpkey.startswith(WEIXIN_BOOK_HEADER + 'W')) and tmpkey.startswith(WEIXIN_BOOK_HEADER):
                current_menu = sbtns
                break
    if auto_clear_old_menus(current_menu):
        modify_custom_menu(json.dumps(get_custom_menu_with_book_acts(current_menu), ensure_ascii=False).encode('utf8'))
    wrap_menu = []
    for menu in current_menu:
        wrap_menu += [{
                          'name': menu['name'],
                          'id': int(menu['key'].split('_')[-1]),
                      }]
    return HttpResponse(json.dumps(wrap_menu), content_type='application/json')


def custom_menu_modify_post(request):
    if not request.user.is_authenticated():
        raise Http404
    if not request.user.is_superuser:
        raise Http404
    if not request.POST:
        raise Http404
    if not 'menus' in request.POST:
        raise Http404
    menus = json.loads(request.POST.get('menus', ''))
    sub_button = []
    for menu in menus:
        sub_button += [{
                           'type': 'click',
                           'name': menu['name'],
                           'key': 'TSINGHUA_BOOK_' + str(menu['id']),
                           'sub_button': [],
                       }]
    return HttpResponse(modify_custom_menu(json.dumps(get_custom_menu_with_book_acts(sub_button), ensure_ascii=False).encode('utf8')),
                        content_type='application/json')


def activity_export_stunum(request, actid):
    if not request.user.is_authenticated():
        return HttpResponseRedirect(s_reverse_admin_home())
    try:
        activity = Activity.objects.get(id=actid)
    except:
        raise Http404

    tickets = Ticket.objects.filter(activity=activity)
    wb = xlwt.Workbook()

    def write_row(ws, row, data):
        for index, cell in enumerate(data):
            ws.write(row, index, cell)

    ws = wb.add_sheet(activity.name)
    row = 1
    write_row(ws, 0, [u'学号', u'状态', u'座位'])
    statusMap = [u'已取消', u'未入场', u'已入场']
    for ticket in tickets:
        write_row(ws, row, [ticket.stu_id, statusMap[ticket.status], ticket.seat])
        row = row + 1
##########################################定义Content-Disposition，让浏览器能识别，弹出下载框
    fname = 'activity' + actid + '.xls'
    agent=request.META.get('HTTP_USER_AGENT')
    if agent and re.search('MSIE',agent):
        response = HttpResponse(content_type="application/vnd.ms-excel")  # 解决ie不能下载的问题
        response['Content-Disposition'] = 'attachment; filename=%s' % urlquote(fname)  # 解决文件名乱码/不显示的问题
    else:
        response = HttpResponse(content_type="application/ms-excel")  # 解决ie不能下载的问题
        response['Content-Disposition'] = 'attachment; filename=%s' % smart_str(fname)  # 解决文件名乱码/不显示的问题
    ##########################################保存
    wb.save(response)
    return response
# 创建座位
def seat_create(seat):
    preDict = dict()
    preDict['activity'] = Activity.objects.get(id = seat['activity'])
    for k in ['place','seat_price','seat_floor', 'seat_row','seat_column']:
        preDict[k] = seat[k]
    preDict['status'] = 0
    preDict['seat_type'] = "A"
    preDict['description'] = u"你的座位" + str(preDict["seat_floor"])+ u"层"+  str(preDict['seat_row'])+u"排"+ str(preDict['seat_column'])+u"座"
    newSeat = Seat.objects.create(**preDict)
    return newSeat

@csrf_exempt
def activity_save_seat(request, actid):
    if not request.POST:
        return Http404
    else:
        print "POST"
        rtnJSON = {}
        activity = Activity.objects.filter(id = actid)
        Seat.objects.filter(activity = activity).delete()
        post = request.POST
        aid = post.get('aid','')
        floorList = post.get('floor','').split(" ")
        columnList = post.get('column','').split(" ")
        rowList = post.get('row','').split(" ")
        priceList = post.get('price','').split(" ")
        length = len(floorList)
        activity = Activity.objects.get(id = actid)
        place = activity.place
        for i in range(0, length):
            seat = dict()
            seat['seat_floor'] = int(floorList[i])
            seat['seat_column'] = int(columnList[i])
            seat['seat_row'] = int(rowList[i])
            seat['seat_price'] = int(priceList[i])
            seat['activity'] = int(actid)
            seat['place'] = place
            try:
                newact = seat_create(seat)
            except:
                rtnJSON['meg'] = 'create fail'
                rtnJSON['next_url'] = '/hello/'
                return HttpResponse(json.dumps(rtnJSON), content_type='application/json')
        return HttpResponseRedirect("/list/")

        #return HttpResponse(json.dumps(rtnJSON), content_type='application/json')
    
#for test only
def hello(request):
    return HttpResponse("hello world")

def activity_select_seat_lecture(request, actid):
    seats = []
    activity = Activity.objects.get(id = actid)
    now = datetime.now()
    ## print now
    if activity.select_start < now:
        canModify = 0 # administer can not modify seat 
    else:
        canModify = 1
    seatmodels = Seat.objects.filter(activity = activity)  
    for seat in seatmodels:
    	seats += [model_to_dict(seat)]
    seatNum = len(seatmodels)

    if activity.place == "蒙民伟音乐厅":
        return render_to_response('activity_select_seat_music.html', {
        'id' : actid,
        'allSeat': seats,
        'activity': activity,
        'seatNum': seatNum,
        'canModify': canModify,
    })
    if activity.place == "新清华学堂":
        return render_to_response('activity_select_seat_tsinghua_school.html', {
            'id' : actid,
            'allSeat': seats,
            'activity': activity,
            'seatNum': seatNum,
            'canModify': canModify,
        })
    if activity.place == "大礼堂":
        return render_to_response('activity_select_seat_hall.html', {
            'id' : actid,
            'allSeat': seats,
            'activity': activity,
            'seatNum': seatNum,
            'canModify': canModify,
        })
    return render_to_response('activity_select_seat_error.html', {
            'id' : actid,
            'allSeat': seats,
            'activity': activity,
            'seatNum': seatNum,
            'canModify': canModify,
        })


