function getSizeAsync(url, obj, key, fun) {
	/*
	 * Because Ajax is async, you can't just return a value.
	 * Instead, we set the value in the obj, by setting the key to the size.
	 * Also, if given a callback, we call that with the object and the value.
	 */
	$.ajax({
		type: "HEAD",
		url: url, 
		success: function(output, status, xhr) {
			size = (xhr.getResponseHeader("Content-Length"))
			obj[key] = size;
			if (fun) {
				fun(obj, size)
			}
		},
		error: function(output) {
		  alert(output);
		}
	}); 
}



function generateDialog(type, fields, title, btns, preview) {
	var $upload_form, $form_content, $upload_fields, $footer,
		ff, field, field_html, $field, $label, bb;
	$upload_form = $('<form enctype="multipart/form-data">')
		.addClass('modal-dialog')
		.attr('action', MD_UPLOAD_URL);
	$form_content = $('<div>').addClass('modal-content').appendTo($upload_form).empty();
	$title = $('<h4>').addClass('modal-title').text(title).wrap('<div>').parent().addClass('modal-header').prependTo($form_content);
	$upload_fields = $('<fieldset>').addClass('modal-body').appendTo($form_content);
	$upload_fields.append(preview);
	for (ff = 0; ff < fields.length; ff += 1) {
		field = fields[ff];
		if (field.type === 'textarea') {
			$field = $('<textarea>')
				.attr('rows', field.rows || 2)
				.attr('cols', field.cols || 40);
		} else {
			$field = $('<input type="' + (field.type || 'text') + '">');
		}
		$field.attr('name', field.name);
		$field.attr('id', 'md-upload-' + field.name);
		if (field.placeholder) {
			$field.attr('placeholder', field.placeholder);
		}
		$label = $('<label>').text(field.label || field.name).addClass('sr-only')
		$upload_fields
			.append(
				$('<p>')
					.addClass('form-group')
					.append($label).append($field)
			);
	}
	$upload_fields
		.append(
			$('<p>')
				.addClass('form-group')
				.append($('<label>').text(type + " Upload").addClass("sr-only"))
				.append(
					$('<input type="file" name="file" id="md-upload-file">')
					.prop('accept', type === 'Image' ? 'image/*' : '*')
				)
		);
	$footer = $('<div>').addClass('modal-footer').appendTo($form_content);
	$(document).on('change', '#md-upload-file', UploadFile);
	for (bb=0; bb < btns.length; bb += 1) {
		btn = btns[bb];
		$footer.append(btn);
	}
	return $upload_form
		.appendTo('body')
		.wrap('<div>').parent().addClass('modal').modal('show');
}


/**
 * Convert number of bytes into human readable format
 *
 * @param integer bytes	 Number of bytes to convert
 * @param integer precision Number of digits after the decimal separator
 * @return string
 * From http://codeaid.net/javascript/convert-size-in-bytes-to-human-readable-format-%28javascript%29
 */
function bytesToSize(bytes, precision)
{  
	var kilobyte = 1024, 
		megabyte = kilobyte * 1024,
		gigabyte = megabyte * 1024,
		terabyte = gigabyte * 1024;
	
	if (!precision) {
		precision = 1;
	}
   
	if ((bytes >= 0) && (bytes < kilobyte)) {
		return bytes + ' bytes';
 
	} else if ((bytes >= kilobyte) && (bytes < megabyte)) {
		return (bytes / kilobyte).toFixed(precision) + ' KB';
 
	} else if ((bytes >= megabyte) && (bytes < gigabyte)) {
		return (bytes / megabyte).toFixed(precision) + ' MB';
 
	} else if ((bytes >= gigabyte) && (bytes < terabyte)) {
		return (bytes / gigabyte).toFixed(precision) + ' GB';
 
	} else if (bytes >= terabyte) {
		return (bytes / terabyte).toFixed(precision) + ' TB';
 
	} else {
		return bytes + ' B';
	}
}


function UploadFile(event) {
	var $form = $(this.form),
		$el = $(this),
		old_id = $el.attr('id');
	$.ajaxFileUpload({
		url: $form.attr('action'),
		secureuri:false,
		fileElementId: this.id,
		dataType: 'json',
		success: function (data, status) {
			$el = $form.find(":input[name='file']");
			$el.replaceWith('<input id="md-upload-file" type="file" name="file" />');
			MarkdownUpload.updateUrl($form, data);
			if(typeof(data.error) != 'undefined') {
				if(data.error !== '') {
					alert(data.error);
				} else {
					alert(data.msg);
				}
			}
		},
		error: function (data, status, e) {
			alert(e);
		}
	});
}

MarkdownUpload = {
	updateUrl: function(form, data) {
		var $preview=$(form).find('#md-image-preview'),
			$title=$(form).find(":input[name='title']"),
			title = "";
		$(form).find("#md-upload-url").val(data.url);
		MarkdownUpload.updateForm(form, data.url, data.size);
	},
	updateForm: function(form, url, size) {
		var size_holder={},
			$form = $(form),
			$preview=$(form).find('#md-image-preview'),
			$file_info=$(form).find('#md-file-info'),
			$title=$(form).find(":input[name='title']"),
			filename = "",
			title = "";
		if (!url) {
			url = $form.find(":input[name='url']").val();
		}
		filename = url.split('/').pop();
		if ($preview.length) {
			$('<img src="' + url + '">')
				.css({
					maxWidth: '200px !important',
					maxHeight: '200px !important'
				})
				.appendTo($preview.empty());
		}
		if ($file_info.length) {
			$file_deets = $("<a>").attr("href", url)
				.attr('target','_blank')
				.html(filename)
				.addClass('file-link')
				.appendTo($file_info.empty());
			if (size) {
				$('<div>').text(bytesToSize(size)).insertAfter($file_deets);
			}
			ext = url.split('.').pop();
			if (ext=='doc' || ext == 'docx' || ext == 'rtf') {
				ext = 'text';
			} else if (ext == 'pptx' || ext == 'ppt') {
				ext = 'powerpoint';
			}
			if (ext) {
				$('<span>').addClass('fa fa-2x fa-file-' + ext + '-o').css('display', 'block').insertBefore($file_deets);
			}
		}
		if ($title.length) {
			title = "File: " + filename;
			if (!size) {
				getSizeAsync(url, size_holder, "value", function () {
					$(title).val(title + " [" + bytesToSize(size) + "]");
				});
			} else {
				title += " [" + bytesToSize(size) + "]";
			}
			$title.val(title);
		}
	},
	fileDialog: function(markItUp) {
		var $dialog,
			triggerInsert = function (event) {
				var url = $dialog.find(':input[name="url"]').val(),
					result = "[",
					title = null,
					label = markItUp.selection,
					filename = url.split('/').pop();
				if (!label.trim().length) {
					label = filename;
				}
				title = $dialog.find(":input[name='title']").val();
				$(markItUp.textarea).trigger('insertion', 
					[{replaceWith: '[' + label + '](' + url + ' "' + title + '")'}]);
				event.stopPropagation();
				event.preventDefault();
 				$dialog.modal('hide');
				return false;
			},
			fields = [
				{ name: "url", placeholder: "File URL (leave blank if uploading file)", label: "File URL:", type: "url" },
				{ name: "title", placeholder: "Title", label: "Title:", type: "textarea", rows: 2, cols: 40 },
			],
			$file_info = $('<div id="md-file-info">').css('float','right').css({
					width: '200px !important',
					height: '200px !important',
					marginLeft: '10px',
					textAlign: 'center',
				}),
			$insert_button = $('<input type="submit" value="Insert" />').addClass('btn btn-primary').click(triggerInsert);
		$dialog = generateDialog("File", fields, "Add File", [$insert_button], $file_info);
	},
	imageDialog: function(markItUp) {
		var $dialog,
			triggerInsert = function (event) {
		var alt_text= $dialog.find(":input[name='alt']").val() || "",
					url = $dialog.find(':input[name="url"]').val();
				$(markItUp.textarea).trigger('insertion', 
					[{replaceWith: markItUp.selection + '![' + alt_text + '](' + url + ')'}]);
				event.stopPropagation();
				event.preventDefault();
 				$dialog.modal('hide');
				return false;
			},
			fields = [
				{ name: "url", placeholder: "Image URL (leave blank if uploading file)", label: "File URL:", type: "url" },
				{ name: "alt", placeholder: "Description of Image", label: "Alternative Description:", type: "textarea", rows: 2, cols: 40 },
			],
			$img_preview = $('<div id="md-image-preview">').css('float','right').css({
					background: '#ccc',
					border: '1px solid black',
					width: '200px !important',
					height: '200px !important',
					marginLeft: '10px'
				}),
			$insert_button = $('<input type="submit" value="Insert" />').addClass('btn btn-primary').click(triggerInsert);
		$dialog = generateDialog("Image", fields, "Add File", [$insert_button], $img_preview);
	}
};

