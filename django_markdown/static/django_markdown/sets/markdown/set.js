// -------------------------------------------------------------------
// markItUp!
// -------------------------------------------------------------------
// Copyright (C) 2008 Jay Salvat
// http://markitup.jaysalvat.com/
// -------------------------------------------------------------------
// MarkDown tags example
// http://en.wikipedia.org/wiki/Markdown
// http://daringfireball.net/projects/markdown/
// -------------------------------------------------------------------
// Feel free to add more tags
// -------------------------------------------------------------------
mySettings = {
	previewParserPath:	'',
	onShiftEnter:		{keepDefault:false, openWith:'\n\n'},
	markupSet: [
		{name:'First Level Heading', className: 'h1-button', key:'1', placeHolder:'Your title here...', closeWith:function(markItUp) { return miu.markdownTitle(markItUp, '=') } },
		{name:'Second Level Heading', className: 'h2-button', key:'2', placeHolder:'Your title here...', closeWith:function(markItUp) { return miu.markdownTitle(markItUp, '-') } },
		{name:'Heading 3', key:'3', className: 'h3-button', openWith:'### ', placeHolder:'Your title here...' },
		{name:'Heading 4', key:'4', className: 'h4-button', openWith:'#### ', placeHolder:'Your title here...' },
		{name:'Heading 5', key:'5', className: 'h5-button', openWith:'##### ', placeHolder:'Your title here...' },
		{name:'Heading 6', key:'6', className: 'h6-button', openWith:'###### ', placeHolder:'Your title here...' },
		{separator:'---------------' },		
		{name:'Bold', className: 'bold-button', key:'B', openWith:'**', closeWith:'**'},
		{name:'Italic', className: 'italic-button', key:'I', openWith:'_', closeWith:'_'},
		{separator:'---------------' },
		{name:'Bulleted List', className: 'ul-button', openWith:'- ' },
		{name:'Numeric List', className: 'ol-button', openWith:function(markItUp) {
			return markItUp.line+'. ';
		}},
		{separator:'---------------' },
		{name:'Picture', className: 'picture-button', key:'P', replaceWith: function(miu) { MarkdownUpload.imageDialog(miu) }},
		{name:'File', className:"file-button", replaceWith: function(miu) { MarkdownUpload.fileDialog(miu) }},
		{name:'Link', className: 'link-button', key:'L', openWith:'[', closeWith:']([![Url:!:http://]!] "[![Title]!]")', placeHolder:'Your text to link here...' },
		{separator:'---------------'},	
		{name:'Quotes', className: 'quote-button', openWith:'> '},
//		{name:'Code Block / Code', openWith:'(!(\t|!|`)!)', closeWith:'(!(`)!)'},
		{separator:'---------------'},
		{name:'Preview', call:'preview', className:"preview"}
	]
}

// mIu nameSpace to avoid conflict.
miu = {
	markdownTitle: function(markItUp, char) {
		heading = '';
		n = $.trim(markItUp.selection||markItUp.placeHolder).length;
		for(i = 0; i < n; i++) {
			heading += char;
		}
		return '\n'+heading;
	}
}