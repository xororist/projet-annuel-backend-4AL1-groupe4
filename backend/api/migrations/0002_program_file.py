# Generated by Django 5.0.4 on 2024-04-20 13:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='program',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='programs/'),
        ),
    ]
