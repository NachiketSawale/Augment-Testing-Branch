/*
 * Copyright(c) RIB Software GmbH
 */

import { ElementRef, inject } from '@angular/core';

import Quill from 'quill';

import { TextEditorManager } from './text-editor-manager.class';

import { TextEditorToolbaritemService } from '../services/text-editor-toolbaritem.service';
import { IDescriptionInfo, PlatformTranslateService } from '@libs/platform/common';

import { PlaceholderToolbarMap } from './interfaces/create-dropdown-item-option.interface';
import { IEditorOptions } from './interfaces/editor-options.interface';
import { ICreateButton, IDropdownItem } from './interfaces/create-button.interface';

/**
 * Used to initialized custom text editor options
 */
export class CustomTextEditorOptionsSettings {

    /**
     * custom dropdown button
     */
    public variableDropDown!: IDropdownItem;

    /**
     * Used to inject editor toolbar item service
     */
    private readonly editorToolbaritemsService = inject(TextEditorToolbaritemService);

    /**
    * Used to inject translate service
    */
    private readonly translateService = inject(PlatformTranslateService);

    /**
     * Used to inject element ref
     */
    private readonly elementRef = inject(ElementRef);


    /**
     * Used to add custom font-color picker button in text editor.
     * 
     * @param {Quill} editor text editor instance
     * @param {TextEditorManager} textEditorManager TextEditorManager class instance
     */
    public initializeCustomFontColor(editor: Quill, textEditorManager: TextEditorManager) {
        if (textEditorManager.getToolbarBtnVisibility('fontColor')) {
            const colorButton = this.editorToolbaritemsService.createButton({
                id: 'color-picker-font',
                icon: '<i class="fa fa-font"></i>',
            });

            this.editorToolbaritemsService.attach(editor, colorButton, 5);
        }
        textEditorManager.addCustomFontPicker(editor);
    }

    /**
     * Used to add custom highlight color picker button in editor.
     * 
     * @param {Quill} editor text editor instance 
     * @param {TextEditorManager} textEditorManager TextEditorManager class
     * instance 
     */
    public initializeCustomHighlightColor(editor: Quill, textEditorManager: TextEditorManager) {
        if (textEditorManager.getToolbarBtnVisibility('highlightColor')) {
            const highlightButton = this.editorToolbaritemsService.createButton({
                id: 'color-picker-highlight',
                icon: '<i class="fa fa-h-square"></i>',
            });

            this.editorToolbaritemsService.attach(editor, highlightButton, 6);
        }
        textEditorManager.addCustomHighlightFont(editor);
    }


    /**
     * Used to add custom variable button with variable options in editor.
     * 
     * @param {IEditorOptions} editorOptions  text editor options
     * @param {TextEditorManager} textEditorManager TextEditorManager class
     * instance  
     * @param {Quill} editor text editor instance  
     */
    public addCustomVariableOption(editorOptions: IEditorOptions, textEditorManager: TextEditorManager, editor: Quill) {
        if (editorOptions && editorOptions.variable && editorOptions.variable.visible && textEditorManager.getToolbarBtnVisibility('variable')) {
            const placeholderToolbar = {} as PlaceholderToolbarMap;
            editorOptions.variable.list.forEach((variable) => {
                placeholderToolbar[(variable.DescriptionInfo as IDescriptionInfo).Translated + variable.Code] = variable.Code;
            });
            this.variableDropDown = this.editorToolbaritemsService.createDropdownItem({
                id: 'variable',
                label: 'Variable',
                rememberSelection: false,
                items: placeholderToolbar,
            });
            this.editorToolbaritemsService.attach(editor, this.variableDropDown, 4);

            this.variableDropDown.onSelect = (lable, value) => {
                if (value) {
                    const cursorPosition = editor.getSelection()!.index;
                    editor.insertText(cursorPosition, value, 'user');
                    editor.setSelection(cursorPosition + value.length);
                }
            };
        }
    }

    /**
     * Used to reset variable dropdown data on language change
     * @param {IEditorOptions} editorOptions editor option 
     */
    public getUpdatedVariableList(editorOptions: IEditorOptions) {
        if (editorOptions && editorOptions.variable.visible) {
            const placeholderToolbar = {} as PlaceholderToolbarMap;
            editorOptions.variable.list.forEach((variable) => {
                placeholderToolbar[(variable.DescriptionInfo as IDescriptionInfo).Translated + variable.Code] = variable.Code;
            });
            this.editorToolbaritemsService.resetItems(placeholderToolbar, this.variableDropDown);
        }
    }

    /**
     * Function initiaized tooltip for each toolbar item in text editor.
     */
    public initializeTooltip() {
        const toolbarElement = document.querySelector('.ql-toolbar');
        if (toolbarElement) {
            const matchesButtons = toolbarElement.querySelectorAll('button');
            matchesButtons.forEach((buttonEl) => {
                this.generateTooltip('button', buttonEl);
            });

            const matchesSpans = toolbarElement.querySelectorAll('.ql-toolbar > span > span');
            matchesSpans.forEach((spanEl) => {
                this.generateTooltip('span', spanEl);
            });
        }
    }

    /**
     * Function generates tooltip for all items in text editor
     *
     * @param  {string} element button/span as string for which generate tooltip
     * @param {HTMLButtonElement | Element} buttonEl button/span element
     */
    public generateTooltip(element: string, buttonEl: HTMLButtonElement | Element) {
        let tool!: string;
        if (element === 'button') {
            tool = buttonEl.className.replace('ql-', '');
        } else if (element === 'span') {
            tool = buttonEl.className.replace('ql-', '');
            tool = tool.substring(0, tool.indexOf(' '));
        }
        if (tool) {
            if ((buttonEl as HTMLButtonElement).value === '') {
                buttonEl.setAttribute('title', this.translateService.instant('platform.richTextEditor.' + tool).text);
            } else if (typeof (buttonEl as HTMLButtonElement).value !== 'undefined' && (buttonEl as HTMLButtonElement).value !== 'undefined') {
                buttonEl.setAttribute('title', this.translateService.instant('platform.richTextEditor.' + tool + '.' + (buttonEl as HTMLButtonElement).value).text);
            } else {
                if (tool === 'table') {
                    buttonEl.setAttribute('title', this.translateService.instant('platform.richTextEditor.insertTable').text);
                } else {
                    buttonEl.setAttribute('title', this.translateService.instant('platform.richTextEditor.' + tool).text);
                }
            }
        }
    }

    /**
     * Used to add custom document view item in text editor.
     *
     * @param {Quill} editor text editor instance
     * @param {TextEditorManager} textEditorManager TextEditorManager class
     * instance
     * @param {string} uuid text editor uuid
     * 
     */
    public addCustomDocumentView(editor: Quill, textEditorManager: TextEditorManager, uuid: string) {
        if (textEditorManager.getToolbarBtnVisibility('documentView')) {
            const documentView = this.editorToolbaritemsService.createButton({
                id: 'document-view',
                icon: '<img src="cloud.style/content/images/tlb-icons.svg#ico-document-view">',
                toggle: true,
            });

            this.editorToolbaritemsService.attach(editor, documentView);
            this.setDocumentView(documentView, editor, textEditorManager, uuid);
        }
    }

    /**
     * Executes when click on document-view button to set or remove
     * document-view in editor.
     * 
     * @param {ICreateButton} documentView document view button options
     * @param {Quill} editor text editor instance
     * @param {TextEditorManager} textEditorManager textEditorManager class
     * instance
     * @param {string} uuid text editor uuid
     */
    public setDocumentView(documentView: ICreateButton, editor: Quill, textEditorManager: TextEditorManager, uuid: string) {
        documentView.editorButton?.addEventListener('click', (eve) => {
            if (editor.container) {
                const rulerContainer = this.elementRef.nativeElement.querySelector('.ruler-container');

                if (editor.container.classList.contains('document-view')) {
                    editor.container.classList.remove('document-view');
                    ((documentView.toolbarEl as HTMLElement).nextElementSibling as Element).classList.remove('document-view');
                    rulerContainer.classList.remove('document-view');
                    textEditorManager.updateRulerWidth(false, uuid);
                } else {
                    editor.container.classList.add('document-view');
                    ((documentView.toolbarEl as HTMLElement).nextElementSibling as Element).classList.add('document-view');
                    rulerContainer.classList.add('document-view');
                    textEditorManager.updateRulerWidth(true, uuid);
                }
            }
        });
    }


    /**
     * Used to  add custom settings view button in text editor.
     *
     * @param {Quill} editor text editor instance
     * @param {TextEditorManager} textEditorManager TextEditorManager class
     * instance
     * 
     */
    public addCustomSettingsView(editor: Quill, textEditorManager: TextEditorManager) {

        if (textEditorManager.getToolbarBtnVisibility('settingsView')) {
            const settingsView = this.editorToolbaritemsService.createButton({
                id: 'settings-view',
                icon: '<img src="cloud.style/content/images/tlb-icons.svg#ico-settings">',
            });

            this.editorToolbaritemsService.attach(editor, settingsView);
            textEditorManager.setSettingsView(settingsView, editor);
        }
    }

    /**
     * 
     * Used to set selected language when initialized text editor.
     * 
     * @param {IEditorOptions} editorOptions editor options
     */
    public setLanguage(editorOptions: IEditorOptions) {
        const langSelector = this.elementRef.nativeElement.querySelector('.ql-language .ql-picker-label');
        if (langSelector && editorOptions) {
            const id = editorOptions.language.current.Id;
            const selectedLanguage = editorOptions.language.list.find(lang => lang.Id === id);
            if (selectedLanguage) {
                langSelector.setAttribute('data-value', (selectedLanguage.DescriptionInfo as IDescriptionInfo).Description);
            }
        }
    }


    /**
     * used to initialized custom editor options
     * @param {Quill} editor text editor instance
     * @param {TextEditorManager} textEditorManager  TextEditorManager class 
     * instance
     * @param {IEditorOptions} editorOptions text editor options.
     * @param {string} uuid text editor uuid
     * 
     */
    public initializeCustomEditorOption(editor: Quill, textEditorManager: TextEditorManager, editorOptions: IEditorOptions, uuid: string) {

        this.initializeCustomFontColor(editor, textEditorManager);
        this.initializeCustomHighlightColor(editor, textEditorManager);
        this.addCustomVariableOption(editorOptions, textEditorManager, editor);
        this.initializeTooltip();
        this.addCustomDocumentView(editor, textEditorManager, uuid);
        this.addCustomSettingsView(editor, textEditorManager);
        this.setLanguage(editorOptions);
    }
}