# Generated by Django 4.1.4 on 2023-01-06 00:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_item_item_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='item_image',
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='images/')),
                ('item_id', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='api.item')),
            ],
        ),
    ]