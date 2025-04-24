/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, inject, Input, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

import Quill from 'quill';

import { TextEditorSettingsService } from '../../services/text-editor-settings.service';
import { IDescriptionInfo, PlatformTranslateService } from '@libs/platform/common';

import { ITextEditorSettings } from '../../model/interfaces/text-editor-settings.interface';
import { IEditorOptions } from '../../model/interfaces/editor-options.interface';
import { ICellDialogOptions } from '../../extensions/table/model/text-editor-table.interface';

import { TextEditorRulerComponent } from '../text-editor-ruler/text-editor-ruler.component';

import TextEditorTableModule from '../../extensions/table/modules/text-editor-table';

import { TextEditorManager } from '../../model/text-editor-manager.class';
import { CustomTextEditorOptionsSettings } from '../../model/custom-text-editor-options-settings.class';
import BlotFormatter from '../../extensions/blot-formatter';
import { createCustomBlock } from '../../extensions/custom-block/custom-block.class';
import { Delta, Range } from 'quill/core';
import type { EmitterSource, Parchment as TypeParchment } from 'quill';
import ShiftEnterBlot from '../../extensions/line-break/shift-enter-blot.class';

import { CustomAttributes } from '../../extensions/custom-attribute/custom-attributes.class';
import { customColorAttributor, customFontFamilyAttributor, customList, customSizeAttributor } from '../../extensions/list-item/list-item.class';
import { scripts } from '../../extensions/script-item/script-item.class';
import { CustomBreak } from '../../extensions/custom-break/custom-break.class';

Quill.register('modules/table', TextEditorTableModule);
Quill.register('modules/blotFormatter', BlotFormatter);
Quill.register(CustomAttributes, true);
Quill.register(ShiftEnterBlot);
Quill.register(customColorAttributor, true);
Quill.register(customFontFamilyAttributor, true);
Quill.register(customSizeAttributor, true);
Quill.register(customList, true);
Quill.register(scripts, true);
Quill.register(CustomBreak, true);

@Component({
	selector: 'ui-common-text-editor',
	templateUrl: './text-editor.component.html',
	styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent implements OnInit, AfterViewInit, OnDestroy {
	/**
	 * is text area editable
	 */
	@Input() public textareaEditable: boolean = true;

	/**
	 * input html string
	 */
	@Input() public editorContent!: string;

	/**
	 * editor uuid
	 */
	public uuid = 'textEditor' + Math.random().toString().substring(2, 10);

	/**
	 * custom settings
	 */
	public customSettings!: ITextEditorSettings;

	public _backspace: boolean = false;
	/**
	 * language list
	 */
	public languageList: string[] = [];

	/**
	 * editor options
	 */
	@Input() public editorOptions!: IEditorOptions;

	/**
	 * Used to declared resize observer
	 */
	private resizeObserver!: ResizeObserver;

	/**
	 * used to stored html element
	 */
	public parentNode!: HTMLElement | null;

	/**
	 * Used to inject editor settings service
	 */
	private readonly textEditorSettingsService = inject(TextEditorSettingsService);

	/**
	 * Used to inject translate service
	 */
	private readonly translateService = inject(PlatformTranslateService);

	/**
	 * Used to inject element ref
	 */
	private readonly elementRef = inject(ElementRef);

	/**
	 * text-editor manager class instance.
	 */
	public textEditorManager = new TextEditorManager();

	/**
	 * custom editor settings class instance
	 */
	public customEditorSettings = new CustomTextEditorOptionsSettings();

	/**
	 * is show toolbar
	 */
	public showToolbar: boolean = true;

	/**
	 * to enable keyboard shortcut for editor.
	 */
	public enableShortcut: boolean = true;

	/**
	 * Element Refernce of Div
	 */
	@ViewChild('ruler') public ruler!: ElementRef<TextEditorRulerComponent>;

	/**
	 * Used to inject renderer
	 */
	private readonly renderer = inject(Renderer2);

	/**
	 * Used to set text editor instance
	 */
	public textEditor!: Quill;

	public ngOnInit(): void {
		this.onSetConfig();
	}

	public ngAfterViewInit(): void {
		this.applyCustomStylesToEditor();
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes['editorOptions']) {
			this.customEditorSettings.getUpdatedVariableList(this.editorOptions);
		}
	}

	/**
	 * Function executes on text-change event when content
	 * change in editor.
	 * Used to get updated text and set font and font-size in dropdown
	 * on content changed.
	 *
	 * @param {EmitterSource} source source
	 */
	public onContentChanged(source: EmitterSource) {
		console.log(this.textEditor.root.innerHTML);
		const text = this.textEditor.getText();
		if (source === 'api') {
			if (text === '\n' || text === '\n\n') {
				this.textEditorManager.setFontDropdown(this.customSettings.system.defaultFont);
				this.textEditorManager.setFontSizeDropdown(this.customSettings.system.defaultFontSize + 'pt');
			}
		}

		this.textEditorManager.updateRulerWidth(this.textEditor.container.classList.contains('document-view'), this.uuid);
	}

	/**
	 * Used to get editor settings for text editor.
	 */
	public onSetConfig() {
		this.textEditorSettingsService.getBothSettings().subscribe((data: ITextEditorSettings) => {
			this.customSettings = data;
			createCustomBlock(this.uuid, this._backspace, this.customSettings);
			this.textEditorManager.customSettings = data;

			this.setTextEditorConfig();
		});
	}

	/**
	 * Used to prepared configuration data for editor options and set config to
	 * text editor.
	 */
	public setTextEditorConfig() {
		this.textEditorManager.addCustomAlignItems();
		this.languageList = this.addCustomLanguageItem();
		this.textEditorManager.setEditorRulerSettings();

		const toolbarConfig = [
			this.textEditorManager.getToolbarBtnVisibility('bold') ? ['bold'] : '',
			this.textEditorManager.getToolbarBtnVisibility('italic') ? ['italic'] : '',
			this.textEditorManager.getToolbarBtnVisibility('underline') ? ['underline'] : '',
			this.textEditorManager.getToolbarBtnVisibility('header') ? [{ header: [1, 2, 3, false] }] : '',
			this.textEditorManager.getToolbarBtnVisibility('font') ? [{ font: this.textEditorManager.getCustomFont() }] : '',

			this.textEditorManager.getToolbarBtnVisibility('fontSize') ? [{ size: this.textEditorManager.getCustomFontSize() }] : '',

			this.languageList.length !== 0 && this.textEditorManager.getToolbarBtnVisibility('language') ? [{ language: this.languageList }] : '',

			this.textEditorManager.getToolbarBtnVisibility('strikethrough') ? ['strike'] : '',
			this.textEditorManager.getToolbarBtnVisibility('subscript') ? [{ script: 'sub' }] : '',
			this.textEditorManager.getToolbarBtnVisibility('superscript') ? [{ script: 'super' }] : '',
			this.textEditorManager.getToolbarBtnVisibility('removeformatting') ? ['clean'] : '',
			this.textEditorManager.getToolbarBtnVisibility('unorderedlist') ? [{ list: 'bullet' }] : '',
			this.textEditorManager.getToolbarBtnVisibility('orderedlist') ? [{ list: 'ordered' }] : '',

			this.textEditorManager.getToolbarBtnVisibility('outdent') ? [{ indent: '-1' }] : '',
			this.textEditorManager.getToolbarBtnVisibility('indent') ? [{ indent: '+1' }] : '',
			this.textEditorManager.getToolbarBtnVisibility('leftjustify') ? [{ align: 'left' }] : '',
			this.textEditorManager.getToolbarBtnVisibility('centerjustify') ? [{ align: 'center' }] : '',
			this.textEditorManager.getToolbarBtnVisibility('rightjustify') ? [{ align: 'right' }] : '',
			this.textEditorManager.getToolbarBtnVisibility('code') ? ['code-block'] : '',
			this.textEditorManager.getToolbarBtnVisibility('blockquote') ? ['blockquote'] : '',
			this.textEditorManager.getToolbarBtnVisibility('link') ? ['link'] : '',
			this.textEditorManager.getToolbarBtnVisibility('image') ? ['image'] : '',

			this.textEditorManager.getToolbarBtnVisibility('table') ? [{ table: this.textEditorManager.addCustomTableOptions() }] : '',
		];

		const toolbarConfigData = toolbarConfig.filter((x) => x !== '');

		const bindings = this.getKeyboardBindings();

		this.textEditor = new Quill('#' + this.uuid, {
			theme: 'snow',
			modules: {
				clipboard: {
					matchers: [['BR', this.lineBreakMatcher]],
				},
				keyboard: {
					bindings: bindings,
				},
				history: {
					delay: 2000,
					maxStack: 500,
					userOnly: true,
				},
				toolbar: {
					container: toolbarConfigData,
					handlers: {
						language: (value: string) => {
							if (value) {
								const selectedLanguage = this.editorOptions.language.list.find((lang) => (lang.DescriptionInfo as IDescriptionInfo).Description === value);
								if (selectedLanguage && this.editorOptions.language.onChanged) {
									this.editorOptions.language.onChanged(selectedLanguage.Id);
								}
							}
						},
					},
				},
				table: {
					addRowAbove: this.translateService.instant('platform.richTextEditor.table.addRowAbove').text,
					addRowBelow: this.translateService.instant('platform.richTextEditor.table.addRowBelow').text,
					addColumnBefore: this.translateService.instant('platform.richTextEditor.table.addColumnBefore').text,
					addColumnAfter: this.translateService.instant('platform.richTextEditor.table.addColumnAfter').text,
					deleteRow: this.translateService.instant('platform.richTextEditor.table.deleteRow').text,
					deleteColumn: this.translateService.instant('platform.richTextEditor.table.deleteColumn').text,
					deleteTable: this.translateService.instant('platform.richTextEditor.table.deleteTable').text,
					showVBorder: this.translateService.instant('platform.richTextEditor.table.showVerticalBorder').text,
					showHBorder: this.translateService.instant('platform.richTextEditor.table.showHorizontalBorder').text,
					showAllBorders: this.translateService.instant('platform.richTextEditor.table.showAllBorders').text,
					noBorder: this.translateService.instant('platform.richTextEditor.table.noBorder').text,
					tableEditor: this.translateService.instant('platform.richTextEditor.table.tableEditor').text,
					cellEditor: this.translateService.instant('platform.richTextEditor.table.cellEditor').text,
					addTableOptions: this.translateService.instant('platform.richTextEditor.table.addTableOptions').text,
					deleteTableOptions: this.translateService.instant('platform.richTextEditor.table.deleteTableOptions').text,
					tableBorderSetting: this.translateService.instant('platform.richTextEditor.table.tableBorderSetting').text,
					customSettings: this.customSettings,
					showCellPropertiesDialog: (data: ICellDialogOptions) => {
						return this.textEditorManager.showCellPropertiesDialog(data);
					},
					elementRef: this.elementRef,
					renderer: this.renderer,
				},
				blotFormatter: {
					customSettings: this.customSettings,
					textEditorSettingsService: this.textEditorSettingsService,
				},
			},
		});

		this.onEditorCreated();
		if (this.editorContent) {
			this.textEditor.root.innerHTML = this.editorContent;
		}
		this.textEditor.on('text-change', this.onContentChanged.bind(this));
		this.textEditor.on('selection-change', this.onSelectionChanged.bind(this));
		this.initShowRuler();
	}

	/**
	 * Used to add custom keyboard event for text editor.
	 * @returns returns text editor keyboard bindings
	 */
	public getKeyboardBindings() {
		const bindings = {
			moduleRefresh: {
				key: 'r',
				shortKey: true,
				handler: () => {
					// Handle ctrl+r
					console.log('press ctrl+r');
					//TODO: dependency on navbar service
					// platformNavBarService.getActionByKey('refresh').fn();
				},
			},
			moduleSave: {
				key: 's',
				shortKey: true,
				handler: () => {
					// Handle ctrl+s
					console.log('press ctrl+s');
					//TODO: dependency on navbar service
					// platformNavBarService.getActionByKey('save').fn();
				},
			},

			linebreak: {
				key: 'Enter',
				shiftKey: true,
				handler: this.handleLineBreak.bind(this),
			},
		};
		return bindings;
	}

	/**
	 * Used to set data in editor toolbar items on selecting text.
	 * @param {Range} range range
	 */
	public onSelectionChanged(range: Range) {
		if (!this.textEditorManager.colorChange) {
			if (range) {
				const format = this.textEditor.getFormat(range.index);
				const fontFormat = format['font'] ? (format['font'] as string) : (format['custom-family-attributor'] as string);
				this.textEditorManager.setFontDropdown(fontFormat);

				const sizeFormat = format['size'] ? (format['size'] as number) : (format['custom-size-attributor'] as number);
				this.textEditorManager.setFontSizeDropdown(sizeFormat);

				const fontPickerElement = this.elementRef.nativeElement.querySelector('#color-picker-font');

				if (fontPickerElement) {
					if (format['color']) {
						fontPickerElement.value = format['color'];
					} else {
						fontPickerElement.value = '#000000';
					}
				}

				const highlightElement = this.elementRef.nativeElement.querySelector('#color-picker-highlight');

				if (highlightElement) {
					if (format['background']) {
						highlightElement.value = format['background'];
					} else {
						highlightElement.value = '#FFFFFF';
					}
				}
			}
		} else {
			this.textEditorManager.colorChange = false;
		}
	}

	/**
	 * Used to handle line break on press shift+enter in editor.
	 *
	 * @param {Range} range range
	 */
	public handleLineBreak(range: Range) {
		this.textEditor.updateContents(new Delta().retain(range.index).delete(range.length).insert({ ShiftEnter: true }), 'user');

		if (!(this.textEditor.getLeaf(range.index + 1)[0] as TypeParchment.LeafBlot).next) {
			this.textEditor.updateContents(
				new Delta()
					.retain(range.index + 1)
					.delete(0)
					.insert({ ShiftEnter: true }),
				'user',
			);
		}

		this.textEditor.setSelection(range.index + 1, Quill.sources.SILENT);
		return false;
	}

	/**
	 *
	 * Used to add line break matcher in texteditor for
	 * custom clipboard functionality
	 *
	 * @param {Node} node html element
	 * @param {Delta} delta
	 * @returns {Delta} delta
	 */
	public lineBreakMatcher(node: Node, delta: Delta): Delta {
		if ((node as HTMLBRElement).className === 'break') {
			const newDelta = new Delta();
			newDelta.insert({ break: '' });
			return newDelta;
		}
		return delta;
	}

	/**
	 * Used to customize editor toolbar items once editor
	 * initialized and set default editor settings.
	 */
	public onEditorCreated() {
		this.overwriteShortCuts(this.textEditor);
		this.textEditor.clipboard.addMatcher(Node.TEXT_NODE, (node, delta) => {
			return this.formatMatcher(node, delta);
		});
		this.textEditorManager.initializedDefaultSettings(this.textareaEditable, this.textEditor);
		this.customEditorSettings.initializeCustomEditorOption(this.textEditor, this.textEditorManager, this.editorOptions, this.uuid);
	}

	/**
	 * Used to add custom language button with dropdown options in text editor.
	 *
	 * @returns {string[]} returns dropdown options for language button
	 */
	public addCustomLanguageItem(): string[] {
		const languageToolbar: string[] = [];
		if (this.editorOptions && this.editorOptions.language && this.editorOptions.language.visible) {
			const languageList = this.editorOptions.language.list;
			languageList.forEach((lang) => {
				languageToolbar.push((lang.DescriptionInfo as IDescriptionInfo).Description);
			});
		}
		return languageToolbar;
	}

	/**
	 * Function updates height for editor container and all
	 * picker options container.
	 */
	public applyCustomStylesToEditor() {
		const node = this.elementRef.nativeElement.querySelector('#' + this.uuid);

		this.parentNode = node ? (node.parentNode as HTMLElement) : null;

		if (this.parentNode) {
			if (!this.parentNode.style.height) {
				this.parentNode.style.height = '100%';
			}
			this.resizeObserver = new ResizeObserver((entries) => {
				const updatedHeight = this.textEditorManager.getContainerHeight(this.uuid);

				const qlPickers = (this.parentNode as HTMLElement).querySelectorAll('.ql-picker-options');

				qlPickers.forEach((qlPicker, i) => {
					const qlPickerElement = qlPicker as HTMLElement;
					if (qlPickerElement.children.length * 22 > updatedHeight) {
						qlPickerElement.style.height = `${updatedHeight}px`;
						this.textEditorManager.setDropdownAttributes(i);
					} else {
						qlPickerElement.style.height = '';
					}
				});

				this.textEditorManager.updateRulerWidth(this.textEditor.container.classList.contains('document-view'), this.uuid);
			});

			this.resizeObserver.observe(node);
		}
	}

	/**
	 * Init the show ruler
	 */
	public initShowRuler() {
		const toolbar = this.elementRef.nativeElement.querySelector('div.ql-toolbar') as Element;
		const ruler = this.elementRef.nativeElement.querySelector('ui-common-text-editor-ruler') as Element;
		if (toolbar) {
			toolbar.insertAdjacentElement('afterend', ruler);
		}
	}


	/**
 * 
 * Used to add custom matcher to set editor styles
 * 
 * @param {Node} node html element
 * @param {Delta} delta delta
 * @returns {Delta} delta
 */
	public formatMatcher(node: Node, delta: Delta): Delta {
		const op = delta && delta.ops && delta.ops[0];
		if (op && op.insert === (node.parentElement as HTMLElement).innerText) {
			this.textEditorManager.setQuillStyles(op, node.parentElement);
		}
		return delta;
	}


	/**
	 * allows the user to enable/disable shortcuts in the editor
	 * @param {Quill} editor text editor 
	 */
	public overwriteShortCuts(editor: Quill) {
		// B (ctrl+b)
		if (editor.keyboard.bindings['b']) {
			editor.keyboard.bindings['b'].unshift({
				key: 'b',
				ctrlKey: true,
				handler: () => {
					return this.showToolbar && this.enableShortcut;
				}
			});
		}
		// I (ctrl+i)
		if (editor.keyboard.bindings['i']) {
			editor.keyboard.bindings['i'].unshift({
				key: 'i',
				ctrlKey: true,
				handler: () => {
					return this.showToolbar && this.enableShortcut;
				}
			});
		}
		// R (ctrl+r)
		if (editor.keyboard.bindings['r']) {
			editor.keyboard.bindings['r'].unshift({
				key: 'r',
				ctrlKey: true,
				handler: () => {
					return this.showToolbar && this.enableShortcut;
				}
			});
		}
		// S (ctrl+s)
		if (editor.keyboard.bindings['s']) {
			editor.keyboard.bindings['s'].unshift({
				key: 's',
				ctrlKey: true,
				handler: () => {
					return this.showToolbar && this.enableShortcut;
				}
			});
		}
		// U (ctrl+u)
		if (editor.keyboard.bindings['u']) {
			editor.keyboard.bindings['u'].unshift({
				key: 'u',
				ctrlKey: true,
				handler: () => {
					return this.showToolbar && this.enableShortcut;
				}
			});
		}
		// Y (ctrl+y)
		if (editor.keyboard.bindings['y']) {
			editor.keyboard.bindings['y'].unshift({
				key: 'y',
				ctrlKey: true,
				handler: () => {
					return this.showToolbar && this.enableShortcut;
				}
			});
		}
		// Z (ctrl+z)
		if (editor.keyboard.bindings['z']) {
			editor.keyboard.bindings['z'].unshift({
				key: 'z',
				ctrlKey: true,
				handler: () => {
					return this.showToolbar && this.enableShortcut;
				}
			});
		}
	}


	public ngOnDestroy() {
		this.resizeObserver.unobserve(this.parentNode as HTMLElement);
	}
}
