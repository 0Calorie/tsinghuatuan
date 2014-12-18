#-*- coding:utf-8 -*-

WEIXIN_TOKEN = 'F8ZFW1Cyzr5z6nNoJ5uZhA8iXEbe1hvX'

WEIXIN_APPID = 'wx831526d6539bc931'

WEIXIN_SECRET = 'bff32af0d1a84d8ffbfb61f07d0a6557'

WEIXIN_EVENT_KEYS = {
    'info_activity': 'V1001_TODAT_ACTIVE',
    'info_lecture': 'V1001_TODAT_LECTURE',
    'info_news': 'V1001_SCHOOL_NEWS',
    'info_organization': 'V1001_OGNIZATION',
    'ticket_book_what': 'TSINGHUA_BOOK_WHAT',
    'ticket_get': 'TSINGHUA_TICKET',
    'account_bind': 'TSINGHUA_BIND',
    'ticket_select_seat': 'TSINGHUA_SELECT',
    'help': 'TSINGHUA_HELP',
    'ticket_no_book_recommand': 'TSINGHUA_NO_BOOK_ACTS',
    'ticket_book_header': 'TSINGHUA_BOOK_',
    'modern_figure': 'V1001_MODERN_FIGURE',
    'authorize': 'TSINGHUA_authorize'
}

WEIXIN_CUSTOM_MENU_TEMPLATE = {
    "button": [
        {
            "name": "服务",
            "sub_button": [
                {
                    "type": "click",
                    "name": "抢啥",
                    "key": WEIXIN_EVENT_KEYS['ticket_book_what'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "查票",
                    "key": WEIXIN_EVENT_KEYS['ticket_get'],
                    "sub_button": []
                },
                #{
                #    "type": "click",
                #    "name": "指路",
                #    "key": "TSINGHUA_PATH",
                #    "sub_button": []
                #},
                {
                    "type": "click",
                    "name": "选座",
                    "key": WEIXIN_EVENT_KEYS['ticket_select_seat'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "绑定",
                    "key": WEIXIN_EVENT_KEYS['account_bind'],
                    "sub_button": []
                },
                {
                    "type": "click",
                    "name": "帮助",
                    "key": WEIXIN_EVENT_KEYS['help'],
                    "sub_button": []
                }
            ]
        },
        {
            "type": "click",
            "name": "约吗",
            "key": WEIXIN_EVENT_KEYS['authorize'],
            "sub_button": []
        },
        {
            "name": "抢票",
            "sub_button": []
        }
    ]
}

WEIXIN_BOOK_HEADER = 'TSINGHUA_BOOK_'


def get_custom_menu_with_book_acts(actbtns):
    tmpmenu = WEIXIN_CUSTOM_MENU_TEMPLATE.copy()
    book_btn = tmpmenu['button'][2]
    if len(actbtns) == 0:
        book_btn['type'] = 'click'
        book_btn['key'] = WEIXIN_EVENT_KEYS['ticket_no_book_recommand']
    book_btn['sub_button'] = actbtns
    return tmpmenu

