#-*- coding:utf-8 -*-

from django.http import HttpResponse, Http404
from django.template import RequestContext
from django.shortcuts import render_to_response
from urlhandler.models import User, Activity, Ticket
from urlhandler.settings import STATIC_URL
import urllib, urllib2, json
import datetime
from django.utils import timezone


def home(request):
    return render_to_response('mobile_base.html')


###################### Validate ######################
# request.GET['openid'] must be provided.
def validate_view(request, openid):
    if User.objects.filter(weixin_id=openid, status=1).exists():
        isValidated = 1
    else:
        isValidated = 0
    studentid = ''
    if request.GET:
        studentid = request.GET.get('studentid', '')
    return render_to_response('validation_AuthTHU.html', {
        'openid': openid,
        'studentid': studentid,
        'isValidated': isValidated,
        'now': datetime.datetime.now() + datetime.timedelta(seconds=-5),
    }, context_instance=RequestContext(request))


# Validate Format:
# METHOD 1: learn.tsinghua
# url: https://learn.tsinghua.edu.cn/MultiLanguage/lesson/teacher/loginteacher.jsp
# form: { userid:2011013236, userpass:***, submit1: 登录 }
# success: check substring 'loginteacher_action.jsp'
# validate: userid is number
def validate_through_learn(userid, userpass):
    req_data = urllib.urlencode({'userid': userid, 'userpass': userpass, 'submit1': u'登录'.encode('gb2312')})
    request_url = 'https://learn.tsinghua.edu.cn/MultiLanguage/lesson/teacher/loginteacher.jsp'
    req = urllib2.Request(url=request_url, data=req_data)
    res_data = urllib2.urlopen(req)
    try:
        res = res_data.read()
    except:
        return 'Error'
    if 'loginteacher_action.jsp' in res:
        return 'Accepted'
    else:
        return 'Rejected'


# METHOD 2 is not valid, because student.tsinghua has not linked to Internet
# METHOD 2: student.tsinghua
# url: http://student.tsinghua.edu.cn/checkUser.do?redirectURL=%2Fqingxiaotuan.do
# form: { username:2011013236, password:encryptedString(***) }
# success: response response is null / check response status code == 302
# validate: username is number
def validate_through_student(userid, userpass):
    return 'Error'


def validate_post(request):
    if (not request.POST) or (not 'openid' in request.POST) or \
            (not 'username' in request.POST) or (not 'password' in request.POST):
        raise Http404
    userid = request.POST['username']
    if not userid.isdigit():
        raise Http404
    userpass = request.POST['password'].encode('gb2312')
    validate_result = validate_through_learn(userid, userpass)
    if validate_result == 'Accepted':
        openid = request.POST['openid']
        try:
            User.objects.filter(stu_id=userid).update(status=0)
            User.objects.filter(weixin_id=openid).update(status=0)
        except:
            return HttpResponse('Error')
        try:
            currentUser = User.objects.get(stu_id=userid)
            currentUser.weixin_id = openid
            currentUser.status = 1
            try:
                currentUser.save()
            except:
                return HttpResponse('Error')
        except:
            try:
                newuser = User.objects.create(weixin_id=openid, stu_id=userid, status=1)
                newuser.save()
            except:
                return HttpResponse('Error')
    return HttpResponse(validate_result)

def validate_getTime(request):
    req = urllib2.Request(url = "http://auth.igeek.asia/v1/time")
    response = urllib2.urlopen(req)
    try:
        responseData = response.read()
        return HttpResponse(responseData)
    except:
        return HttpResponse('Error')

def validate_through_AuthTHU(request):
    if (not request.POST) or (not 'secret' in request.POST) or (not 'openid' in request.POST) or (not 'username' in request.POST):
        raise Http404
    secret = request.POST['secret']
    studentID = request.POST['username']
    weixinOpenID = request.POST['openid']
    requestData = urllib.urlencode({'secret':secret})
    request = urllib2.Request(url="http://auth.igeek.asia/v1", data=requestData)
    response = urllib2.urlopen(request)
    try:
        responseData_String = response.read()
        responseData_json = json.loads(responseData_String)
        validationResult = 'Error'
        if(responseData_json["code"] == 0):
            validationResult = 'Accepted'
            validationResult = validation_addNewbieToDataBase(weixinOpenID, studentID)
        else:
            validationResult = 'Rejected'
    except:
        validationResult = 'Error'
    return HttpResponse(validationResult)

def validation_addNewbieToDataBase(weixinOpenID, studentID):
    try:
        User.objects.filter(stu_id=studentID).update(status=0)
        User.objects.filter(weixin_id=weixinOpenID).update(status=0)
    except:
        return 'Error_DB1'
    try:
        currentUser = User.objects.get(stu_id=studentID)
        currentUser.weixin_id = weixinOpenID
        currentUser.status = 1
        try:
            currentUser.save()
        except:
            return 'Error_DB2'
    except:
        try:
            newuser = User.objects.create(weixin_id=weixinOpenID, stu_id=studentID, status=1)
            newuser.save()
        except:
            return 'Error_DB3'
    return 'Accepted'

###################### Activity Detail ######################

def details_view(request, activityid):
    activity = Activity.objects.filter(id=activityid)
    if not activity.exists():
        raise Http404  #current activity is invalid
    act_name = activity[0].name
    act_key = activity[0].key
    act_place = activity[0].place
    act_bookstart = activity[0].book_start
    act_bookend = activity[0].book_end
    act_begintime = activity[0].start_time
    act_endtime = activity[0].end_time
    act_totaltickets = activity[0].total_tickets
    act_text = activity[0].description
    act_ticket_remian = activity[0].remain_tickets
    act_abstract = act_text
    MAX_LEN = 256
    act_text_status = 0
    if len(act_text) > MAX_LEN:
        act_text_status = 1
        act_abstract = act_text[0:MAX_LEN]+u'...'
    act_photo = activity[0].pic_url
    cur_time = timezone.now() # use the setting UTC
    act_seconds = 0
    if act_bookstart <= cur_time <= act_bookend:
        act_delta = act_bookend - cur_time
        act_seconds = act_delta.total_seconds()
        act_status = 0 # during book time
    elif cur_time < act_bookstart:
        act_delta = act_bookstart - cur_time
        act_seconds = act_delta.total_seconds()
        act_status = 1 # before book time
    else:
        act_status = 2 # after book time
    variables=RequestContext(request,{'act_name':act_name,'act_text':act_text, 'act_photo':act_photo,
                                      'act_bookstart':act_bookstart,'act_bookend':act_bookend,'act_begintime':act_begintime,
                                      'act_endtime':act_endtime,'act_totaltickets':act_totaltickets,'act_key':act_key,
                                      'act_place':act_place, 'act_status':act_status, 'act_seconds':act_seconds,'cur_time':cur_time,
                                      'act_abstract':act_abstract, 'act_text_status':act_text_status,'act_ticket_remian':act_ticket_remian})
    return render_to_response('activitydetails.html', variables)


def ticket_view(request, uid):
    ticket = Ticket.objects.filter(unique_id=uid)
    if not ticket.exists():
        raise Http404  #current activity is invalid
    activity = Activity.objects.filter(id=ticket[0].activity_id)
    act_id = activity[0].id
    act_name = activity[0].name
    act_key = activity[0].key
    act_begintime = activity[0].start_time
    act_endtime = activity[0].end_time
    act_place = activity[0].place
    ticket_status = ticket[0].status
    now = datetime.datetime.now()
    if act_endtime < now:#表示活动已经结束
        ticket_status = 3
    ticket_seat = ticket[0].seat
    act_photo = "http://qr.ssast.org/fit/"+uid
    variables=RequestContext(request,{'act_id':act_id, 'act_name':act_name,'act_place':act_place, 'act_begintime':act_begintime,
                                      'act_endtime':act_endtime,'act_photo':act_photo, 'ticket_status':ticket_status,
                                      'ticket_seat':ticket_seat,
                                      'act_key':act_key})
    return render_to_response('activityticket.html', variables)

def help_view(request):
    variables=RequestContext(request,{'name':u'“紫荆之声”'})
    return render_to_response('help.html', variables)


def activity_menu_view(request, actid):
    activity = Activity.objects.get(id=actid)
    return render_to_response('activitymenu.html', {'activity': activity})

def helpact_view(request):
    variables=RequestContext(request,{})
    return render_to_response('help_activity.html', variables)

def helpclub_view(request):
    variables=RequestContext(request,{})
    return render_to_response('help_club.html', variables)

def helplecture_view(request):
    variables=RequestContext(request,{})
    return render_to_response('help_lecture.html', variables)
