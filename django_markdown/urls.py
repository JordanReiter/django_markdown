""" Define preview URL. """

from django.conf.urls import patterns, url

from .views import preview, upload

urlpatterns = patterns( 
        '', url('preview/$', preview, name='django_markdown_preview'),
        url('upload/(?P<path>.*)/$', upload, name='django_markdown_upload_with_path'),
        url('upload/$', upload, name='django_markdown_upload'),
    )
