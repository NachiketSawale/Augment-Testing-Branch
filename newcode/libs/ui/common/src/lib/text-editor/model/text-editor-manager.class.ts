/*
 * Copyright(c) RIB Software GmbH
 */

import { ElementRef, inject, Renderer2 } from '@angular/core';

import Quill from 'quill';
import type { Parchment as TypeParchment } from 'quill';
import type QuillIcon from 'quill/ui/icons';

import { TextEditorSettingsService } from '../services/text-editor-settings.service';
import { PlatformTranslateService } from '@libs/platform/common';

import { ITextEditorSettings } from './interfaces/text-editor-settings.interface';
import { IFonts } from './interfaces/fonts.interface';
import { IFontItems } from './interfaces/font-items.interface';
import { IAlign } from './interfaces/align.interface';
import { IUserSettings } from './interfaces/user-settings.interface';
import { IFormConfig } from '../../form';
import { ISettingsViewDialogOptions } from './interfaces/settings-view-dialog-options.interface';
import { IEditorDialogResult, IFormDialogConfig, UiCommonFormDialogService } from '../../dialogs';
import { ICreateButton } from './interfaces/create-button.interface';
import { units } from './unit.model';
import { IUnit } from './interfaces/unit.interface';
import { ICellDialogOptions } from '../extensions/table/model/text-editor-table.interface';
import { CellOptionFormConfig } from '../extensions/table/formats/table-cell-option';
import { Op } from 'quill/core';


export class TextEditorManager {

    /**
     * Used to inject editor settings service
     */
    private readonly textEditorSettingsService = inject(TextEditorSettingsService);

    /**
     * Used to inject translate service
     */
    private readonly translateService = inject(PlatformTranslateService);

    /**
     * Used to inject form dialog service
     */
    private readonly formDialogService = inject(UiCommonFormDialogService);


    /**
     * Used to inject renderer
     */
    private readonly renderer = inject(Renderer2);

    /**
     * Used to inject element ref
     */
    private readonly elementRef = inject(ElementRef);

    /**
     * custom settings
     */
    public customSettings!: ITextEditorSettings;

    /**
     * is color change
     */
    public colorChange: boolean = false;

    /**
     * font list
     */
    public fontWhiteList: string[] = [];

    /**
     * avaialble font sizes
     */
    public availableFontSizes: number[] = [];

    /**
     * unitCaption
     */
    public unitCaption!: string;

    /**
     * editorWidth
     */
    public editorWidth!: number;

    /**
     * Shown Ruler
     */
    public showRuler: boolean = true;

    /**
     * is document view 
     */
    public isDocumentView: boolean = false;

    /**
     * set initial ruler settings.
     */
    public setEditorRulerSettings() {
        const documentWidth = this.customSettings.user.useSettings ? this.customSettings.user.documentWidth : this.customSettings.system.documentWidth;

        this.editorWidth = this.isDocumentView ? Math.floor(documentWidth) : Math.floor((this.elementRef.nativeElement as HTMLElement).offsetWidth);

        this.showRuler = this.customSettings.user.useSettings ? this.customSettings.user.showRuler : this.customSettings.system.showRuler;

        const unit = this.customSettings.user.useSettings ? this.customSettings.user.unitOfMeasurement : this.customSettings.system.unitOfMeasurement;

        this.unitCaption = this.textEditorSettingsService.getUnitCaption(unit) ?? '';
    }

    /**
     * Used to checked button settings for visibility and show/hide based on
     * button visibility value.
     *
     * @param {string} id button id
     * @returns {boolean} return true/false to button show/hide
     */
    public getToolbarBtnVisibility(id: string): boolean {
        if (this.customSettings && this.customSettings.system.buttons) {
            const btn = this.customSettings.system.buttons.find((x) => x.id === id);
            if (btn) {
                return btn.visibility;
            }
        }
        return true;
    }

    /**
     * Used to get fonts data and add custom font options for
     * font dropdown in editor.
     *
     * @returns {string[]} font styles options for font dropdown
     */
    public getCustomFont(): string[] {
        const availableFonts = this.textEditorSettingsService.getCurrentFonts(this.customSettings.system);
        const fonts = Quill.import('attributors/class/font') as TypeParchment.Attributor;

        if (availableFonts) {
            this.generateFontData(availableFonts);
        }
        const fontNames = this.fontWhiteList.map((font) => this.getFontName(font));
        this.registerFontStyle();
        fonts.whitelist = fontNames;
        Quill.register(fonts, true);
        return fontNames;
    }


    /**
     * Function registers custom font style in editor so that it will be
     * applied in text editor.
     */
    public registerFontStyle() {
        const node = document.createElement('style');
        this.fontWhiteList.forEach((font) => {
            const fontName = this.getFontName(font);
            node.innerHTML += `.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="${fontName}"]::before,
			.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="${fontName}"]::before {
			content: '${font}';
			font-family: '${font}', sans-serif;
			}
			.ql-font-${fontName} {
			font-family: '${font}', sans-serif;
			}`;
        });

        document.head.appendChild(node);
    }

    /**
     * Used to format font name
     *
     * @param {string} font font name
     * @returns {string} formatted font name
     */
    public getFontName(font: string): string {
        return font.toLowerCase().replace(/\s/g, '-');
    }


    /**
     * Used to generate custom font data for font dropdown.
     *
     * @param {IFonts[]} availableFonts font data
     */
    public generateFontData(availableFonts: IFonts[]) {
        availableFonts.forEach((font) => {
            if (font.sources && font.sources.length > 0) {
                font.sources.forEach((source, index) => {
                    let fontName = this.getFontName(font.fontFamily);
                    if (font.sources && font.sources.length > 1) {
                        fontName += index;
                    }
                    this.fontWhiteList.push(fontName);
                    this.registerFontSource(font, source);
                });
            } else {
                this.fontWhiteList.push(font.displayName);
            }
        });
    }

    /**
     * Used to register fonts in editor provided as source.
     *
     * @param {IFonts} font font data
     * @param {IFontItems} source font as source
     */
    public registerFontSource(font: IFonts, source: IFontItems) {
        const styleElement = document.createElement('style');
        styleElement.innerHTML += `@font-face{
        font-family:'${font.fontFamily}';
        src:url('${source.url}');
        font-style:${source.fontStyle};
        font-weight:${source.fontWeight}
        }`;
        document.head.appendChild(styleElement);
    }

    /**
     * Used to get custom font size data and add in font size dropdown
     * option.
     *
     * @returns {string[]} returns custom font size options
     */
    public getCustomFontSize(): string[] {
        const size = Quill.import('attributors/style/size') as TypeParchment.Attributor;
        const fontSizeWhiteList: string[] = [];
        this.customSettings.system.fontSizes.forEach((fontSize) => {
            fontSizeWhiteList.push(fontSize.size + 'pt');
        });
        this.availableFontSizes = this.customSettings.system.fontSizes.map(a => a.size);
        this.registerFontSize(fontSizeWhiteList);
        size.whitelist = fontSizeWhiteList;
        Quill.register(size, true);
        return fontSizeWhiteList;
    }

    /**
     * Function register custom font size in text editor.
     *
     * @param {string[]} fontSizeWhiteList font size list
     */
    public registerFontSize(fontSizeWhiteList: string[]) {
        const node = document.createElement('style');
        fontSizeWhiteList.forEach((size) => {
            const sizeClassName = size.replace(/\./g, '').replace('pt', '');
            node.innerHTML += `
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="${size}"]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="${size}"]::before {
          content: '${size}';
        }
        .ql-size-${sizeClassName} {
          font-size: ${size};
        }
      `;
        });
        document.head.appendChild(node);
    }

    /**
     * Function adds custom align items in text editor.
     */
    public addCustomAlignItems() {
        const align = Quill.import('attributors/style/align') as TypeParchment.Attributor;
        const icons = Quill.import('ui/icons') as typeof QuillIcon;
        (icons.align as IAlign).left = icons.align[''];
        align.whitelist = ['left', 'center', 'right'];
        Quill.register(align, true);
    }

    /**
     * Used to create custom table options for table button dropdown.
     *
     * @returns {string[]} returns table options
     */
    public addCustomTableOptions(): string[] {
        const maxRows = 10;
        const maxCols = 5;
        const tableOptions: string[] = [];

        for (let r = 1; r <= maxRows; r++) {
            for (let c = 1; c <= maxCols; c++) {
                tableOptions.push('newtable_' + r + '_' + c);
            }
        }
        return tableOptions;
    }

    /**
     * Used to enable or disable text-editor
     * 
     * @param {boolean} isEditable is text editor editable 
     * @param {Quill} textEditor text editor instance
     */
    public processEditorEnable(isEditable: boolean, textEditor: Quill) {
        const qlPickerOptions = document.querySelectorAll('.ql-picker-options');

        qlPickerOptions.forEach(e => {
            if (isEditable) {
                e.classList.remove('disabled');
            } else {
                e.classList.add('disabled');
            }
        });
        if (isEditable) {
            textEditor.enable();
        } else {
            textEditor.disable();
        }
    }




    /**
     * Used to add custom input color picker dropdown for color-picker button.
     *
     * @param {Quill} editor text editor instance
     */
    public addCustomFontPicker(editor: Quill) {
        const fontColorPicker = this.renderer.createElement('input');
        this.renderer.setAttribute(fontColorPicker, 'id', 'color-picker-font');
        this.renderer.setAttribute(fontColorPicker, 'type', 'color');
        this.renderer.setAttribute(fontColorPicker, 'title', this.translateService.instant('platform.richTextEditor.color-picker-font').text);
        this.renderer.addClass(fontColorPicker, 'ql-picker-input');

        let fontColorPickerTimeout = setTimeout(() => {
            this.closeColorPopup(fontColorPicker);
        }, 2000);

        this.renderer.listen(fontColorPicker, 'input', () => {
            clearTimeout(fontColorPickerTimeout);
            this.colorChange = true;
            const range = editor.getSelection(true);
            if (range) {
                if (range.length > 0) {
                    editor.formatText(range.index, range.length, 'color', fontColorPicker.value, 'user');
                } else {
                    editor.format('color', fontColorPicker.value);
                }
            }
            fontColorPickerTimeout = setTimeout(() => {
                this.closeColorPopup(fontColorPicker);
            }, 2000);
        });

        const existingColorPicker = this.elementRef.nativeElement.querySelector('.ql-color-picker-font');
        if (existingColorPicker) {
            this.renderer.insertBefore(existingColorPicker.parentNode, fontColorPicker, existingColorPicker);
        }
    }

    /**
     * Used to add custom input highlight color picker for highlight color
     * dropdown.
     *
     * @param {Quill} editor text editor instance.
     */
    public addCustomHighlightFont(editor: Quill) {
        const highlightColorPicker = this.renderer.createElement('input');
        this.renderer.setAttribute(highlightColorPicker, 'id', 'color-picker-highlight');
        this.renderer.setAttribute(highlightColorPicker, 'type', 'color');
        this.renderer.setAttribute(highlightColorPicker, 'title', this.translateService.instant('platform.richTextEditor.color-picker-highlight').text);

        this.renderer.addClass(highlightColorPicker, 'ql-picker-input');

        let highlightColorPickerTimeout = setTimeout(() => {
            this.closeColorPopup(highlightColorPicker);
        }, 2000);

        this.renderer.listen(highlightColorPicker, 'input', () => {
            clearTimeout(highlightColorPickerTimeout);
            this.colorChange = true;
            const range = editor.getSelection(true);
            if (range) {
                if (range.length > 0) {
                    editor.formatText(range.index, range.length, 'background', highlightColorPicker.value, 'user');
                } else {
                    editor.format('background', highlightColorPicker.value);
                }
            }
            highlightColorPickerTimeout = setTimeout(() => {
                this.closeColorPopup(highlightColorPicker);
            }, 2000);
        });

        const existingHighlightColorPicker = this.elementRef.nativeElement.querySelector('.ql-color-picker-highlight');
        if (existingHighlightColorPicker) {
            this.renderer.insertBefore(existingHighlightColorPicker.parentNode, highlightColorPicker, existingHighlightColorPicker);
        }
    }


    /**
     * Used tp closed color picker popup.
     *
     * @param {HTMLInputElement} colorPicker color picker input element
     */
    public closeColorPopup(colorPicker: HTMLInputElement) {
        colorPicker.setAttribute('type', 'text');
        colorPicker.setAttribute('type', 'color');
    }

    /**
     * Used to get container height.
     *
     * @param {string} uuid text editor uuid
     * 
     * @returns {number} returns container height
     */
    public getContainerHeight(uuid: string): number {
        const contanierElement = this.elementRef.nativeElement.querySelector(`#${uuid}`);
        const toolbarElement = this.elementRef.nativeElement.querySelector('.ql-toolbar');

        if (contanierElement && toolbarElement) {
            const containerHeight = contanierElement.clientHeight;
            const toolbarHeight = toolbarElement.offsetHeight;
            return containerHeight - toolbarHeight;
        }
        return 0;
    }

    /**
     * Updates all ql picker dropdown's styles.
     *
     * @param {number} i
     */
    public setDropdownAttributes(i: number) {
        const qlPickerOptions = document.querySelectorAll('.ql-picker-options')[i] as HTMLElement;
        const newWidth = this.getMaxWidthContainer(qlPickerOptions);

        if (newWidth < 70) {
            qlPickerOptions.style.width = '100px';
            qlPickerOptions.style.left = '-74px';
        } else {
            qlPickerOptions.style.width = `${newWidth}px`;
        }
    }

    /**
     * Used to get container's max width.
     *
     * @param {HTMLElement} toolItem toolbar item
     * @returns returns container width.
     */
    public getMaxWidthContainer(toolItem: HTMLElement): number {
        const qlToolbar = document.querySelector('.ql-toolbar') as HTMLElement;
        return qlToolbar.offsetWidth - (toolItem.parentElement as HTMLElement).getBoundingClientRect().left;
    }


    /**
     * Used to update ruler width.
     * 
     * @param {boolean} isDocumentView is document view
     * @param {string} uuid text editor uuid
     * 
     */
    public updateRulerWidth(isDocumentView: boolean, uuid: string) {
        let documentWidth = this.customSettings.user.useSettings ? this.customSettings.user.documentWidth : this.customSettings.system.documentWidth;
        const documentPadding = this.customSettings.user.useSettings ? this.customSettings.user.documentPadding : this.customSettings.system.documentPadding;
        const unit = this.customSettings.user.useSettings ? this.customSettings.user.unitOfMeasurement : this.customSettings.system.unitOfMeasurement;

        if (!isDocumentView) {
            const element = this.elementRef.nativeElement.querySelector('#' + uuid) as HTMLElement;
            documentWidth = this.textEditorSettingsService.convertInRequiredUnit(unit, 'px', element.clientWidth - 10);

            const docView = this.elementRef.nativeElement.querySelector('.ql-container > .ql-editor');
            if (docView) {
                docView.style.width = '';
                docView.style.padding = '';
            }

            const ruler = this.elementRef.nativeElement.querySelector('.ruler-container > .ruler-div');
            if (ruler) {
                ruler.style.width = '';
                ruler.style.paddingLeft = '';
                ruler.style.paddingRight = '';
                ruler.style.left = '';
            }
        } else {
            let widthInMM = documentWidth;
            let paddingInMM = documentPadding;
            if (unit !== '1') {
                widthInMM = this.textEditorSettingsService.convertInRequiredUnit('1', unit, documentWidth);
                paddingInMM = this.textEditorSettingsService.convertInRequiredUnit('1', unit, documentPadding);
            }

            // Document View
            const docView = this.elementRef.nativeElement.querySelector('.ql-container.document-view > .ql-editor');
            if (docView) {
                docView.style.width = (widthInMM + 2 * paddingInMM) + 'mm';
                docView.style.padding = paddingInMM + 'mm';
            }
            // Ruler Document View
            if (this.showRuler) {
                const ruler = this.elementRef.nativeElement.querySelector('.ruler-container.document-view > .ruler-div');
                if (ruler) {
                    ruler.style.width = (widthInMM + 2 * paddingInMM) + 'mm';
                    ruler.style.paddingRight = ruler.style.paddingLeft = paddingInMM + 'mm';
                }

                if (ruler.getBoundingClientRect().left > docView.getBoundingClientRect().left) {
                    ruler.style.left = '-8px';
                } else {
                    ruler.style.left = '';
                }
            }
        }

        this.unitCaption = this.textEditorSettingsService.getUnitCaption(unit) ?? '';
        this.editorWidth = Math.floor(documentWidth);
    }

    /**
     * 
     * @param {IUserSettings} user user settings
     * @param {IFormConfig<ISettingsViewDialogOptions>} settings settings view
     * dialog form-config
     * 
     * @returns {Promise<IEditorDialogResult<ISettingsViewDialogOptions>> 
     * | undefined } returns dialog result
    */
    public showSettingsViewDialog(user: IUserSettings, settings: IFormConfig<ISettingsViewDialogOptions>): Promise<IEditorDialogResult<ISettingsViewDialogOptions>> | undefined {

        const formConfig: IFormDialogConfig<ISettingsViewDialogOptions> = {
            id: 'SettingsView',
            headerText: { key: 'platform.wysiwygEditor.settingsHeader' },
            formConfiguration: settings,
            entity: {
                useSettings: user.useSettings,
                documentWidth: user.documentWidth,
                unitOfMeasurement: user.unitOfMeasurement,
                showRuler: user.showRuler,
                documentPadding: user.documentPadding,
                oldUnit: user.unitOfMeasurement,
                autoNumberSettings: user.autoNumberSettings,
            },
        };
        return this.formDialogService.showDialog(formConfig);
        //TODO: save settings implementation is pending
        //having dependency on cloudDesktopUserSettingsService
    }


    /**
     * Executes when click on settings-view button to open 
     * settings view dialog.
     * 
     * @param {ICreateButton} settingsView settings view button
     * @param {Quill} editor quill editor instance
     */
    public setSettingsView(settingsView: ICreateButton, editor: Quill) {
        settingsView.editorButton?.addEventListener('click', () => {

            if (editor.container.querySelectorAll('.blot-formatter__overlay').length > 0) {
                const condition = true;
                const button = editor.container.querySelectorAll('.blot-formatter__overlay');

                if (condition) {
                    (button[0] as HTMLElement).style.display = 'none';
                } else {
                    (button[0] as HTMLElement).style.display = 'block';
                }
            }
            const user = this.customSettings.user;
            const unit = units.find(item => item.value === user.unitOfMeasurement);
            const settings = this.textEditorSettingsService.getSettingsViewDialogOptions();

            settings.groups?.forEach((group) => {
                if (group.groupId === 'docview') {
                    group.header = this.translateService.instant('platform.wysiwygEditor.settings.groupDocview').text + '(' + (unit as IUnit).caption + ')';
                }
            });
            const dataReadonly = !user.useSettings;
            this.textEditorSettingsService.setReadonlyFields(dataReadonly, settings);
            this.showSettingsViewDialog(user, settings);
        });
    }


    /**
     * Used to open dialog for modifying table cell settings.
     *
     * @param {ICellDialogOptions} data table cell dialog options
     * @returns {Promise<IEditorDialogResult<ICellDialogOptions>> | undefined}
     * returns dialog result which open dialog with options.
     */
    public showCellPropertiesDialog(data: ICellDialogOptions): Promise<IEditorDialogResult<ICellDialogOptions>> | undefined {
        const formConfig: IFormDialogConfig<ICellDialogOptions> = {
            id: 'CellEditor',
            headerText: 'Cell properties',
            formConfiguration: CellOptionFormConfig,
            entity: {
                cellWidth: data.cellWidth,
                borderWidth: data.borderWidth,
                borderColor: data.borderColor,
                horizontal: data.horizontal,
            },
        };
        return this.formDialogService.showDialog(formConfig);
    }


    /**
     * 
     * Used to set styles for text_node matcher in editor
     * 
     * @param {Op} op 
     * @param {HTMLElement | null} correspondingSpan html element
     */
    public setQuillStyles(op: Op, correspondingSpan: HTMLElement | null) {
        if (!op.attributes) {
            op.attributes = {};
        }
        const verticalAlign = (correspondingSpan as HTMLElement).style.verticalAlign;

        if (verticalAlign === 'super' || verticalAlign === 'sub') {
            op.attributes['script'] = verticalAlign;
        }

        let fontFamily = (correspondingSpan as HTMLElement).style.fontFamily;
        if (fontFamily.includes(',')) {
            fontFamily = fontFamily.split(',')[0];
            fontFamily = fontFamily.replace(/"/g, '');
        }

        if (fontFamily.includes('"')) {
            fontFamily = fontFamily.replace(/"/g, '');
        }

        if (fontFamily && this.fontWhiteList.includes(fontFamily)) {
            op.attributes['font'] = fontFamily;
        }

        let fontSize: string | number = (correspondingSpan as HTMLElement).style.fontSize;
        if (fontSize) {
            fontSize = fontSize.replace(/pt|px/gi, '');
            if (!this.availableFontSizes.includes(parseInt(fontSize))) {
                fontSize = this.availableFontSizes.sort((a, b) => Math.abs(parseFloat(fontSize as string) - parseFloat(a.toString())) - Math.abs(parseFloat(fontSize as string) - b))[0];
            }
            op.attributes['size'] = fontSize + 'pt';

        }
    }


    /**
     * Used to set font name in font dropdown on content change and
     * selection change in editor
     * 
     * @param {string} fontName font name
     */
    public setFontDropdown(fontName: string) {
        const fontSelector = this.elementRef.nativeElement.querySelector('.ql-font .ql-picker-label');
        if (fontSelector) {
            if (fontName) {
                fontName = fontName.replace('"', '');
                fontSelector.setAttribute('data-value', fontName);
            } else {
                fontSelector.setAttribute('data-value', this.customSettings.system.defaultFont);
            }
        }
    }


    /**
     * Used to set font size in font size dropdown on content change
     * and selection change
     * 
     * @param {number | string} fontSize font size 
     */
    public setFontSizeDropdown(fontSize: number | string) {
        const fontSizeSelector = this.elementRef.nativeElement.querySelector('.ql-size .ql-picker-label');
        if (fontSizeSelector) {
            if (fontSize) {
                fontSizeSelector.setAttribute('data-value', fontSize);
            } else {
                fontSizeSelector.setAttribute('data-value', this.customSettings.system.defaultFontSize + 'pt');
            }
        }
    }

    /**
     * Used to set default settings for text editor when initialized.
     * 
     * @param {boolean} textareaEditable is textarea editable
     * @param {Quill} textEditor text editor instance
     */
    public initializedDefaultSettings(textareaEditable: boolean, textEditor: Quill) {
        this.processEditorEnable(textareaEditable, textEditor);
        this.setFontDropdown(this.customSettings.system.defaultFont);
        this.setFontSizeDropdown(this.customSettings.system.defaultFontSize + 'pt');

    }
}