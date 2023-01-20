
# Generated by Django 4.1.4 on 2023-01-14 01:28


from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_merge_20230111_1939'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='delivery',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='image',
            name='item_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='item_model', to='api.item'),
        ),
        migrations.AlterField(
            model_name='item',
            name='details',
            field=models.TextField(),
        ),
    ]
