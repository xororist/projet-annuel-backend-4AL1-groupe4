# Generated by Django 5.0.6 on 2024-06-19 19:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_rename_author_action_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='action',
            old_name='user',
            new_name='author',
        ),
    ]