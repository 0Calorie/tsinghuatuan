from django.conf.urls import patterns, url, include

urlpatterns = patterns('',
                       url(r'^$', 'userpage.views.home'),
                       url(r'^validate/try/$', 'userpage.views.validate_post'),
                       url(r'^validate/getTime/$', 'userpage.views.validate_getTime'),
                       url(r'^validate/AuthTHU/$', 'userpage.views.validate_through_AuthTHU'),
                       url(r'^validate/(?P<openid>\S+)/$', 'userpage.views.validate_view'),
                       url(r'^activity/(?P<activityid>\d+)/$','userpage.views.details_view'),
                       url(r'^ticket/(?P<uid>\S+)/$','userpage.views.ticket_view'),
                       url(r'^help/$','userpage.views.help_view'),
                       url(r'^helpact/$','userpage.views.helpact_view'),
                       url(r'^helpclub/$','userpage.views.helpclub_view'),
                       url(r'^helplecture/$','userpage.views.helplecture_view'),
                       url(r'^activity/(?P<actid>\d+)/menu/$', 'userpage.views.activity_menu_view'),
                       url(r'^chooseSeat/(?P<openid>\S+)/(?P<uid>\S+)/$', 'userpage.views.choose_seat_view'),
                       url(r'^chooseSeatConfirm/try/(?P<weixinOpenID>\S+)/(?P<ticketID>\S+)/(?P<seatRow>\d+)/(?P<seatColumn>\d+)/$'
                        , 'userpage.views.chooseSeat_confirmIsHit'),
                       url(r'^authorize/(?P<stuid>\d+)/$', 'userpage.views.authorize_view'),
                       url(r'^authorize/AuthTHU/$', 'userpage.views.authorize_through_AuthTHU')
                       )