function UploadFile(event) {
	$form = $(this.form);
	$.ajaxFileUpload
	(
		{
			url: $form.attr('action'),
			secureuri:false,
			fileElementId: this.id,
			dataType: 'json',
			success: function (data, status)
			{
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
	updateForm: function(form, data) {
		var $preview=$(form).find('#med-image-preview');
		$(form).find("#md-upload-url").val(data.url);
		if ($preview.length) {
			$('<img src="' + data.url + '">')
				.css({
					maxWidth: '200px',
					maxHeight: '200px'
				})
				.appendTo($preview);
		}
	},
	fileDialog: function(markItUp) {
		var markItUp = markItUp,
			triggerInsert = function () {
				var url = $url_input.val(),
					result = "[",
					title = null,
					label = markItUp.selection,
					filename = url.split('/').pop();
				if (!label.trim().length) {
					label = filename;
				}
				return markItUp.selection + '[' + label + '](' + url + ' "File: ' + filename + '")';
			},
			$upload_form = $('<form enctype="multipart/form-data">')
				.addClass('md-upload-dialog')
				.attr('action', MD_UPLOAD_URL),
			$url_input = $('<input type="text" name="url" id="md-upload-url" />'),
			$url_label = $('<label>').html("Image URL :"),
			$upload_input = $('<input type="file" name="file" id="md-upload-file" />')
				.change(UploadFile),
			$insert_button = $('<input type="submit" value="Insert" />').change(triggerInsert),
			$upload_label = $('<label>').html("Upload :");
		$url_label.append($url_input);
		$upload_label.append($upload_input);
		$alt_label.append($alt_input);
		$("<small>").html(" (optional)").insertAfter($alt_input);
		$upload_form.append($upload_label);
		$upload_form.append($url_label);
		$upload_form.append($alt_label);
		$upload_form.appendTo('body');
		$upload_form.dialog({ modal: true });
	},
	imageDialog: function(markItUp) {
		var markItUp = markItUp,
			triggerInsert = function (event) {
				var alt_text= $alt_input.val(),
					url = $url_input.val();
		        $(this.markItUp.textarea).trigger('insertion', 
		            [{replaceWith: markItUp.selection + '![' + url + '](' + data.url + ')'}]);
				event.stopPropagation();
				event.preventDefault();
				return false;
			},
			$upload_form = $('<form enctype="multipart/form-data">')
				.addClass('md-upload-dialog')
				.attr('action', MD_UPLOAD_URL),
			$url_input = $('<input type="text" name="url" id="md-upload-url" />'),
			$url_label = $('<label>').html("Image URL :"),
			$alt_input = $('<input type="text" name="alt" id="md-upload-alt" />'),
			$alt_label = $('<label>').html("Alt text:"),
			$img_preview = $('<div id="md-image-preview">').css({
					"float": 'right',
					background: '#ccc',
					border: '1px solid black',
					width: '200px',
					padding: '5px',
					marginLeft: '10px'
				}),
			$upload_input = $('<input type="file" name="file" id="md-upload-file" />')
				.change(UploadFile),
			$insert_button = $('<input type="submit" value="Insert" />').change(triggerInsert),
			$upload_label = $('<label>').html("Upload :");
		$url_label.append($url_input);
		$upload_label.append($upload_input);
		$alt_label.append($alt_input);
		$("<small>").html(" (optional)").insertAfter($alt_input);
		$upload_form.append($upload_label);
		$upload_form.append($url_label);
		$upload_form.append($alt_label);
		$upload_form.appendTo('body');
		$upload_form.dialog({ modal: true });
	}
}