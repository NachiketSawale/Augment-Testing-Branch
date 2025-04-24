/**
 * Created by alisch on 18.06.2020.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc object
	 * @name cloudDesktopTextEditorConsts
	 * @description Constant for text editor control
	}]
	 */
	angular.module('cloud.desktop').constant('cloudDesktopTextEditorConsts', {
		fontSizes: [
			{
				value: '1',
				size: '6'
			},
			{
				value: '2',
				size: '7'
			},
			{
				value: '3',
				size: '10'
			},
			{
				value: '4',
				size: '11'
			},
			{
				value: '5',
				size: '12'
			},
			{
				value: '6',
				size: '14'
			},
			{
				value: '7',
				size: '18'
			},
			{
				value: '8',
				size: '24'
			},
			{
				value: '9',
				size: '32'
			}
		],
		buttons: [
			{
				id: 'bold',
				cssClass: 'wysiwyg-tb-bold',
				caption: 'Bold',
				caption$tr$: 'platform.wysiwygEditor.bold',
				visibility: true
			}, {
				id: 'italic',
				cssClass: 'wysiwyg-tb-italic',
				caption: 'Italic',
				caption$tr$: 'platform.wysiwygEditor.italic',
				visibility: true
			}, {
				id: 'underline',
				cssClass: 'wysiwyg-tb-underline',
				caption: 'Underline',
				caption$tr$: 'platform.wysiwygEditor.underline',
				visibility: true
			}, {
				id: 'header',
				cssClass: 'wysiwyg-tb-header',
				caption: 'Header',
				caption$tr$: 'platform.wysiwygEditor.header',
				visibility: true
			}, {
				id: 'font',
				cssClass: 'wysiwyg-tb-font',
				caption: 'Font',
				caption$tr$: 'platform.wysiwygEditor.font',
				visibility: true
			}, {
				id: 'fontSize',
				cssClass: 'wysiwyg-tb-fontSize',
				caption: 'Font Size',
				caption$tr$: 'platform.wysiwygEditor.fontSize',
				visibility: true
			}, {
				id: 'fontColor',
				cssClass: 'wysiwyg-tb-fontColor',
				caption: 'Font Color',
				caption$tr$: 'platform.wysiwygEditor.fontColor',
				visibility: true
			}, {
				id: 'highlightColor',
				cssClass: 'wysiwyg-tb-highlightColor',
				caption: 'HighlightColor',
				caption$tr$: 'platform.wysiwygEditor.highlightColor',
				visibility: true
			}, {
				id: 'strikethrough',
				cssClass: 'wysiwyg-tb-strikethrough',
				caption: 'Strikethrough',
				caption$tr$: 'platform.wysiwygEditor.strikeThrough',
				visibility: false
			}, {
				id: 'subscript',
				cssClass: 'wysiwyg-tb-subscript',
				caption: 'Subscript',
				caption$tr$: 'platform.wysiwygEditor.subscript',
				visibility: false
			}, {
				id: 'superscript',
				cssClass: 'wysiwyg-tb-superscript',
				caption: 'Superscript',
				caption$tr$: 'platform.wysiwygEditor.superscript',
				visibility: false
			}, {
				id: 'removeformatting',
				cssClass: 'wysiwyg-tb-removeformatting',
				caption: 'Remove Formatting',
				caption$tr$: 'platform.wysiwygEditor.removeFormatting',
				visibility: true
			}, {
				id: 'orderedlist',
				cssClass: 'wysiwyg-tb-orderedlist',
				caption: 'Ordered List',
				caption$tr$: 'platform.wysiwygEditor.orderedList',
				visibility: true
			}, {
				id: 'unorderedlist',
				cssClass: 'wysiwyg-tb-unorderedlist',
				caption: 'Unordered List',
				caption$tr$: 'platform.wysiwygEditor.unorderedList',
				visibility: true
			}, {
				id: 'outdent',
				cssClass: 'wysiwyg-tb-outdent',
				caption: 'Outdent',
				caption$tr$: 'platform.wysiwygEditor.outdent',
				visibility: true
			}, {
				id: 'indent',
				cssClass: 'wysiwyg-tb-indent',
				caption: 'Indent',
				caption$tr$: 'platform.wysiwygEditor.indent',
				visibility: true
			}, {
				id: 'leftjustify',
				cssClass: 'wysiwyg-tb-leftjustify',
				caption: 'Left Justify',
				caption$tr$: 'platform.wysiwygEditor.leftJustify',
				visibility: true
			}, {
				id: 'centerjustify',
				cssClass: 'wysiwyg-tb-centerjustify',
				caption: 'Center Justify',
				caption$tr$: 'platform.wysiwygEditor.centerJustify',
				visibility: true
			}, {
				id: 'rightjustify',
				cssClass: 'wysiwyg-tb-rightjustify',
				caption: 'Right Justify',
				caption$tr$: 'platform.wysiwygEditor.rightJustify',
				visibility: true
			}, {
				id: 'code',
				cssClass: 'wysiwyg-tb-code',
				caption: 'Code',
				caption$tr$: 'platform.wysiwygEditor.code',
				visibility: true
			}, {
				id: 'blockquote',
				cssClass: 'wysiwyg-tb-blockquote',
				caption: 'Blockquote',
				caption$tr$: 'platform.wysiwygEditor.quote',
				visibility: true
			}, {
				id: 'link',
				cssClass: 'wysiwyg-tb-link',
				caption: 'Link',
				caption$tr$: 'platform.wysiwygEditor.link',
				visibility: true
			}, /* {
				id: 'unlink',
				cssClass: 'wysiwyg-tb-unlink',
				caption: 'Unlink',
				caption$tr$: 'platform.wysiwygEditor.unlink',
				visibility: true
			}, */ {
				id: 'image',
				cssClass: 'wysiwyg-tb-image',
				caption: 'Image',
				caption$tr$: 'platform.wysiwygEditor.insertImage',
				visibility: true
			}, {
				id: 'table',
				cssClass: 'wysiwyg-tb-table-btn',
				caption: 'Table',
				caption$tr$: 'platform.wysiwygEditor.insertTable',
				visibility: false
			},
			{
				id: 'documentView',
				caption: 'Document View',
				caption$tr$: 'platform.wysiwygEditor.documentView',
				visibility: true
			},
			{
				id: 'language',
				caption: 'Language',
				caption$tr$: 'platform.wysiwygEditor.selectLanguage',
				visibility: true
			},
			{
				id: 'variable',
				caption: 'Variable',
				caption$tr$: 'platform.wysiwygEditor.insertVariable',
				visibility: true
			},
		],
		alignments: [
			{
				value: '0',
				caption: 'Left Justify',
				caption$tr$: 'platform.wysiwygEditor.leftJustify',
				commandState: 'justifyleft'
			},
			{
				value: '1',
				caption: 'Right Justify',
				caption$tr$: 'platform.wysiwygEditor.rightJustify',
				commandState: 'justifyright'
			},
			{
				value: '2',
				caption: 'Center Justify',
				caption$tr$: 'platform.wysiwygEditor.centerJustify',
				commandState: 'justifycenter'
			}
		],
		borderStyle: [
			{
				id: 0,
				description: 'none'
			},
			{
				id: 1,
				description: 'hidden'
			},
			{
				id: 2,
				description: 'dotted'
			},
			{
				id: 3,
				description: 'dashed'
			},
			{
				id: 4,
				description: 'solid'
			},
			{
				id: 5,
				description: 'double'
			},
			{
				id: 6, description: 'ridge'
			}
		],
		horizontalAlignment: [
			{
				id: 'left',
				description: 'Left'
			},
			{
				id: 'right',
				description: 'Right'
			},
			{
				id: 'center',
				description: 'Middle'
			}
		],
		verticalAlignment:[
			{
				id: 'top',
				description: 'Top'
			},
			{
				id: 'middle',
				description: 'Middle'
			},
			{
				id: 'bottom',
				description: 'Bottom'
			}
		],
		units:[
			{
				value: '1',
				caption: 'mm',
				decimal: 1
			},
			{
				value: '2',
				caption: 'cm',
				decimal: 2
			},
			{
				value: '3',
				caption: 'in',
				decimal: 3
			}
		]
	});
})();












