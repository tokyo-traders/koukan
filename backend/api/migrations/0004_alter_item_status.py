# Generated by Django 4.1.4 on 2022-12-24 02:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_item'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='status',
            field=models.IntegerField(default=0),
        ),
    ]
