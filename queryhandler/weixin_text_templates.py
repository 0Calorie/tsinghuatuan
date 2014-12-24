# -*- coding:utf-8 -*-
from userpage.safe_reverse import *
from shorturl.views import encode
from queryhandler.settings import QRCODE_URL


def time_chs_format(time):
    if time.days != 0:
        result = str(time.days) + u'天'
    elif time.seconds >= 3600:
        result = str(time.seconds / 3600) + u'小时'
    elif time.seconds >= 60:
        result = str(time.seconds / 60) + u'分钟'
    else:
        result = str(time.seconds) + u'秒'
    return result


def get_text_two_digit(num):
    if num < 10:
        return '0' + str(num)
    else:
        return str(num)


def get_text_time_standard(dt):
    weekdays = ['一', '二', '三', '四', '五', '六', '日']
    return str(dt.year) + '年' + get_text_two_digit(dt.month) + '月' \
           + get_text_two_digit(dt.day) + '日 周' + weekdays[dt.isoweekday() - 1] + ' ' \
           + get_text_two_digit(dt.hour) + ':' + get_text_two_digit(dt.minute)


def get_text_ticket_pic(ticket):
    return QRCODE_URL + str(ticket.unique_id)


def get_text_link(href, title):
    return '<a href="' + encode(href) + '">' + title + '</a>'


def get_text_unbinded_template(actname, openid):
    return '对不起，尚未绑定学号，不能' + actname + '。\n' + get_text_link(s_reverse_validate(openid), '点此绑定学号')


def get_text_help_title():
    return '“紫荆之声”使用指南'


def get_text_help_description(isvalidated):
    return '不想错过园子里精彩的资讯？又没时间没心情到处搜罗信息？想要参加高大上的活动却不想提前数小时排队？' \
           '微信“紫荆之声”帮您便捷解决这些问题！快来看看“紫荆之声”怎么使用吧！' \
           + ('\n您尚未绑定学号，回复“绑定”进行相关操作:)' if not isvalidated else '')


def get_text_activity_title_with_status(activity, now):
    title = activity.name
    if activity.book_start > now:
        delta = activity.book_start - now
        title += ('\n（%s后开始抢票）' % time_chs_format(delta))
    elif activity.book_end > now:
        title += '\n（抢票进行中）'
    else:
        title += '\n（抢票已结束）'
    return title


def get_text_activity_description(activity, MAX_LEN):
    act_abstract = activity.description
    if len(act_abstract) > MAX_LEN:
        return act_abstract[0:MAX_LEN] + '...'
    else:
        return act_abstract


def get_text_no_bookable_activity():
    return '您好，目前没有抢票活动'


def get_text_unbinded_exam_ticket(openid):
    return get_text_unbinded_template('查票', openid)


def get_text_one_ticket_title(ticket, now):
    return ticket.activity.name


def get_text_one_ticket_description(ticket, now):
    tmp = '活动开始前45分钟凭本电子票入场。\n活动时间：' + get_text_time_standard(
        ticket.activity.start_time) + '\n活动地点：' + ticket.activity.place
    if not (ticket.seat is None):
        tmp += ('\n' + '你的座位是：'+ticket.seat.description)
    if ticket.activity.book_end > now:
        tmp += ('\n回复“退票 ' + ticket.activity.key + '”即可退票。')
    return tmp


def get_text_no_ticket():
    return '您好，您目前没有可用票'


def get_text_exam_tickets(tickets, now):
    reply_content = []
    for ticket in tickets:
        tmp = ticket.activity.name + ' ' + get_text_link(s_reverse_ticket_detail(ticket.unique_id), '电子票')
        bkend = ticket.activity.book_end
        if bkend > now:
            tmp += ('\n（' + time_chs_format(bkend - now) + '内可退票）')
        reply_content.append(tmp)
    return '\n-----------------------\n'.join(reply_content)


def get_text_unbinded_fetch_ticket(openid):
    return get_text_unbinded_template('取票', openid)


def get_text_usage_fetch_ticket():
    return '您好，格式不正确！请输入“取票 活动代称”。\n如：“取票 马兰花开”将向您返回马兰花开活动的电子票。'


def get_text_no_such_activity(actname=''):
    if actname == '':
        return '活动不存在或已结束，请重试:)'
    else:
        return '活动不存在或不在' + actname + '时间范围内，请重试:)'


def get_text_no_ticket_in_act(activity, now):
    tmp = '您好，没有找到您的票:('
    bkend = activity.book_end
    if bkend > now:
        tmp += '\n该活动距离抢票结束还有' + time_chs_format(bkend - now) + '，快回复“抢票 ' + activity.key + '”试试运气吧！' \
               + get_text_link(s_reverse_activity_detail(activity.id), '详情')
    return tmp


def get_text_unbinded_book_ticket(openid):
    return get_text_unbinded_template('抢票', openid)


def get_text_usage_book_ticket():
    return '您好，格式不正确！请输入“抢票 活动代称”。\n如：“抢票 马兰花开”'


def get_text_fail_book_ticket(activity, now):
    return '很抱歉，已经没有余票了，过一段时间再来试试吧:)\n该活动距离抢票结束还有' + time_chs_format(activity.book_end - now)


def get_text_success_book_ticket(ticket):
    response = '恭喜您，抢票成功！\n'
    if ticket.seat_status >= 0:
        response += '请在' + get_text_time_standard(ticket.select_start) + '到' + get_text_time_standard(
            ticket.select_end) + '之间进行选座 \n'
        response += '否则，系统将为你随机分配座位哟~ \n'
    return response


def get_text_book_ticket_future(activity, now):
    bkstart = activity.book_start
    return '您好，该活动还没开始抢票哟~' + get_text_link(s_reverse_activity_detail(activity.id), '详情') \
           + '\n抢票开始时间：' + get_text_time_standard(bkstart) \
           + '\n（还剩' + time_chs_format(bkstart - now) + '）'


def get_text_book_ticket_future_with_hint(activity, now):
    return get_text_book_ticket_future(activity, now) + '\n提示：通过微信菜单抢票更方便噢！'


def get_text_existed_book_ticket(ticket):
    return '您已抢到该活动的票，不能重复抢票。\n' + get_text_link(s_reverse_ticket_detail(ticket.unique_id), '查看电子票')


def get_text_unbinded_cancel_ticket(openid):
    return get_text_unbinded_template('退票', openid)


def get_text_usage_cancel_ticket():
    return '您好，格式不正确！请输入“退票 活动代称”。\n如：“退票 马兰花开”将退订马兰花开活动的票。\n（请注意，该操作不可恢复！）'


def get_text_success_cancel_ticket():
    return '退票成功，欢迎关注下次活动'


def get_text_fail_cancel_ticket():
    return '未找到您的抢票记录，退票失败'


def get_text_timeout_cancel_ticket():
    return '该活动的抢票时间已过，不能退票，您可以将票转让给他人（直接转发电子票即可）'


def get_text_unbind_success(openid):
    return '学号绑定已经解除\n' + get_text_link(s_reverse_validate(openid), '重新绑定')


def get_text_binded_account(stuid):
    return '您已经绑定了学号' + stuid + '，若要解绑请回复“解绑”'


def get_text_to_bind_account(openid):
    return '抢票等功能必须绑定学号后才能使用。\n' + get_text_link(s_reverse_validate(openid), '点此绑定学号')


def get_text_hint_no_book_acts():
    return '您好，现在没有推荐的抢票活动哟~'


def get_text_timeout_book_event():
    return '该活动已过抢票时间，您没有抢到票:('


def get_text_existed_book_event():
    return ''
    # return '您已有票，自动切换为取票。\n'


def get_text_usage_get_activity_menu():
    return '您好，格式不正确！请输入“节目单 活动代称”。\n如：“节目单 新年联欢晚会”将向您返回新年联欢晚会的节目单。'


def get_text_fail_get_activity_menu(activity, now):
    sst = activity.start_time
    return '您好，活动开始后才可以查看节目单哟~\n活动开始时间：' + get_text_time_standard(sst) \
           + '\n（还剩' + time_chs_format(sst - now) + '）'


def get_text_title_activity_menu(activity):
    return activity.name + ' - 节目单'


def get_text_desc_activity_menu(activity):
    return '开始时间：' + get_text_time_standard(activity.start_time) \
           + '\n结束时间：' + get_text_time_standard(activity.end_time)


def get_text_no_activity_menu():
    return '您好，该活动未提供节目单。'


def get_text_usage_select_seat():
    return '您好，格式不正确！请输入“选座 活动代称”。\n如：“选座 马兰花开”'


def get_text_no_ticket_to_select_seat(activity):
    return '很抱歉，你没有抢到' + activity.name + '的票，不能进行选座'


def get_text_no_ticket_need_select_seat():
    return '你好，目前没有需要你选座的活动'


def get_text_no_need_to_select_seat():
    return '你好，该活动不需要选座'


def get_text_select_seat_over(seat):
    return '你好，选座已结束，你被随机分配到了座位' + seat.description


def get_text_select_seat_future(ticket, now):
    slstart = ticket.select_start
    return '你好，选座还没开始，距离选座开始还有' + time_chs_format(slstart - now)


def get_text_select_seat(openid, ticket):
    return '你好，你的选座已经开始，请到' + get_text_link(s_reverse_select_seat(openid, ticket.unique_id), '这里') + '进行选座'


def get_text_unbinded_select_seat(openid):
    return get_text_unbinded_template('选座', openid)


def get_text_show_all_seat_selection(openid, tickets):
    response = "你好，现在你可以为以下活动选座\n"
    for ticket in tickets:
        response += '请到' + get_text_link(s_reverse_select_seat(openid, ticket.unique_id),
                                         '这里') + '进行' + ticket.activity.name + '的选座\n'
    return response


def get_text_unbinded_authorize(openid):
    return get_text_unbinded_template('约约约', openid)


def get_text_usage_authorize():
    return '您好，格式不正确！请输入“约吗 被授权人学号”。\n如：“约吗 2012011000”'


def get_text_unable_to_authorize():
    return '对不起，你已经有约在身，不能再约另一个:(\n'+'请先输入"不约"解除当前的"约约约"'


def get_text_authorization_update_time(stu_id, invalid_time):
    response = '你好，你已经与' + stu_id + "约过，现已为你更新“约”的失效时间\n" + '你们的“约”将在' + get_text_time_standard(
        invalid_time) + '或第一次成功抢票后失效'
    return response


def get_text_apply_authorization(stu_id):
    return '你好，你已成功申请与'+stu_id+'的“约”\n'+'你们的“约”将在'+stu_id+'回复“约约约 你的学号”后生效\n'+'请在一个小时内回复“约约约”，否则这个“约”将失效'


def get_text_no_authorization(stu_id):
    return '你好，你想多了，'+stu_id+'根本没有约你'


def get_text_authorization_timeout():
    return '你好，该“约”的请求已经超时'


def get_text_already_authorization():
    return '你好，你现在有别的“约”，“约约约”失败'


def get_text_request_already_authorization():
    return '你好，对方已经由别的“约”了，“约约约”失败'


def get_text_authorization_success():
    return '恭喜您，“约约约”成功'


def get_text_invalid_receive_authorization():
    return '你好，格式不正确，请输入“约约约 对方学号”。\n如：“约约约 2012012333”'


def get_text_cancel_authorization_success(stu_id):
    return '你好，你和'+stu_id+'的“约”已经成功解除'


def get_text_cancel_no_authorization():
    return '你好，你没有“约”要解除'


def get_text_can_not_authorize_yourself():
    return '对不起，你不可以约自己'


def get_text_check_authorization(stu_id):
    return '你好，你“约”的对象是'+stu_id


def get_text_no_check_authorization():
    return '你好，目前你没有“约”'


def get_text_already_authorized_can_not_book_ticket(stu_id):
    return '对不起，你已经和'+stu_id+'“约约约”了，不能进行抢票\n'+stu_id+'会帮你抢票的哟'

def get_text_authorization_link(stu_id):
    return '生成"约吗"链接成功\n转发此链接\n'+encode(s_reverse_authorize(stu_id))+'\n给你想约的人完成"约约约"';