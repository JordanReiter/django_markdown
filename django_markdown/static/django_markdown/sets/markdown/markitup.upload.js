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


/**
 * Convert number of bytes into human readable format
 *
 * @param integer bytes     Number of bytes to convert
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
        return bytes + ' B';
 
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
	var $form = $(this.form);
//	alert("About to upload a file : " + this.name) + ' to ' + $form.attr('action');
	$.ajaxFileUpload
	(
		{
			url: $form.attr('action'),
			secureuri:false,
			fileElementId: this.id,
			dataType: 'json',
			success: function (data, status)
			{
				MarkdownUpload.updateUrl($form, data);
				//alert("The data is "+data);
				if(typeof(data.error) != 'undefined')
				{
					if(data.error != '')
					{
						alert(data.error);
					}else
					{
						alert(data.msg);
					}
				}
			},
			error: function (data, status, e)
			{
				alert(e);
			}
		}
	)
}

MarkdownUpload = {
	updateUrl: function(form, data) {
		var $preview=$(form).find('#md-image-preview'),
			$title=$(form).find("input[name='title']"),
			title = "";
		$(form).find("#md-upload-url").val(data.url);
//		title = "File: data.file"
//		if (data.size) {
//			title += " [" + bytesToSize(data.size) + "]";
//		}
//		if ($preview.length) {
//			$('<img src="' + data.url + '">')
//				.css({
//					maxWidth: '200px',
//					maxHeight: '200px'
//				})
//				.appendTo($preview);
//		}
//		$title.val(title);
		updateForm(form, data.url, data.size);
	},
	updateForm: function(form, url, size) {
		var size={},
			$form = $(form)
			$preview=$(form).find('#md-image-preview'),
			$title=$(form).find("input[name='title']"),
			title = "";
		if (!url) {
			url = $form.find("input[name='url']").val();
		}
		if ($preview.length) {
			$('<img src="' + data.url + '">')
				.css({
					maxWidth: '200px',
					maxHeight: '200px'
				})
				.appendTo($preview);
		}
		if ($title.length) {
			title = "File: " + url.split('/').pop();
			if (!size) {
				getSizeAsync(url, size, "value", function () {
					$(title).val(title + " [" + bytesToSize + "]");
				});
			} else {
				title += " [" + bytesToSize(size) + "]";
			}
			$(title).val(title);
		}
	},
	fileDialog: function(markItUp) {
		var markItUp = markItUp,
			triggerInsert = function (event) {
				var url = $url_input.val(),
					result = "[",
					title = null,
					label = markItUp.selection,
					filename = url.split('/').pop();
				if (!label.trim().length) {
					label = filename;
				}
				title = $upload_form.find("input[name='title']").val();
		        $(markItUp.textarea).trigger('insertion', 
		            [{replaceWith: '[' + label + '](' + url + ' "' + title + '")'}]);
				event.stopPropagation();
				event.preventDefault();
 				$upload_form.remove()
				return false;
			},
			$upload_form = $('<form enctype="multipart/form-data">')
				.addClass('md-upload-dialog')
				.attr('action', MD_UPLOAD_URL),
			$url_input = $('<input type="text" name="url" id="md-upload-url" />')
				.change(function () { updateForm(this) }),
			$url_label = $('<label>').html("File URL :"),
			$title_input = $('<input type="text" name="title" id="md-upload-title" />'),
			$title_label = $('<label>').html("Title:"),
			$upload_input = $('<input type="file" name="file" id="md-upload-file" />')
				.change(UploadFile),
			$insert_button = $('<input type="submit" value="Insert" />').click(triggerInsert),
			$upload_label = $('<label>').html("Upload :");
		$url_label.append($url_input);
		$upload_label.append($upload_input);
		$title_label.append($title_input);
		$upload_form.append($("<p>").append($upload_label));
		$upload_form.append($("<p>").append($url_label));
		$upload_form.append($("<p>").append($title_label));
		$upload_form.append($("<p>").append($insert_button));
		$upload_form.appendTo('body');
		$upload_form.dialog({ modal: true, width: 650 });
	},
	imageDialog: function(markItUp) {
		var markItUp = markItUp,
			triggerInsert = function (event) {
				var alt_text= $alt_input.val() || "",
					url = $url_input.val();
		        $(markItUp.textarea).trigger('insertion', 
		            [{replaceWith: markItUp.selection + '![' + alt_text + '](' + url + ')'}]);
				event.stopPropagation();
				event.preventDefault();
 				$upload_form.remove()
				return false;
			},
			$upload_form = $('<form enctype="multipart/form-data">')
				.addClass('md-upload-dialog')
				.attr('action', MD_UPLOAD_URL),
			$url_input = $('<input type="text" name="url" id="md-upload-url" />')
				.change(function () { updateForm(this) }),
			$url_label = $('<label>').html("Image URL :"),
			$alt_input = $('<input type="text" name="alt" id="md-upload-alt" />'),
			$alt_label = $('<label>').html("Alt text:"),
//			$title_input = $('<input type="text" name="title" id="md-upload-title" />'),
//			$title_label = $('<label>').html("Title:"),
			$img_preview = $('<div id="md-image-preview">').css('float','right').css({
					background: '#ccc',
					border: '1px solid black',
					width: '200px',
					height: '200px',
					padding: '5px',
					marginLeft: '10px'
				}),
			$upload_input = $('<input type="file" name="file" id="md-upload-file" />')
				.change(UploadFile),
			$insert_button = $('<input type="submit" value="Insert" />').click(triggerInsert),
			$upload_label = $('<label>').html("Upload :");
		$url_label.append($url_input);
		$upload_label.append($upload_input);
//		$title_label.append($title_input);
		$alt_label.append($alt_input);
		$("<small>").html(" (optional)").insertAfter($alt_input);
		$upload_form.append($img_preview);
		$upload_form.append($("<p>").append($upload_label));
		$upload_form.append($("<p>").append($url_label));
		$upload_form.append($("<p>").append($alt_label));
//		$upload_form.append($("<p>").append($title_label));
		$upload_form.append($("<p>").append($insert_button));
		$upload_form.appendTo('body');
		$upload_form.dialog({ modal: true, width: 650 });
	}
}
