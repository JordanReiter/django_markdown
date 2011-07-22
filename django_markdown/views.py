from django.http import HttpResponse, Http404, HttpResponseBadRequest, HttpResponseNotAllowed
from django.shortcuts import render_to_response
from django.views.generic.simple import direct_to_template
from django.conf import settings
from django.core.files.storage import safe_join
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
#try:
#    import json
#except ImportError:
#    from django.utils.simplejson import simplejson as json  
import json

def preview(request):
    return direct_to_template(
            request, 'django_markdown/preview.html',
            content=request.REQUEST.get('data', 'No content posted'))

def manual(request):
    if request.method == 'POST':
        for field_name in request.FILES:
            uploaded_file = request.FILES[field_name]

            # write the file into /tmp
            destination_path = '/tmp/%s' % (uploaded_file.name)
            destination = open(destination_path, 'wb+')
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
            destination.close()

        # indicate that everything is OK for SWFUpload
        return HttpResponse("ok", mimetype="text/plain")

    else:
        # show the upload UI
        return render_to_response('uploads/manual.html')

@csrf_exempt
@login_required
def upload(request, path="uploads"):
    if request.method == 'POST':
        path = request.POST('path', path)
        if len(request.FILES) != 1:
            return HttpResponseBadRequest("Must upload one and only file at a time.")
        for field_name in request.FILES:
            uploaded_file = request.FILES[field_name]

            # write the file into /tmp
            try:
                destination_folder = safe_join(settings.MEDIA_ROOT, path)
            except ValueError:
                return HttpResponseBadRequest("This usually only happens when you supply an invalid value for the path.")
            try:
                destination_path = '%s/%s/%s' % (destination_folder, uploaded_file.name)
                destination = open(destination_path, 'wb+')
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)
                destination.close()
            except Exception, inst:
                raise Exception("Some kind of error: %s" % inst)

            data = {
                'file': uploaded_file.name,
                'url': '%s/%s/%s' % (settings.MEDIA_URL, path, uploaded_file.name),
                'type': uploaded_file.content_type,
                'size': uploaded_file.size
            } 

            # indicate that everything is OK for SWFUpload
            return HttpResponse(json.dumps(data), content_type='application/json')
    else:
        return HttpResponseNotAllowed("Only allowed to POST items.")
