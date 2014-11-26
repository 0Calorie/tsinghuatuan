# -*- coding:utf-8 -*-
import random
import string
import datetime
import re
from datetime import timedelta
from urlhandler.models import *
from queryhandler.settings import QRCODE_URL
from django.db.models import F
from django.db import transaction

from userpage.safe_reverse import *
from queryhandler.weixin_reply_templates import *
from queryhandler.weixin_text_templates import *
from queryhandler.handler_check_templates import *
from queryhandler.weixin_msg import *
from weixinlib.settings import WEIXIN_EVENT_KEYS


def get_user(openid):
    try:
        return User.objects.get(weixin_id=openid, status=1)
    except:
        return None


def get_reply_single_ticket(msg, ticket, now, ext_desc=''):
    return get_reply_single_news_xml(msg, get_item_dict(
        title=get_text_one_ticket_title(ticket, now),
        description=ext_desc + get_text_one_ticket_description(ticket, now),
        pic_url=get_text_ticket_pic(ticket),
        url=s_reverse_ticket_detail(ticket.unique_id)
    ))


# check user is authenticated or not
def is_authenticated(openid):
    return get_user(openid) is not None


# check help command
def check_help_or_subscribe(msg):
    return handler_check_text(msg, ['帮助', 'help']) or handler_check_event_click(msg, [
        WEIXIN_EVENT_KEYS['help']]) or handler_check_events(msg, ['scan', 'subscribe'])


# get help information
def response_help_or_subscribe_response(msg):
    return get_reply_single_news_xml(msg, get_item_dict(
        title=get_text_help_title(),
        description=get_text_help_description(is_authenticated(get_msg_from(msg))),
        url=s_reverse_help()
    ))


# check book command
def check_bookable_activities(msg):
    return handler_check_text(msg, ['抢啥']) or handler_check_event_click(msg, [WEIXIN_EVENT_KEYS['ticket_book_what']])


# get bookable activities
def response_bookable_activities(msg):
    now = datetime.datetime.fromtimestamp(get_msg_create_time(msg))
    activities_book_not_end = Activity.objects.filter(status=1, book_end__gte=now).order_by('book_start')
    activities_book_end = Activity.objects.filter(status=1, book_end__lt=now, end_time__gte=now)
    activities = list(activities_book_not_end) + list(activities_book_end)
    if len(activities) == 1:
        activity = activities[0]
        return get_reply_single_news_xml(msg, get_item_dict(
            title=get_text_activity_title_with_status(activity, now),
            description=get_text_activity_description(activity, 100),
            pic_url=activity.pic_url,
            url=s_reverse_activity_detail(activity.id)
        ))
    items = []
    for activity in activities:
        items.append(get_item_dict(
            title=get_text_activity_title_with_status(activity, now),
            pic_url=activity.pic_url,
            url=s_reverse_activity_detail(activity.id)
        ))
        if len(items) >= 10:
            break
    if len(items) != 0:
        return get_reply_news_xml(msg, items)
    else:
        return get_reply_text_xml(msg, get_text_no_bookable_activity())


def check_exam_tickets(msg):
    return handler_check_text(msg, ['查票']) or handler_check_event_click(msg, [WEIXIN_EVENT_KEYS['ticket_get']])


# get list of tickets
def response_exam_tickets(msg):
    fromuser = get_msg_from(msg)
    user = get_user(fromuser)
    if user is None:
        return get_reply_text_xml(msg, get_text_unbinded_exam_ticket(fromuser))

    now = datetime.datetime.fromtimestamp(get_msg_create_time(msg))
    activities = Activity.objects.filter(status=1, end_time__gte=now)
    all_tickets = []
    for activity in activities:
        tickets = Ticket.objects.filter(stu_id=user.stu_id, activity=activity, status=1)
        if tickets.exists():
            all_tickets.append(tickets[0])

    if len(all_tickets) == 1:
        ticket = all_tickets[0]
        return get_reply_single_ticket(msg, ticket, now)
    elif len(all_tickets) == 0:
        return get_reply_text_xml(msg, get_text_no_ticket())
    else:
        return get_reply_text_xml(msg, get_text_exam_tickets(all_tickets, now))


def check_fetch_ticket(msg):
    return handler_check_text_header(msg, ['取票'])


#handle order message
def response_fetch_ticket(msg):
    fromuser = get_msg_from(msg)
    user = get_user(fromuser)
    if user is None:
        return get_reply_text_xml(msg, get_text_unbinded_fetch_ticket(fromuser))

    received_msg = get_msg_content(msg).split()
    if len(received_msg) > 1:
        key = received_msg[1]
    else:
        return get_reply_text_xml(msg, get_text_usage_fetch_ticket())

    now = datetime.datetime.fromtimestamp(get_msg_create_time(msg))
    activities = Activity.objects.filter(status=1, end_time__gt=now, book_start__lt=now, key=key)
    if not activities.exists():
        return get_reply_text_xml(msg, get_text_no_such_activity('取票'))
    else:
        activity = activities[0]
    return fetch_ticket(msg, user, activity, now)


def fetch_ticket(msg, user, activity, now):
    tickets = Ticket.objects.filter(stu_id=user.stu_id, activity=activity, status=1)
    if tickets.exists():
        ticket = tickets[0]
        return get_reply_single_ticket(msg, ticket, now)
    else:
        return get_reply_text_xml(msg, get_text_no_ticket_in_act(activity, now))


def check_book_ticket(msg):
    return handler_check_text_header(msg, ['抢票'])


def response_book_ticket(msg):
    fromuser = get_msg_from(msg)
    user = get_user(fromuser)
    if user is None:
        return get_reply_text_xml(msg, get_text_unbinded_book_ticket(fromuser))

    received_msg = get_msg_content(msg).split()
    if len(received_msg) > 1:
        key = received_msg[1]
    else:
        return get_reply_text_xml(msg, get_text_usage_book_ticket())

    now = datetime.datetime.fromtimestamp(get_msg_create_time(msg))
    authorizations = Authorization.objects.select_for_update().filter(status=1, authorized_person_stu_id=user.stu_id)
    if authorizations.exists():
        authorization = authorizations[0]
        if authorization.apply_time + authorization_duration < now:
            authorization.status = 2
            authorization.save()
        if authorization.status == 1:
            return get_reply_text_xml(msg,
                                      get_text_already_authorized_can_not_book_ticket(authorization.authorizer_stu_id))

    activities = Activity.objects.filter(status=1, book_end__gte=now, book_start__lte=now, key=key)
    if not activities.exists():
        future_activities = Activity.objects.filter(status=1, book_start__gt=now, key=key)
        if future_activities.exists():
            return get_reply_text_xml(msg, get_text_book_ticket_future_with_hint(future_activities[0], now))
        return get_reply_text_xml(msg, get_text_no_such_activity('抢票'))
    else:
        tickets = Ticket.objects.filter(stu_id=user.stu_id, activity=activities[0], status__gt=0)
        if tickets.exists():
            return get_reply_text_xml(msg, get_text_existed_book_ticket(tickets[0]))
        authorizations = Authorization.objects.select_for_update().filter(status=1, authorizer_stu_id=user.stu_id)
        auth = False
        if authorizations.exists():
            authorization = authorizations[0]
            if authorization.apply_time + authorization_duration < now:
                authorization.status = 2
                authorization.save()
            if authorization.status == 1:
                auth = True
        ticket = book_ticket(user, key, now, auth)
        if ticket is None:
            return get_reply_text_xml(msg, get_text_fail_book_ticket(activities[0], now))
        else:
            return get_reply_single_ticket(msg, ticket, now, get_text_success_book_ticket(ticket))


def book_ticket(user, key, now, auth):
    with transaction.atomic():
        activities = Activity.objects.select_for_update().filter(status=1, book_end__gte=now, book_start__lte=now,
                                                                 key=key)

        if not activities.exists():
            return None
        else:
            activity = activities[0]

        if activity.remain_tickets <= 0:
            return None

        if auth and activity.remain_tickets <= 1:
            return None

        random_string = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)])
        while Ticket.objects.filter(unique_id=random_string).exists():
            random_string = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)])

        tickets = Ticket.objects.select_for_update().filter(stu_id=user.stu_id, activity=activity,
                                                            additional_ticket_id__gt=-2)
        if tickets.exists() and tickets[0].status != 0:
            return None

        '''
        next_seat = ''
        if activity.seat_status == 1:
            b_count = Ticket.objects.filter(activity=activity, seat='B', status__gt=0).count()
            c_count = Ticket.objects.filter(activity=activity, seat='C', status__gt=0).count()
            if b_count <= c_count:
                next_seat = 'B'
            else:
                next_seat = 'C'
        '''

        select_start = now
        if activity.seat_status == 1:
            booked_tickets = activity.total_tickets - activity.remain_tickets
            group_index = booked_tickets / activity.group_size
            select_start = activity.select_start
            for i in xrange(group_index):
                select_start += timedelta(0, activity.group_interval)

        if activity.seat_status == 0:
            ticket_seat_status = -1
        else:
            ticket_seat_status = 0

        if not tickets.exists():
            if not auth:
                Activity.objects.filter(id=activity.id).update(remain_tickets=F('remain_tickets') - 1)
                ticket = Ticket.objects.create(
                    stu_id=user.stu_id,
                    activity=activity,
                    unique_id=random_string,
                    status=1,
                    seat_status=ticket_seat_status,
                    seat=None,
                    select_start=select_start,
                    select_end=select_start + timedelta(0, activity.group_interval),
                    additional_ticket_id=-1
                )
                return ticket
            else:
                Activity.objects.filter(id=activity.id).update(remain_tickets=F('remain_tickets') - 2)
                ticket1 = Ticket.objects.create(
                    stu_id=user.stu_id,
                    activity=activity,
                    unique_id=random_string,
                    status=1,
                    seat_status=ticket_seat_status,
                    seat=None,
                    select_start=select_start,
                    select_end=select_start + timedelta(0, activity.group_interval),
                    additional_ticket_id=-2
                )
                random_string2 = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)])
                while Ticket.objects.filter(unique_id=random_string2).exists():
                    random_string2 = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)])
                ticket2 = Ticket.objects.create(
                    stu_id=user.stu_id,
                    activity=activity,
                    unique_id=random_string2,
                    status=1,
                    seat_status=ticket_seat_status,
                    seat=None,
                    select_start=select_start,
                    select_end=select_start + timedelta(0, activity.group_interval),
                    additional_ticket_id=ticket1.id
                )
                return ticket2
        elif tickets[0].status == 0:
            if not auth:
                Activity.objects.filter(id=activity.id).update(remain_tickets=F('remain_tickets') - 1)
                ticket = tickets[0]
                ticket.status = 1
                ticket.seat_status = ticket_seat_status
                ticket.seat = None
                ticket.select_start = select_start
                ticket.select_end = select_start + timedelta(0, activity.group_interval)
                ticket.additional_ticket_id = -1
                ticket.save()
                return ticket
            else:
                Activity.objects.filter(id=activity.id).update(remain_tickets=F('remain_tickets') - 2)
                ticket1 = Ticket.objects.create(
                    stu_id=user.stu_id,
                    activity=activity,
                    unique_id=random_string,
                    status=1,
                    seat_status=ticket_seat_status,
                    seat=None,
                    select_start=select_start,
                    select_end=select_start + timedelta(0, activity.group_interval),
                    additional_ticket_id=-2
                )
                ticket = tickets[0]
                ticket.status = 1
                ticket.seat_status = ticket_seat_status
                ticket.seat = None
                ticket.select_start = select_start
                ticket.select_end = select_start + timedelta(0, activity.group_interval)
                ticket.additional_ticket_id = ticket1.id
                ticket.save()
                return ticket
        else:
            return None


def check_cancel_ticket(msg):
    return handler_check_text_header(msg, ['退票'])


def response_cancel_ticket(msg):
    fromuser = get_msg_from(msg)
    user = get_user(fromuser)
    if user is None:
        return get_reply_text_xml(msg, get_text_unbinded_cancel_ticket(fromuser))

    received_msg = get_msg_content(msg).split()
    if len(received_msg) > 1:
        key = received_msg[1]
    else:
        return get_reply_text_xml(msg, get_text_usage_cancel_ticket())

    now = datetime.datetime.fromtimestamp(get_msg_create_time(msg))
    activities = Activity.objects.filter(status=1, end_time__gt=now, book_start__lt=now, key=key)
    if not activities.exists():
        return get_reply_text_xml(msg, get_text_no_such_activity('退票'))
    else:
        activity = activities[0]
        if activity.book_end >= now:
            tickets = Ticket.objects.filter(stu_id=user.stu_id, activity=activity, status=1)
            if tickets.exists():  # user has already booked the activity
                for ticket in tickets:
                    ticket.status = 0
                    ticket.save()
                    Activity.objects.filter(id=activity.id).update(remain_tickets=F('remain_tickets') + 1)
                return get_reply_text_xml(msg, get_text_success_cancel_ticket())
            else:
                return get_reply_text_xml(msg, get_text_fail_cancel_ticket())
        else:
            return get_reply_text_xml(msg, get_text_timeout_cancel_ticket())


#check book event
def check_book_event(msg):
    if msg['MsgType'] == 'event' and msg['Event'] == 'CLICK':
        cmd_list = msg['EventKey'].split('_')
        if len(cmd_list) == 3:
            if cmd_list[0] == 'TSINGHUA' and cmd_list[1] == 'BOOK' and cmd_list[2].isdigit():
                return True
    return False


def response_book_event(msg):
    fromuser = get_msg_from(msg)
    user = get_user(fromuser)
    if user is None:
        return get_reply_text_xml(msg, get_text_unbinded_book_ticket(fromuser))

    now = datetime.datetime.fromtimestamp(get_msg_create_time(msg))

    authorizations = Authorization.objects.select_for_update().filter(status=1, authorized_person_stu_id=user.stu_id)
    if authorizations.exists():
        authorization = authorizations[0]
        if authorization.apply_time + authorization_duration < now:
            authorization.status = 2
            authorization.save()
        if authorization.status == 1:
            return get_reply_text_xml(msg,
                                      get_text_already_authorized_can_not_book_ticket(authorization.authorizer_stu_id))

    cmd_list = get_msg_event_key(msg).split('_')
    activity_id = int(cmd_list[2])
    activities = Activity.objects.filter(id=activity_id, status=1, end_time__gt=now)
    if activities.exists():
        activity = activities[0]
    else:
        return get_reply_text_xml(msg, get_text_no_such_activity())

    if activity.book_start > now:
        return get_reply_text_xml(msg, get_text_book_ticket_future(activity, now))

    tickets = Ticket.objects.filter(stu_id=user.stu_id, activity=activity, status__gt=0)
    if tickets.exists():
        return get_reply_single_ticket(msg, tickets[0], now, get_text_existed_book_event())
    if activity.book_end < now:
        return get_reply_text_xml(msg, get_text_timeout_book_event())
    authorizations = Authorization.objects.select_for_update().filter(status=1, authorizer_stu_id=user.stu_id)
    auth = False
    if authorizations.exists():
        authorization = authorizations[0]
        if authorization.apply_time + authorization_duration < now:
            authorization.status = 2
            authorization.save()
        if authorization.status == 1:
            auth = True
    ticket = book_ticket(user, activity.key, now, auth)
    if ticket is None:
        return get_reply_text_xml(msg, get_text_fail_book_ticket(activities[0], now))
    else:
        return get_reply_single_ticket(msg, ticket, now, get_text_success_book_ticket(ticket))


#check unsubscribe event
def check_unsubscribe_or_unbind(msg):
    return handler_check_text(msg, ['解绑']) or handler_check_events(msg, ['unsubscribe'])


#handle unsubscribe event
def response_unsubscribe_or_unbind(msg):
    fromuser = get_msg_from(msg)
    User.objects.filter(weixin_id=fromuser, status=1).update(status=0)
    return get_reply_text_xml(msg, get_text_unbind_success(fromuser))


#check bind event
def check_bind_account(msg):
    return handler_check_text(msg, ['绑定']) or handler_check_event_click(msg, [WEIXIN_EVENT_KEYS['account_bind']])


#handle bind event
def response_bind_account(msg):
    fromuser = get_msg_from(msg)
    user = get_user(fromuser)
    if user is None:
        return get_reply_text_xml(msg, get_text_to_bind_account(fromuser))
    else:
        return get_reply_text_xml(msg, get_text_binded_account(user.stu_id))


def check_no_book_acts_event(msg):
    return handler_check_event_click(msg, [WEIXIN_EVENT_KEYS['ticket_no_book_recommand']])


def response_no_book_acts(msg):
    return get_reply_text_xml(msg, get_text_hint_no_book_acts())


def check_get_activity_menu(msg):
    return handler_check_text_header(msg, ['节目单'])


def response_get_activity_menu(msg):
    received_msg = get_msg_content(msg).split()
    if len(received_msg) > 1:
        key = received_msg[1]
    else:
        return get_reply_text_xml(msg, get_text_usage_get_activity_menu())

    now = datetime.datetime.fromtimestamp(get_msg_create_time(msg))
    activities = Activity.objects.filter(status=1, end_time__gt=now, key=key)
    if not activities.exists():
        return get_reply_text_xml(msg, get_text_no_such_activity())
    else:
        activity = activities[0]
    if not activity.menu_url:
        return get_reply_text_xml(msg, get_text_no_activity_menu())
    if activity.start_time > now:
        return get_reply_text_xml(msg, get_text_fail_get_activity_menu(activity, now))
    return get_reply_single_news_xml(msg, get_item_dict(
        title=get_text_title_activity_menu(activity),
        description=get_text_desc_activity_menu(activity),
        pic_url=activity.pic_url,
        url=s_reverse_activity_menu(activity.id)
    ))


def check_xnlhwh(msg):
    return handler_check_text(msg, ['xnlhwh'])


def response_xnlhwh(msg):
    msg['Content'] = '节目单 新年联欢晚会'
    return response_get_activity_menu(msg)


def check_select_seat(msg):
    return handler_check_text_header(msg, ['选座']) or handler_check_text(msg, ['选座']) or handler_check_event_click(msg, [
        WEIXIN_EVENT_KEYS['ticket_select_seat']])


def response_select_seat(msg):
    fromuser = get_msg_from(msg)
    user = get_user(fromuser)
    if user is None:
        return get_reply_text_xml(msg, get_text_unbinded_select_seat(fromuser))

    received_msg = []
    if msg['MsgType'] == 'text':
        received_msg = get_msg_content(msg).split()
    now = datetime.datetime.fromtimestamp(get_msg_create_time(msg))

    if len(received_msg) > 1:
        key = received_msg[1]
        activities = Activity.objects.filter(status=1, end_time__gte=now, key=key)  #tempory 选择活动
        if not activities.exists():  #活动不存在
            return get_reply_text_xml(msg, get_text_no_such_activity(''))
        else:
            activity = activities[0]
            tickets = Ticket.objects.filter(stu_id=user.stu_id, activity=activity, status__gte=0)  #tempory 查看是否抢到票
            if not tickets.exists():  #没有抢到票
                return get_reply_text_xml(msg, get_text_no_ticket_to_select_seat(activity))
            if activity.seat_status == 0:  #活动不需要选座
                return get_reply_text_xml(msg, get_text_no_need_to_select_seat())
            ticket = tickets[0]
            if ticket.select_end < now:  #选座已结束
                seat = ticket.seat
                return get_reply_text_xml(msg, get_text_select_seat_over(seat))
            if ticket.select_start > now:  #选座未开始
                return get_reply_text_xml(msg, get_text_select_seat_future(ticket, now))
            return get_reply_text_xml(msg, get_text_select_seat(fromuser, ticket))
    else:
        activities = Activity.objects.filter(status=1, end_time__gte=now)
        all_tickets = []
        for activity in activities:
            tickets = Ticket.objects.filter(stu_id=user.stu_id, activity=activity, status=1, seat_status=0,
                                            select_start__lt=now, select_end__gt=now, additional_ticket_id__gt=-2)
            if tickets.exists():
                all_tickets.append(tickets[0])

        if len(all_tickets) == 0:
            return get_reply_text_xml(msg, get_text_no_ticket_need_select_seat())
        else:
            return get_reply_text_xml(msg, get_text_show_all_seat_selection(fromuser, all_tickets))


def check_authorize(msg):
    return handler_check_text_header(msg, ['约吗'])


authorization_duration = timedelta(10)


def response_authorize(msg):
    fromuser = get_msg_from(msg)
    user = get_user(fromuser)
    if user is None:
        return get_reply_text_xml(msg, get_text_unbinded_authorize(fromuser))

    received_msg = get_msg_content(msg).split()
    if len(received_msg) > 1:
        key = received_msg[1]
    else:
        return get_reply_text_xml(msg, get_text_usage_authorize())

    m = re.match(r'\d{10}$', key)
    if not m:
        return get_reply_text_xml(msg, get_text_usage_authorize())

    if key == user.stu_id:
        return get_reply_text_xml(msg, get_text_can_not_authorize_yourself())

    now = datetime.datetime.fromtimestamp(get_msg_create_time(msg))

    able_to_authorize = True

    authorizations = Authorization.objects.select_for_update().filter(authorizer_stu_id=user.stu_id)
    for authorization in authorizations:
        if authorization.apply_time + authorization_duration < now:
            authorization.status = 2
            authorization.save()
        if authorization.status == 1 and authorization.authorized_person_stu_id != key:
            able_to_authorize = False

    authorizations = Authorization.objects.select_for_update().filter(authorized_person_stu_id=user.stu_id)
    for authorization in authorizations:
        if authorization.apply_time + authorization_duration < now:
            authorization.status = 2
            authorization.save()
        if authorization.status == 1:
            able_to_authorize = False

    if not able_to_authorize:
        return get_reply_text_xml(msg, get_text_unable_to_authorize())
    else:
        authorizations = Authorization.objects.select_for_update().filter(authorized_person_stu_id=key,
                                                                          authorizer_stu_id=user.stu_id)
        if not authorizations.exists():
            authorization = Authorization.objects.create(
                authorizer_stu_id=user.stu_id,
                authorized_person_stu_id=key,
                status=0,
                apply_time=now
            )
            return get_reply_text_xml(msg, get_text_apply_authorization(key))
        else:
            authorization = authorizations[0]
            if authorization.status == 1:
                authorization.apply_time = now
                return get_reply_text_xml(msg, get_text_authorization_update_time(key, now + authorization_duration))
            else:
                authorization.status = 0
                authorization.apply_time = now
                authorization.save()
                return get_reply_text_xml(msg, get_text_apply_authorization(key))


def check_accept_authorization(msg):
    return handler_check_text_header(msg, ['约约约'])


def response_accept_authorization(msg):
    fromuser = get_msg_from(msg)
    user = get_user(fromuser)
    if user is None:
        return get_reply_text_xml(msg, get_text_unbinded_select_seat(fromuser))

    received_msg = get_msg_content(msg).split()
    now = datetime.datetime.fromtimestamp(get_msg_create_time(msg))

    if len(received_msg) > 1:
        key = received_msg[1]
        m = re.match(r'\d{10}$', key)
        if not m:
            return get_reply_text_xml(msg, get_text_invalid_receive_authorization())
        authorizations = Authorization.objects.filter(authorizer_stu_id=key,
                                                      authorized_person_stu_id=user.stu_id, status=0)
        if not authorizations.exists():  #查看委托请求是否已经发出
            return get_reply_text_xml(msg, get_text_no_authorization(key))
        else:
            authorization = authorizations[0]
            valid_time = authorization.apply_time + timedelta(0, 3600)
            if now > valid_time:  #查看接受委托时间是否已经超时
                return get_reply_text_xml(msg, get_text_authorization_timeout())

            #对要接受委托的用户检查是否有接受委托资格
            user_authorizer = Authorization.objects.select_for_update().filter(authorizer_stu_id=user.stu_id)
            user_authorized = Authorization.objects.select_for_update().filter(authorized_person_stu_id=user.stu_id)
            if user_authorizer.exists():  #该用户发出过请求
                for each in user_authorizer:
                    if each.status == 1:  #该委托目前状态有效
                        valid_time = each.apply_time + authorization_duration
                        if now > valid_time:  #该委托失效，将状态改为2
                            each.status = 2
                            each.save()
                        else:  #该委托没有失效，用户则不能接受委托
                            return get_reply_text_xml(msg, get_text_already_authorization())
            if user_authorized.exists():
                for each in user_authorized:
                    if each.status == 1:
                        valid_time = each.apply_time + authorization_duration
                        if now > valid_time:
                            each.status = 2
                            each.save()
                        else:
                            return get_reply_text_xml(msg, get_text_already_authorization())

            #对发出委托请求的用户判断是否有发出委托资格
            receive_authorizer = Authorization.objects.select_for_update().filter(authorizer_stu_id=key)
            receive_authorized = Authorization.objects.select_for_update().filter(authorized_person_stu_id=key)

            if receive_authorizer.exists():
                for each in receive_authorizer:
                    if each.status == 1:  #该委托目前状态有效
                        valid_time = each.apply_time + authorization_duration
                        if now > valid_time:  #该委托失效，将状态改为2
                            each.status = 2
                            each.save()
                        else:  #该委托没有失效，用户则不能接受委托
                            return get_reply_text_xml(msg, get_text_request_already_authorization())
            if receive_authorized.exists():
                for each in receive_authorized:
                    if each.status == 1:  #该委托目前状态有效
                        valid_time = each.apply_time + authorization_duration
                        if now > valid_time:  #该委托失效，将状态改为2
                            each.status = 2
                            each.save()
                        else:  #该委托没有失效，用户则不能接受委托
                            return get_reply_text_xml(msg, get_text_request_already_authorization())

            #双方均有委托资格
            authorization.status = 1
            authorization.apply_time = now
            authorization.save()
            return get_reply_text_xml(msg, get_text_authorization_success())  #返回成功信息
    else:
        return get_reply_text_xml(msg, get_text_invalid_receive_authorization())  #命令格式不正确


def check_cancel_authorization(msg):
    return handler_check_text(msg, ['不约'])


def response_cancel_authorization(msg):
    fromuser = get_msg_from(msg)
    user = get_user(fromuser)
    if user is None:
        return get_reply_text_xml(msg, get_text_unbinded_select_seat(fromuser))

    received_msg = get_msg_content(msg)

    authorizers = Authorization.objects.select_for_update().filter(authorizer_stu_id=user.stu_id, status=1)
    if authorizers.exists():
        authorizer = authorizers[0]
        authorizer.status = 2
        authorizer.save()
        return get_reply_text_xml(msg, get_text_cancel_authorization_success(authorizer.authorized_person_stu_id))
    else:
        authorizeds = Authorization.objects.select_for_update().filter(authorized_person_stu_id=user.stu_id, status=1)
        if authorizeds.exists():
            authorized = authorizeds[0]
            authorized.status = 2
            authorized.save()
            return get_reply_text_xml(msg, get_text_cancel_authorization_success(authorized.authorizer_stu_id))
        else:
            return get_reply_text_xml(msg, get_text_cancel_no_authorization())


def check_check_authorization(msg):
    return handler_check_text(msg, ['约谁'])


def response_check_authorization(msg):
    fromuser = get_msg_from(msg)
    user = get_user(fromuser)
    if user is None:
        return get_reply_text_xml(msg, get_text_unbinded_select_seat(fromuser))

    authorizers = Authorization.objects.select_for_update().filter(authorizer_stu_id=user.stu_id, status=1)
    if authorizers.exists():
        return get_reply_text_xml(msg, get_text_check_authorization(authorizers[0].authorized_person_stu_id))
    else:
        authorizeds = Authorization.objects.select_for_update().filter(authorized_person_stu_id=user.stu_id, status=1)
        if authorizeds.exists():
            return get_reply_text_xml(msg, get_text_check_authorization(authorizeds[0].authorizer_stu_id))
        else:
            return get_reply_text_xml(msg, get_text_no_check_authorization())