# Generated by Django 3.2.17 on 2023-05-30 06:44

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='expiration',
            field=models.DateTimeField(default=datetime.datetime(2023, 6, 6, 6, 44, 34, 541624, tzinfo=utc)),
        ),
    ]