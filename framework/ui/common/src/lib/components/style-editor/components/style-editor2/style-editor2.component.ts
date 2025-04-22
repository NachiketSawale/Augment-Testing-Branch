/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnInit } from '@angular/core';
import { IFontSize, IStyleEditor2Component, IUiLangOption } from '../../model/interfaces/style-editor2.interface';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * used to show sample text style
 textarea-class    The class(es) to assign to the the editable div
 Requires:fontawesome
 * @ngdoc component
 * @name  StyleEditorComponent,itwo40-style-editor2
 * @element div
 * @restrict attribute, element
 * @usageExample attribute:<div itwo40-style-editor2 [textareaClass]="'textareaClass'" [textareaEditable]="'textareaEditable'"></div>, element:<itwo40-style-editor2 [textareaClass]="'textareaClass'" [textareaEditable]="'textareaEditable'"></itwo40-style-editor2>
 */

@Component({
	selector: 'ui-common-style-editor2,[itwo40-style-editor2]',
	templateUrl: './style-editor2.component.html',
	styleUrls: ['./style-editor2.component.scss']
})
export class UiCommonStyleEditor2Component implements OnInit, IStyleEditor2Component {
	/**
	 * To change the bold icon tooltip
	 */

	@Input()
	public boldTitle = '';

	/**
	 * To change the Italic icon tooltip
	 */
	@Input()
	public italicTitle = '';

	/**
	 * To change the Underline icon tooltip
	 */
	@Input()
	public underLineTitle = '';

	/**
	 * To change the Strikethrough icon tooltip
	 */
	@Input()
	public strikeThroughTitle = '';

	/**
	 * To change the Subscript icon tooltip
	 */
	@Input()
	public subscriptTitle = '';

	/**
	 * To change the Superscript icon tooltip
	 */
	@Input()
	public superScriptTitle = '';

	/**
	 * To change the Fonts dropdown tooltip
	 */
	@Input()
	public fontTitle = '';

	/**
	 * To change the Fontsize dropdown tooltip
	 */
	@Input()
	public fontSizeTitle = '';

	/**
	 * To change the Font color icon tooltip
	 */
	@Input()
	public fontColorTitle = '';

	/**
	 * To change the Highlight color icon tooltip
	 */
	@Input()
	public highlightColorTitle = '';

	/**
	 * To change the Eraser icon tooltip
	 */
	@Input()
	public removeSettingTitle = '';

	/**
	 * To change the OrderedList icon tooltip
	 */
	@Input()
	public orderedListTitle = '';

	/**
	 * To change the Unordered list icon tooltip
	 */
	@Input()
	public unorderedListTitle = '';

	/**
	 * To change the Outdent icon tooltip
	 */
	@Input()
	public outdentTitle = '';

	/**
	 * To change the Indent icon tooltip
	 */
	@Input()
	public indentTitle = '';

	/**
	 * To change the Left justify icon tooltip
	 */
	@Input()
	public leftJustifyTitle = '';

	/**
	 * To change the Right justify icon tooltip
	 */
	@Input()
	public rightJustifyTitle = '';

	/**
	 * To change the Center justify icon tooltip
	 */
	@Input()
	public centerJustifyTitle = '';

	/**
	 * To change the Code icon tooltip
	 */
	@Input()
	public codeTitle = '';

	/**
	 * To change the Quote icon tooltip
	 */
	@Input()
	public quoteTitle = '';

	/**
	 * To change the Paragraph icon tooltip
	 */
	@Input()
	public paragraphTitle = '';

	/**
	 * To change the Link icon tooltip
	 */
	@Input()
	public linkTitle = '';

	/**
	 * To change the Unlink icon tooltip
	 */
	@Input()
	public unlinkTitle = '';

	/**
	 * To change the Insert Image icon tooltip
	 */
	@Input()
	public insertImageTitle = '';

	/**
	 * To change the Bold icon css
	 */
	@Input()
	public boldIcon = 'fa fa-bold';

	/**
	 * To change the Italic icon css
	 */
	@Input()
	public italicIcon = 'fa fa-italic';

	/**
	 * To change the Underline icon css
	 */
	@Input()
	public underlineIcon = 'fa fa-underline';

	/**
	 * To change the Strikethrough icon css
	 */
	@Input()
	public strikeThroughIcon = 'fa fa-strikethrough';

	/**
	 * To change the Subscript icon css
	 */
	@Input()
	public subscriptIcon = 'fa fa-subscript';

	/**
	 * To change the Superscript icon css
	 */
	@Input()
	public superscriptIcon = 'fa fa-superscript';

	/**
	 * To change the Eraser icon css
	 */
	@Input()
	public removeSettingsIcon = 'fa fa-eraser';

	/**
	 * To change the Orderedlist icon css
	 */
	@Input()
	public orderedListIcon = 'fa fa-list-ol';

	/**
	 * To change the Unorderedlist icon css
	 */
	@Input()
	public unOrderedListIcon = 'fa fa-list-ul';

	/**
	 * To change the Outdent icon css
	 */
	@Input()
	public outdentIcon = 'fa fa-outdent';

	/**
	 * To change the Indent icon css
	 */
	@Input()
	public indentIcon = 'fa fa-indent';

	/**
	 * To change the Left justify icon css
	 */
	@Input()
	public leftJustifyIcon = 'fa fa-align-left';

	/**
	 * To change the Center justify icon css
	 */
	@Input()
	public centerJustifyIcon = 'fa fa-align-center';

	/**
	 * To change the Right justify icon css
	 */
	@Input()
	public rightJustifyIcon = 'fa fa-align-right';

	/**
	 * To change the Code icon css
	 */
	@Input()
	public codeIcon = 'fa fa-code';

	/**
	 * To change the Quote icon css
	 */
	@Input()
	public quoteIcon = 'fa fa-quote-right';

	/**
	 * To change the Link icon css
	 */
	@Input()
	public linkIcon = 'fa fa-link';

	/**
	 * To change the Unlink icon css
	 */
	@Input()
	public unlinkIcon = 'fa fa-unlink';

	/**
	 * To change the Insert image icon css
	 */
	@Input()
	public insertImageIcon = 'fa fa-picture-o';

	/**
	 * Variable to load existing languages from the localstorage
	 */
	public existingLanguage!: string;

	/**
	 * Variable to load existing culture from the localstorage i.e. en-gb etc.
	 */
	public existingCulture!: string;

	/**
	 * Variable to store selected language
	 */
	public uiLangOptions: IUiLangOption = {
		selectedId: {
			languageName: ''
		}
	};

	/**
	 * Font List
	 * @ignore
	 */
	@Input()
	public defaultFonts: string[] = [
		'Georgia',
		'Palatino Linotype',
		'Times New Roman',
		'Arial',
		'Helvetica',
		'Arial Black',
		'Comic Sans MS',
		'Impact',
		'Lucida Sans Unicode',
		'Tahoma',
		'Trebuchet MS',
		'Verdana',
		'Courier New',
		'Lucida Console',
		'Helvetica Neue'
	].sort();

	/**
	 * Font size list
	 * @ignore
	 */
	@Input()
	public fontSizes: IFontSize[] = [
		{
			value: '1',
			size: '10px'
		},
		{
			value: '2',
			size: '13px'
		},
		{
			value: '3',
			size: '16px'
		},
		{
			value: '4',
			size: '18px'
		},
		{
			value: '5',
			size: '24px'
		},
		{
			value: '6',
			size: '32px'
		},
		{
			value: '7',
			size: '48px'
		}
	];

	/**
	 * Variable to set editor into it
	 */
	public textarea!: HTMLElement | null;

	/**
	 * Variable to set link/unlink the selected text
	 */
	public isLink!: boolean;

	/**
	 * Variable to set class for the editor
	 */
	@Input()
	public textareaClass!: string;

	@Input()
	public value!: string;

	@Input()
	public textareaEditable: boolean = true;

	/**
	 * Default font color
	 */
	public fontColor: string = '#000000';

	/**
	 * Default highlight color
	 */
	public hiliteColor: string = '#000000';

	/**
	 * Variable to select font
	 */
	public font!: string | string[];

	public constructor(private translate: PlatformTranslateService) {
	}

	public ngOnInit(): void {
		this.textarea = document.getElementById('wysiwyg-textarea');
	}

	public isParagraph: boolean = false;
	public isBold: boolean = false;
	public isItalic: boolean = false;
	public isUnderlined: boolean = false;
	public isLeftJustified: boolean = false;
	public isCenterJustified: boolean = false;
	public isRightJustified: boolean = false;
	public isStrikethrough: boolean = false;
	public isSubscript: boolean = false;
	public isSuperscript: boolean = false;
	public isOrderedList: boolean = false;
	public isUnorderedList: boolean = false;
	public isBlockquote: boolean = false;
	public isPre: boolean = false;

	/**
	 * @ngdoc function
	 * @name format
	 * @methodOf StyleEditor2Component
	 * @description adds and removes formatting tag using execCommand
	 * @return void
	 */
	public format(cmd: string, ...args: string[]): void {
		const arg1 = args[0];
		document.execCommand(cmd, false, arg1);
		switch (cmd) {
			case 'bold':
				this.isBold = this.cmdState('bold');
				break;
			case 'italic':
				this.isItalic = this.cmdState('italic');
				break;
			case 'underline':
				this.isUnderlined = this.cmdState('underline');
				break;
			case 'strikethrough':
				this.isStrikethrough = this.cmdState('strikethrough');
				break;
			case 'subscript':
				this.isSubscript = !this.isSubscript;
				break;
			case 'superscript':
				this.isSuperscript = !this.isSuperscript;
				break;
			case 'insertorderedlist':
				this.isOrderedList = this.cmdState('insertorderedlist');
				break;
			case 'insertunorderedlist':
				this.isUnorderedList = this.cmdState('insertunorderedlist');
				break;
			case 'justifyleft':
				this.isLeftJustified = this.cmdState('justifyleft');
				break;
			case 'justifycenter':
				this.isCenterJustified = this.cmdState('justifycenter');
				break;
			case 'justifyright':
				this.isRightJustified = this.cmdState('justifyright');
				break;
			case 'insertParagraph':
				this.isParagraph = this.cmdState('insertParagraph');
				break;
			case 'formatblock':
				this.isPre = this.cmdValue('formatblock') === 'pre';
				this.isBlockquote = this.cmdValue('formatblock') === 'blockquote';
				break;
			case 'unlink':
				this.isLink = false;
				break;
			case 'removeFormat':
				this.cmdState('removeFormat');
				this.isBold = false;
				this.isItalic = false;
				this.isUnderlined = false;
				this.isStrikethrough = false;
				this.isSubscript = false;
				this.isSuperscript = false;
				this.isOrderedList = false;
				this.isUnorderedList = false;
				this.isLeftJustified = false;
				this.isRightJustified = false;
				this.isCenterJustified = false;
				this.isParagraph = false;
				this.isBlockquote = false;
				this.fontColor = '#000000';
				this.setFontColor();
		}
	}

	/**
	 * @ngdoc function
	 * @name cmdState
	 * @methodOf StyleEditor2Component
	 * @description checks whether execCommand is applied
	 * @return boolean
	 */

	public cmdState(cmd: string): boolean {
		const res = document.queryCommandState(cmd);
		return res;
	}

	/**
	 * @ngdoc function
	 * @name cmdValue
	 * @methodOf StyleEditor2Component
	 * @description returns currentValue for selection
	 * @return string
	 */
	public cmdValue(cmd: string): string {
		const res = document.queryCommandValue(cmd);
		return res;
	}

	/**
	 * @ngdoc function
	 * @name createLink
	 * @methodOf StyleEditor2Component
	 * @description creates hyperlink from the selection
	 * @return void
	 */
	private input: string | null | undefined;

	public createLink(input?: string | null): void {
		if (this.input && this.input !== undefined) {
			this.format('createlink', this.input);
			this.isLink = true;
		}
	}

	/**
	 * @ngdoc function
	 * @name createLink
	 * @methodOf StyleEditor2Component
	 * @description creates hyperlink from the selection
	 * splitted createLink function into getPrompt and creatLink for the jest testing
	 * @return void
	 */
	public getLink(): void {
		this.input = this.getPrompt();
		this.createLink(this.input);
	}

	/**
	 * @ngdoc function
	 * @name getPrompt
	 * @methodOf StyleEditor2Component
	 * @description returns the input prompt and accessed inside createLink function
	 * @returnn string|null
	 */
	private getPrompt(): string | null {
		return prompt('Enter the link URL');
	}

	/**
	 * @ngdoc function
	 * @name uploadFile
	 * @methodOf StyleEditor2Component
	 * @description inserts the img tag inside textarea with uploaded image
	 * @return void
	 */
	private ele: HTMLInputElement | undefined;

	public uploadFile(): void {
		this.ele = document.getElementById('editorImageUpload') as HTMLInputElement;
		if (this.ele === undefined) {
			console.log('fileupload control not found');
		} else {
			const file = this.ele.files?.item(0);
			if (file === undefined) {
				// handle error?
				console.log('no file specified for upload');
			} else {
				const reader = new FileReader();
				reader.onload = (res) => {
					const content = res.target?.result;
					this.format('insertHTML', '<img src="' + content + '" style="width: 50%" />');
				};
				reader.readAsDataURL(file as Blob);
			}
		}
	}

	/**
	 * @ngdoc function
	 * @name insertImage
	 * @methodOf StyleEditor2Component
	 * @description inserts the img on button click
	 * @return void
	 */
	public insertImage(): void {
		// in case the cursor is not in the editor place it there :)
		this.textarea!.focus();
		document.getElementById('editorImageUpload')!.click();
	}

	/**
	 * @ngdoc function
	 * @name setFont
	 * @methodOf StyleEditor2Component
	 * @description sets font on selection
	 * @return void
	 */
	public selectedFontValue = this.defaultFonts[0];

	public setFont(value: string): void {
		const elem = document.getElementById('wysiwyg-textarea');
		elem!.style.fontFamily = value;
		this.selectedFontValue = value;
	}

	/**
	 * @ngdoc function
	 * @name setFontSize
	 * @methodOf StyleEditor2Component
	 * @description sets fontSize on selection
	 * @return void
	 */
	public selectedFontSize = this.fontSizes[0].size;

	public setFontSize(value: string): void {
		const elem = document.getElementById('wysiwyg-textarea');
		elem!.style.fontSize = value;
		this.selectedFontSize = value;
	}

	/**
	 * @ngdoc function
	 * @name setFontColor
	 * @methodOf StyleEditor2Component
	 * @description sets fontColor on selection
	 * @return void
	 */
	public setFontColor(): void {
		const elem = document.getElementById('wysiwyg-textarea');
		elem!.style.color = this.fontColor;
	}

	/**
	 * @ngdoc function
	 * @name setHiliteColor
	 * @methodOf StyleEditor2Component
	 * @description applies hiliteColor on selection
	 * @return void
	 */
	public setHiliteColor(): void {
		// TODO: fix/reimplement, if required
		//const elem = document.getElementById('wysiwyg-textarea') as HTMLInputElement;
		//elem!.style.backgroundColor = this.hiliteColor;
	}
}
