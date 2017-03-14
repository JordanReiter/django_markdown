""" Define preview URL. """

try:
    from django.conf.urls import patterns, url
except ImportError:
    from django.conf import urls
    patterns = None

from .views import preview, upload

urlpatterns = [
        url('preview/$', preview, name='django_markdown_preview'),
        url('upload/(?P<path>.*)/$', upload, name='django_markdown_upload_with_path'),
        url('upload/$', upload, name='django_markdown_upload'),
]

if patterns:
    urlpatterns = patterns('', *urlpatterns)
