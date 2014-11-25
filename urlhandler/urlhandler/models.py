#-*- coding: UTF-8 -*-
from django.db import models
import uuid


class User(models.Model):
    weixin_id = models.CharField(max_length=255)
    stu_id = models.CharField(max_length=255)
    status = models.IntegerField()
    seed = models.FloatField(default=1024)


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
    seat_status = models.IntegerField(default=0)
    total_tickets = models.IntegerField()
    status = models.IntegerField()
    pic_url = models.CharField(max_length=255)
    remain_tickets = models.IntegerField()
    menu_url = models.CharField(max_length=255, null=True)
    group_interval = models.IntegerField()
    group_size = models.IntegerField()
    select_start = models.DateTimeField()
    # Something about status:
    # -1: deleted
    # 0: saved but not published
    # 1: published
    # Something about seat_status:
    # 0: no seat
    # 1: require to select seat


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
    # Something about status
    # -1: no seat
    # 0: have not yet selected seat
    # 1: have selected seat
    # Something about additional_ticket_id
    # -1: no additional ticket
    # else: additional ticket id


'''
class UserSession(models.Model):
    stu_id = models.CharField(max_length=255)
    session_key = models.CharField(max_length=255)
    session_status = models.IntegerField(1)

    def generate_session(self,stu_id):
        try:
            stu = User.objects.get(stu_id=stu_id)
            sessions = UserSession.objects.filter(stu_id = stu_id)
            if sessions:
                for session in sessions:
                    session.delete()
            s = UserSession(stu_id=stu_id,session_key=uuid.uuid4(),session_status = 0)
            s.save()
            return True
        except:
            return False

    def is_session_valid(self,stu_id,session_key):
        try:
            s = UserSession.objects.get(stu_id=stu_id,session_key=session_key)
            if(s.session_status == 0):
                s.session_status = 1
                s.save()
                return True
            else:
                s.delete()
                return False
        except:
            return False

    def can_print(self,stu_id,session_key):
        try:
            s = UserSession.objects.get(stu_id=stu_id,session_key=session_key)
            return True
        except:
            return False
'''
