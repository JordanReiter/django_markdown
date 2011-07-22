from django.conf.urls.defaults import url, patterns

from django_markdown.views import preview, upload


urlpatterns = patterns( '',
        url('preview/$', preview, name='django_markdown_preview'),
        url('upload/(?P<path>.*)/$', upload, name='django_markdown_upload_with_path'),
        url('upload/$', upload, name='django_markdown_upload'),
    )
