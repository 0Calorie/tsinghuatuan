#-*- coding: UTF-8 -*-
from django.db import models
import uuid


class ShortUrl(models.Model):
    short_url = models.CharField(max_length=10)
    raw_url = models.CharField(max_length=255)

class Authorization(models.Model):
    authorizer_stu_id = models.CharField(max_length=255)
    authorized_person_stu_id = models.CharField(max_length=255)
    status = models.IntegerField()
    apply_time = models.DateTimeField()
    # Something about status
    # 0: authorization is applied but not accepted
    # 1: authorization is valid
    # 2: authorization is invalid


class User(models.Model):
    weixin_id = models.CharField(max_length=255)
    stu_id = models.CharField(max_length=255)
    status = models.IntegerField()
    seed = models.FloatField(default=1024)
    authorization = models.ForeignKey(Authorization, null=True)


class Activity(models.Model):
    name = models.CharField(max_length=255)
    key = models.CharField(max_length=255)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    place = models.CharField(max_length=255)
    place_url = models.CharField(max_length=255)
    book_start = models.DateTimeField()
    book_end = models.DateTimeField()
    select_start= models.DateTimeField(null=True)
    select_end = models.DateTimeField(null=True)
    seat_status = models.IntegerField(default=0)
    total_tickets = models.IntegerField(default=0)
    status = models.IntegerField(default=0)
    pic_url = models.CharField(max_length=255)
    remain_tickets = models.IntegerField()
    menu_url = models.CharField(max_length=255, null=True)
    group_interval = models.IntegerField()
    group_size = models.IntegerField(default=0, null=True)
    total_price = models.CharField(max_length=255, null=True)
    # Something about status:
    # -1: deleted
    # 0: saved but not published
    # 1: published
    # Something about seat_status:
    # 0: no seat
    # else: place 


class Seat(models.Model):
    activity = models.ForeignKey(Activity)
    description = models.CharField(max_length=255)
    place = models.CharField(max_length=255)
    status = models.IntegerField()
    seat_type = models.CharField(max_length=255)
    seat_price = models.FloatField()
    seat_floor = models.CharField(max_length=255)
    seat_row = models.IntegerField()
    seat_column = models.IntegerField()
    # status description
    # 0: seat can be select
    # 1: seat is locked, can not be select
    # 2: seat is selected
'''
class Seat(models.Model):
    s_activity_id = models.IntegerField()
    s_place = models.CharField(max_length=255) # TODO : Char or Integer
    s_status = models.IntegerField() # 0 free 1 locked 2 occupied
    s_type = models.IntegerField()
    s_price = models.IntegerField()
    s_floor = models.IntegerField()
    s_row = models.IntegerField()
    s_column = models.IntegerField()
'''


class Ticket(models.Model):
    stu_id = models.CharField(max_length=255)
    unique_id = models.CharField(max_length=255)
    activity = models.ForeignKey(Activity)
    status = models.IntegerField()
    seat_status = models.IntegerField()
    seat = models.ForeignKey(Seat, null=True)
    select_start = models.DateTimeField()
    select_end = models.DateTimeField()
    additional_ticket_id = models.IntegerField()
    # Something about status
    # 0: ticket order is cancelled
    # 1: ticket order is valid
    # 2: ticket is used
    # Something about seat_status
    # -1: no seat
    # 0: have not yet selected seat
    # 1: have selected seat
    # Something about additional_ticket_id
    # -2: is additional ticket
    # -1: no additional ticket
    # else: additional ticket id

