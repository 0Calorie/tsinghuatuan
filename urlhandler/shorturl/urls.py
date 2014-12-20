from django.conf.urls import patterns, url, include

urlpatterns = patterns('',
                       url(r'^(?P<short_url>\S+)/$', 'shorturl.views.decode')
                       )