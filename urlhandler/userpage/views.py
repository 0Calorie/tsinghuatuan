# -*- coding:utf-8 -*-

from django.http import HttpResponse, Http404
from django.template import RequestContext
from django.shortcuts import render_to_response
from urlhandler.models import *
from urlhandler.settings import STATIC_URL
import urllib, urllib2, json
import datetime
from django.utils import timezone
from django.forms.models import model_to_dict


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


# Starting from here (plus validation_view above), is the new version of validation system.
# The main difference is that the website used for validation was changed from learn.tsinghua.edu.cn to auth.igeek.asia
# and this lead to changes of implementation details.
def validate_getTime(request):
    req = urllib2.Request(url="http://auth.igeek.asia/v1/time")
    response = urllib2.urlopen(req)
    try:
        responseData = response.read()
        return HttpResponse(responseData)
    except:
        return HttpResponse('Error')


def validate_through_AuthTHU(request):
    if (not request.POST) or (not 'secret' in request.POST) or (not 'openid' in request.POST) or (
            not 'username' in request.POST):
        raise Http404
    secret = request.POST['secret']
    studentID = request.POST['username']
    weixinOpenID = request.POST['openid']
    requestData = urllib.urlencode({'secret': secret})
    request = urllib2.Request(url="http://auth.igeek.asia/v1", data=requestData)
    response = urllib2.urlopen(request)
    try:
        responseData_String = response.read()
        responseData_json = json.loads(responseData_String)
        validationResult = 'Error'
        if (responseData_json["code"] == 0):
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


def chooseSeat_standardValidationChecker(weixinOpenID, activityID):

    # has been validated?
    if not (User.objects.filter(weixin_id=weixinOpenID, status=1).exists()):
        return 'Not_Validated'
    else:
        currentUser = User.objects.get(weixin_id=weixinOpenID, status=1)

    # has ticket? if objects.get get nothing, will itsTickets be null or an exception will be raised ?
    if not (Ticket.objects.filter(StudentID=currentUser.stu_id, activity=activityID).exists()):
        return 'No_Ticket'
    else:
        try:
            itsTickets = Ticket.objects.get(studentID=currentUser.stu_id, activity=activityID);
        except:
            return 'Error_DB1'

    # check if this activity allow seats choosing
    try:
        theActivity = Activity.objects.get(id=activityID)
    except:
        return 'Error_DB2'
    if theActivity.seat_status != 1:
        return 'No_Seat_Choosing'

    # can that ticket choose its seat now?
    if (itsTickets.select_start > datetime.datetime.now() or itsTickets[0].select_end < datetime.datetime.now()):
        return 'Not_Now'
    # has this ticket choose its seat before
    if itsTickets.seat != None:
        return 'Has_Chosen'

    return 'Valid'

################chooseSeat###################

def chooseSeat_returnIncompleteView(request, isValid, weixinOpenID):
    return render_to_response('userSelectSeat.html', {
        'validity': isValid,
        'weixinOpenID': weixinOpenID,
    }, context_instance=RequestContext(request))

def choose_seat_view(request, openid, uid):
    isValid = 'Valid'
    # has been validated?
    if User.objects.filter(weixin_id=openid, status=1).exists():
        try:
            currentUser = User.objects.get(weixin_id=openid)
        except:
            isValid = 'ex'
            print 'ex1'
            return chooseSeat_returnIncompleteView(request, isValid, openid)
    else:
        print 'el1'
        return validation_view(request, openid)

    # has ticket? if objects.get get nothing, will itsTickets be null or an exception will be raised ?
    if Ticket.objects.filter(unique_id=uid).exists():
        try:
            itsTickets = Ticket.objects.get(unique_id=uid)
        except:
            isValid = 'ex'
            print 'ex2'
            return chooseSeat_returnIncompleteView(request, isValid, openid)
    else:
        isValid = 'No_Such_Ticket'
        print 'el2'
        return chooseSeat_returnIncompleteView(request, isValid, openid)

    # check if this activity allow seats choosing.
    try:
        theActivity = itsTickets.activity
    except:
        isValid = 'ex'
        print 'ex3'
        return chooseSeat_returnIncompleteView(request, isValid, openid)
    if theActivity.seat_status == 0:
        isValid = 'No_Seat_Choosing'
        print 'el3'
        return chooseSeat_returnIncompleteView(request, isValid, openid)

    print 'asd'
    # can that ticket choose its seat now?  has this ticket choose its seat before?
    if (itsTickets.select_start > datetime.datetime.now() or itsTickets.select_end < datetime.datetime.now()):
        print itsTickets.select_start
        print itsTickets.select_end
        print datetime.datetime.now()
        isValid = 'Not_Now'
    if itsTickets.seat_status != 0:
        print 'chosen'
        isValid = 'Has_Chosen'

    ticketPack = dict()
    ticketPack['ticketID'] = itsTickets.unique_id
    ticketPack['additionalTicketID'] = itsTickets.additional_ticket_id

    print 'dfg'
    # get current seat status
    seats = []
    seatmodels = Seat.objects.filter(activity=theActivity)
    for seat in seatmodels:
        seats += [model_to_dict(seat)]
    seatNum = len(seatmodels)
    seatPack = dict()
    seatPack['seatNum'] = seatNum
    seatPack['seats'] = seats

    activityPack = dict()
    activityPack['name'] = theActivity.name
    activityPack['place'] = theActivity.place
    activityPack['startTime'] = theActivity.start_time
    activityPack['totalPrice'] = theActivity.total_price

    return render_to_response('userSelectSeat.html', {
        'validity': isValid,
        'weixinOpenID': openid,
        'ticketPack': ticketPack,
        'seatPack': seatPack, 
        'activityPack' : activityPack
    }, context_instance=RequestContext(request))

    ## remember to check everything did above whatever the requested action is!!!

def chooseSeat_single(request, weixinOpenID, ticketID, seatFloor, seatColumn, seatRow):
    #check validity
    '''validityStatus = chooseSeat_standardValidationChecker(weixinOpenID, activityID)
    if validityStatus != 'Valid':
        print 'invalid'
        return HttpResponse('Error_Validity')
    print 'valid'
    '''
    try:
        theTicket = Ticket.objects.get(unique_id=ticketID)
    except:
        print 'ex1'
        return HttpResponse('No_Such_Ticket')
    if theTicket.additional_ticket_id > 0:
        print 'side'
        return HttpResponse('Has_Side_Ticket')

    theActivity = theTicket.activity
    try:
        theSeat = Seat.objects.get(activity=theActivity, seat_floor = seatFloor, seat_row=seatRow, seat_column=seatColumn)
        theID = theSeat.id
    except:
        print 'ex2'
        return HttpResponse('ex')

    if theSeat.status != 0:
        print '!=0'
        return HttpResponse('Selected')
    else:
        theSeat.status = 2

    theSeat.id = theID
    try:
        theSeat.save()
    except:
        print 'ex3'
        return HttpResponse('ex')

    try:
        Ticket.objects.filter(unique_id=ticketID).update(seat=theSeat, seat_status = 1)
    except:
        print 'ex4'
        return HttpResponse('ex')
    return HttpResponse('Ok')

def chooseSeat_dual(request, weixinOpenID, ticketID, oneFloor, oneColumn, oneRow, sideID, twoFloor, twoColumn, twoRow):
    #check validity

    try:
        theTicket = Ticket.objects.get(unique_id = ticketID)
    except:
        print 'ex1'
        return HttpResponse('No_Such_Ticket')
    if (not(sideID == theTicket.additional_ticket_id)) or (sideID <= 0):
        print 'Side:'
        print sideID
        print theTicket.additional_ticket_id
        print (sideID == theTicket.additional_ticket_id)
        print '----------'
        return HttpResponse('No_Such_Side_Ticket')

    theActivity = theTicket.activity
    try:
        dualOne = Seat.objects.get(activity = theActivity, seat_floor = oneFloor, seat_row = oneRow, seat_column = oneColumn)
        dualOneID = dualOne.id
    except:
        print 'ex2'
        return HttpResponse('ex')

    if dualOne.status !=0:
        print 'one!=0'
        return HttpResponse('oneSelected')
    else:
        dualOne.id = dualOneID
        dualOne.status = 2

    try:
        dualOne.save()
    except:
        print 'ex3'
        return HttpResponse('ex')

    try:
        dualTwo = Seat.objects.get(activity = theActivity, seat_floor = twoFloor, seat_row = twoRow, seat_column = twoColumn)
        dualTwoID = dualTwo.id
    except:
        print 'ex4'
        return HttpResponse('ex')

    if dualTwo.status !=0:
        print 'two!=0'
        dualOne.id = dualOneID
        dualOne.status = 0
        try:
            dualOne.save()
        except:
            print 'ex5'
            return HttpResponse('ex')
        return HttpResponse('twoSelected')
    else:
        dualTwo.id = dualTwoID
        dualTwo.status = 2

    try:
        dualTwo.save()
        dualOne.id = dualTwoID
        dualOne.status = 0
        try:
            dualOne.save()
        except:
            print 'ex6'
            return HttpResponse('ex')
    except:
        print 'ex7'
        return HttpResponse('ex')

    try:
        Ticket.objects.filter(unique_id = ticketID).update(seat = dualOne, seat_status = 1)
        Ticket.objects.filter(id = sideID).update(seat = dualTwo, seat_status = 1)
    except:
        print 'ex8'
        return HttpResponse('ex')

    return HttpResponse('Ok')

def chooseSeat_seatStatusUpdate(request, weixinOpenID, ticketID):
    #check validity
    try:
        theTicket = Ticket.objects.get(unique_id=ticketID)
    except:
        print 'ex1'
        return HttpResponse('No_Such_Ticket')
    theActivity = theTicket.activity
    # get current seat status
    seats = []
    seatmodels = Seat.objects.filter(activity=theActivity)
    for seat in seatmodels:
        seats += [model_to_dict(seat)]
    seatNum = len(seatmodels)
    seatPack = dict()
    seatPack['seatNum'] = seatNum
    seatPack['seats'] = seats
    return HttpResponse(seatPack)


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
    act_price = activity[0].total_price
    MAX_LEN = 256
    act_text_status = 0
    if len(act_text) > MAX_LEN:
        act_text_status = 1
        act_abstract = act_text[0:MAX_LEN] + u'...'
    act_photo = activity[0].pic_url
    cur_time = timezone.now()  # use the setting UTC
    act_seconds = 0
    if act_bookstart <= cur_time <= act_bookend:
        act_delta = act_bookend - cur_time
        act_seconds = act_delta.total_seconds()
        act_status = 0  # during book time
    elif cur_time < act_bookstart:
        act_delta = act_bookstart - cur_time
        act_seconds = act_delta.total_seconds()
        act_status = 1  # before book time
    else:
        act_status = 2  # after book time
    variables = RequestContext(request, {'act_name': act_name, 'act_text': act_text, 'act_photo': act_photo,
                                         'act_bookstart': act_bookstart, 'act_bookend': act_bookend,
                                         'act_begintime': act_begintime,
                                         'act_endtime': act_endtime, 'act_totaltickets': act_totaltickets,
                                         'act_key': act_key,
                                         'act_place': act_place, 'act_status': act_status, 'act_seconds': act_seconds,
                                         'cur_time': cur_time,
                                         'act_abstract': act_abstract, 'act_text_status': act_text_status,
                                         'act_ticket_remian': act_ticket_remian,'act_price':act_price})
    return render_to_response('activitydetails.html', variables)


def ticket_view(request, uid):
    ticket1 = dict()
    ticket2 = dict()
    seat1 = dict()
    seat2 = dict()
    act = dict()
    try:
        ticket = Ticket.objects.get(unique_id=uid)
    except:
        raise Http404  #current activity is invalid
    ticket1 = model_to_dict(ticket)
    act = model_to_dict(ticket.activity)
    #已经选择座位
    if ticket1['seat_status'] == 1:
        seat1 = model_to_dict(ticket.seat)
    #表示活动已经结束
    now = datetime.datetime.now()
    if act['end_time'] < now:
        ticket1['status'] = 3
    #有双人座
    add_id = ticket1['additional_ticket_id']
    if add_id > 0:
        ticket = Ticket.objects.get(id=add_id)
        ticket2 = model_to_dict(ticket)
        if ticket2['seat_status'] == 1:
            seat2 = model_to_dict(ticket.seat)
    act_photo = "http://qr.ssast.org/fit/" + uid
    print ticket1
    print seat1
    print seat2
    variables = RequestContext(request,
                               {'act_photo': act_photo, 'activity': act, 'ticket1': ticket1, 'ticket2': ticket2,
                                'seat1': seat1, 'seat2': seat2})
    return render_to_response('activityticket.html', variables)


def help_view(request):
    variables = RequestContext(request, {'name': u'“紫荆之声”'})
    return render_to_response('help.html', variables)


def activity_menu_view(request, actid):
    activity = Activity.objects.get(id=actid)
    return render_to_response('activitymenu.html', {'activity': activity})


def helpact_view(request):
    variables = RequestContext(request, {})
    return render_to_response('help_activity.html', variables)


def helpclub_view(request):
    variables = RequestContext(request, {})
    return render_to_response('help_club.html', variables)


def helplecture_view(request):
    variables = RequestContext(request, {})
    return render_to_response('help_lecture.html', variables)


##########Authorization############
authorization_duration = datetime.timedelta(10)


def authorize_view(request, stuid):
    users = User.objects.filter(stu_id=stuid, status=1)
    hasAuthorzation = 0
    if users.exists():
        user = users[0]
        authorization = user.authorization
        if not authorization is None:
            if authorization.apply_time + authorization_duration < datetime.datetime.now():
                Authorization.object.filter(id=authorization.id).update(status=2)
            if authorization.status == 1:
                hasAuthorzation = 1

    studentid = ''
    if request.GET:
        studentid = request.GET.get('studentid', '')
    return render_to_response('authorization_AuthTHU.html', {
        'stuid': stuid,
        'hasAuthorization': hasAuthorzation,
        'studentid': studentid,
    }, context_instance=RequestContext(request))


def authorize_through_AuthTHU(request):
    if (not request.POST) or (not 'secret' in request.POST) or (not 'openid' in request.POST) or (
            not 'username' in request.POST):
        raise Http404
    secret = request.POST['secret']
    authorizedID = request.POST['username']
    authorizerID = request.POST['openid']
    requestData = urllib.urlencode({'secret': secret})
    request = urllib2.Request(url="http://auth.igeek.asia/v1", data=requestData)
    response = urllib2.urlopen(request)
    try:
        responseData_String = response.read()
        responseData_json = json.loads(responseData_String)
        validationResult = 'Error'
        if (responseData_json["code"] == 0):
            validationResult = 'Accepted'
            validationResult = authorize_addNewbieToDataBase(authorizerID, authorizedID)
        else:
            validationResult = 'Rejected'
    except:
        validationResult = 'Error'
    return HttpResponse(validationResult)


def authorize_addNewbieToDataBase(authorizerID, authorizedID):
    now = datetime.datetime.now()
    try:
        currentAuthorization = Authorization.objects.get(authorizer_stu_id=authorizerID,
                                                         authorized_person_stu_id=authorizedID)
        currentAuthorization.apply_time = now
        currentAuthorization.status = 1
        try:
            currentAuthorization.save()
        except:
            return 'Error_DB2'
    except:
        try:
            able_to_authorize = True
            users = User.objects.filter(stu_id=authorizerID)
            if users.exists:
                authorization = users[0].authorization
                if authorization.apply_time + authorization_duration < now:
                    Authorization.objects.filter(id=authorization.id).update(state=2)
                if authorization == 1:
                    able_to_authorize = False
            users = User.objects.filter(stu_id=authorizedID)
            if users.exists:
                authorization = users[0].authorization
                if authorization.apply_time + authorization_duration < now:
                    Authorization.objects.filter(id=authorization.id).update(state=2)
                if authorization == 1:
                    able_to_authorize = False
            if not able_to_authorize:
                return 'Reject'
            
            newAuthorization = Authorization.objects.create(
                authorizer_stu_id=authorizerID,
                authorized_person_stu_id=authorizedID,
                status=1,
                apply_time=now
            )
            newAuthorization.save()
            User.objects.filter(stu_id=authorizerID).update(authorization=newAuthorization)
            User.objects.filter(stu_id=authorizedID).update(authorization=newAuthorization)
        except:
            return 'Error_DB3'
    return 'Accepted'
