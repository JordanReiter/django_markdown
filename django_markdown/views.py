""" Supports preview. """
import time
import os
import json

from django.core.files.storage import default_storage, safe_join
from django.http import HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from django.shortcuts import render

from . import settings

def preview(request):
    """ Render preview page.
    :returns: A rendered preview
    """
    if settings.MARKDOWN_PROTECT_PREVIEW:
        user = getattr(request, 'user', None)
        if not user or not user.is_staff:
            from django.contrib.auth.views import redirect_to_login
            return redirect_to_login(request.get_full_path())

    return render(
        request, settings.MARKDOWN_PREVIEW_TEMPLATE, dict(
            content=request.REQUEST.get('data', 'No content posted'),
            css=settings.MARKDOWN_STYLE
        ))

@csrf_exempt
def upload(request, path=None, storage=None):
    storage = storage or settings.MARKDOWN_STORAGE
    path = path or settings.MARKDOWN_UPLOAD_PATH
    if not request.user.is_authenticated():
        return HttpResponseForbidden("You must be logged in to upload files.")
    if request.method != 'POST':
        return HttpResponseNotAllowed("Only allowed to POST items.")
    path = request.POST.get('path', path)
    if len(request.FILES) != 1:
        return HttpResponseBadRequest("Must upload one and only file at a time.")
    for field_name in request.FILES:
        uploaded_file = request.FILES[field_name]

    try:
        safe_join(os.path.basename(__file__), path)
    except ValueError:
        return HttpResponseBadRequest("This usually only happens when you supply an invalid value for the path.")
    filename = uploaded_file.name
    file_prefix, ext = os.path.splitext(filename)
    if storage.exists(filename): # don't overwrite files
        filename = '{file}_{ts}.{ext}'.format(file=file_prefix, ts=int(time.time()), ext=ext)
    destination_path = os.path.join(path, filename)
    storage.save(destination_path, uploaded_file)

    data = {
        'file': filename,
        'url': storage.url(destination_path),
        'type': uploaded_file.content_type,
        'size': uploaded_file.size
    }

    return HttpResponse(json.dumps(data))

