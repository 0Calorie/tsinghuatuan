# -*- coding:utf-8 -*-

from django.http import HttpResponseRedirect
from urlhandler.models import *
import hashlib
from queryhandler.settings import SITE_DOMAIN


def decode(request, short_url):
    surl = ShortUrl.objects.filter(short_url=short_url)
    if surl.exists():
        raw_url = surl[0].raw_url
        return HttpResponseRedirect(raw_url)
    else:
        return HttpResponseRedirect(SITE_DOMAIN+'/u/')

key = 'shabihuang'
chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
Index = 0


def encode(raw_url):
    short_urls = ShortUrl.objects.filter(raw_url=raw_url)
    if short_urls.exists():
        return SITE_DOMAIN+'/s/'+short_urls[0].short_url+'/'
    else:
        md5 = hashlib.md5((key+raw_url).encode('utf-8')).hexdigest()
        result_url = list()
        for i in xrange(4):
            substr = md5[(i*8):(i*8+8)]
            lHexLong = 0x3FFFFFFF & int(substr, 16)
            short_url = ''
            for j in xrange(6):
                index = 0x0000003D & lHexLong
                short_url += chars[index]
                lHexLong >>= 5
            result_url.append(short_url)
        ShortUrl.objects.create(
            short_url=result_url[Index],
            raw_url=raw_url
        )
        return SITE_DOMAIN+'/s/'+result_url[Index]+'/'