from django import forms
from django.conf import settings
from django.core.urlresolvers import reverse
from django.utils.safestring import mark_safe
from django.utils import simplejson

class MarkdownWidget(forms.Textarea):

    def __init__(self, *args, **kwargs):
        self.path = kwargs.pop('path', None)
        super(MarkdownWidget, self).__init__(*args, **kwargs)
    
    class Media:
        js = (
            ( settings.STATIC_URL or settings.MEDIA_URL ) + 'django_markdown/jquery.markitup.js',
            ( settings.STATIC_URL or settings.MEDIA_URL ) + 'django_markdown/ajaxfileupload.js',
            ( settings.STATIC_URL or settings.MEDIA_URL ) + 'django_markdown/sets/markdown/set.js',
            ( settings.STATIC_URL or settings.MEDIA_URL ) + 'django_markdown/sets/markdown/markitup.upload.js',
        )
        css = {
            'screen': (
                ( settings.STATIC_URL or settings.MEDIA_URL ) + 'django_markdown/skins/simple/style.css',
                ( settings.STATIC_URL or settings.MEDIA_URL ) + 'django_markdown/sets/markdown/style.css',
            )
        }

    def render(self, name, value, attrs=None):
        html = super(MarkdownWidget, self).render(name, value, attrs)

        editor_settings = getattr(settings, 'MARKDOWN_EDITOR_SETTINGS', {})
        editor_settings['previewParserPath'] = reverse('django_markdown_preview')

        upload_path = self.path or getattr(settings, 'MARKDOWN_UPLOAD_PATH', None)
        if upload_path:
            upload_url = reverse('django_markdown_upload_with_path', kwargs={'path': upload_path})
        else:
            upload_url = reverse('django_markdown_upload')

        html += """
<script type="text/javascript">
dmd_miu_settings=mySettings;
dmd_miu_settings['previewParserPath']="%s";
$(\'#%s\').markItUp(dmd_miu_settings);
MD_UPLOAD_URL="%s";
</script>
""" % (reverse('django_markdown_preview'), attrs['id'], upload_url)

        return mark_safe(html)
