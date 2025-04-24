/*
 * Copyright(c) RIB Software GmbH
 */

import { RulerUnitCaption } from '../../../../model/ruler-unit.enum';
import { units } from '../../../../model/unit.model';
import { TextEditorSettingsService } from '../../../../services/text-editor-settings.service';
import BlotFormatter from '../../BlotFormatter';

/**
 * Image Resizer Form
 */
export default class ImageResizerForm {
	/**
	 * BlotFormatter
	 */
	public formatter: BlotFormatter;

	/**
	 * HTMLElement
	 */
	public element!: HTMLElement;

	/**
	 * resizeForm Element
	 */
	public resizeForm = `<div class="image-resizer inputGroup">
    <span class="image-resizer imageIconSpan"><img src="assets/images/control-icons.svg#ico-width">
    </span>
    <input id="idWidth"  type='number'  autocomplete="off" class="image-resizer inputField" />

    <span class="image-resizer imageIconSpan"><img src="assets/images/control-icons.svg#ico-height">
    </span>
    <input id="idHeight" type='number'  autocomplete="off" class="image-resizer inputField" 
	/>
    <span id="unit" class="image-resizer measurementField"></span>
	</div>`;

	/**
	 * text Editor Settings Service
	 */
	public textEditorSettingsService!: TextEditorSettingsService;

	/**
	 * old Image Height
	 */
	private _oldImgHeight!: number;

	/**
	 * old Image Width
	 */
	private _oldImgWidth!: number;

	/**
	 * get image Width
	 */
	public get imgWidth() {
		return (document.getElementById('idWidth') as HTMLInputElement).value ?? '0';
	}

	/**
	 * set image Width
	 */
	public set imgWidth(value: string) {
		(document.getElementById('idWidth') as HTMLInputElement).value = value;
	}

	/**
	 * get image Height
	 */
	public get imgHeight() {
		return (document.getElementById('idHeight') as HTMLInputElement).value ?? '0';
	}

	/**
	 * set image Height
	 */
	public set imgHeight(value: string) {
		(document.getElementById('idHeight') as HTMLInputElement).value = value;
	}

	/**
	 * unit
	 */
	private unit!: string;

	public constructor(formatter: BlotFormatter) {
		this.formatter = formatter;

		this.textEditorSettingsService = this.formatter.textEditorSettingsService as TextEditorSettingsService;
	}

	/**
	 * Create the image resize form
	 */
	public create(): void {
		if (this.formatter.options.customSettings?.user.useSettings) {
			this.unit = this.formatter.options.customSettings?.user.unitOfMeasurement;
		} else {
			this.unit = this.formatter.options.customSettings?.system.unitOfMeasurement as string;
		}
		const image = this.formatter.currentSpec?.getTargetElement() as HTMLElement;
		const imgWidth = this.textEditorSettingsService.convertInRequiredUnit(this.unit, 'px', image.clientWidth).toFixed(2);
		const imgHeight = this.textEditorSettingsService.convertInRequiredUnit(this.unit, 'px', image.clientHeight).toFixed(2);

		this.element = this.createResizeFrom();

		this.formatter.overlay.append(this.element);
		this.imgHeight = imgHeight;
		this.imgWidth = imgWidth;
		this._oldImgHeight = parseFloat(this.imgHeight);
		this._oldImgWidth = parseFloat(this.imgWidth);

		const heightInputBox = document.querySelector('#idHeight') as HTMLInputElement;
		const widthInputBox = document.querySelector('#idWidth') as HTMLInputElement;
		const unitSpam = document.querySelector('#unit') as HTMLSpanElement;

		widthInputBox.addEventListener('keydown', (ev) => {
			this.handleKeyDown(ev);
		});
		heightInputBox.addEventListener('keydown', (ev) => {
			this.handleKeyDown(ev);
		});
		const unitvalue = units.find((item) => item.value === this.unit);
		unitSpam.innerHTML = unitvalue?.caption as string;
	}

	/**
	 * update the resize value
	 */
	public updateResizeValue() {
		const heightInputBox = document.querySelector('#idHeight') as HTMLInputElement;
		const widthInputBox = document.querySelector('#idWidth') as HTMLInputElement;
		const image = this.formatter.currentSpec?.getTargetElement() as HTMLElement;
		const imgWidth = this.textEditorSettingsService.convertInRequiredUnit(this.unit, 'px', image.clientWidth).toFixed(2);
		const imgHeight = this.textEditorSettingsService.convertInRequiredUnit(this.unit, 'px', image.clientHeight).toFixed(2);
		heightInputBox.value = imgHeight;
		widthInputBox.value = imgWidth;
	}
	public destroy(): void {
		if (this.element) {
			this.formatter.overlay.removeChild(this.element);
		}

		this.element.innerHTML = '';
	}
	public createResizeFrom(): HTMLElement {
		const e = document.createElement('div');
		e.innerHTML = this.resizeForm;

		return e;
	}

	/**
	 * calculat the width of image and set on the image tag
	 */
	public widthChange() {
		const originalWidth = this.textEditorSettingsService?.convertInRequiredUnit(RulerUnitCaption.px, this.unit, this._oldImgWidth);
		const newImgWidth = this.textEditorSettingsService.convertInRequiredUnit(RulerUnitCaption.px, this.unit, this.imgWidth as unknown as number);
		const scalingFactor = newImgWidth / originalWidth;
		this.imgHeight = (this._oldImgHeight * scalingFactor) as unknown as string;

		if (this.formatter.currentSpec) {
			const image = this.formatter.currentSpec.getTargetElement() as HTMLElement;
			image.setAttribute('width', newImgWidth + 'px');
			image.setAttribute('height', 'auto');

			this._oldImgWidth = this.imgWidth as unknown as number;
			this._oldImgHeight = this.imgHeight as unknown as number;
			this.formatter.quill.updateContents([], 'user');
			this.formatter.repositionOverlay();
		}
	}

	/**
	 * calculat the height of image and set on the image tag
	 */
	public heightChange() {
		const originalHeight = this.textEditorSettingsService.convertInRequiredUnit(RulerUnitCaption.px, this.unit, this._oldImgHeight);
		const newImgHeight = this.textEditorSettingsService.convertInRequiredUnit(RulerUnitCaption.px, this.unit, this.imgHeight as unknown as number);
		const scalingFactor = newImgHeight / originalHeight;
		this.imgWidth = (this._oldImgWidth * scalingFactor) as unknown as string;
		const imageWidth = this.textEditorSettingsService.convertInRequiredUnit(RulerUnitCaption.px, this.unit, this.imgWidth as unknown as number);
		const image = this.formatter.currentSpec?.getTargetElement() as HTMLElement;
		image.setAttribute('width', imageWidth + 'px');
		image.setAttribute('height', 'auto');

		this._oldImgWidth = this.imgWidth as unknown as number;
		this._oldImgHeight = this.imgHeight as unknown as number;
		this.formatter.quill.updateContents([], 'user');
		this.formatter.repositionOverlay();
	}

	/**
	 * handle Key Down Event
	 * @param event KeyboardEvent
	 */
	public handleKeyDown(event: KeyboardEvent) {
		const widthInput = document.getElementById('idWidth');
		const heightInput = document.getElementById('idHeight');
		const target = event.target as HTMLInputElement;
		if (event.key === 'Tab') {
			event.preventDefault();
			const isWidthInputFocused = document.activeElement === widthInput;

			if (isWidthInputFocused) {
				heightInput?.focus();
				this.widthChange();
			} else {
				widthInput?.focus();
				this.heightChange();
			}
			this.moveCursorToEnd(document.activeElement as HTMLInputElement);
			this.formatter.quill.updateContents([], 'user');
			this.formatter.repositionOverlay();
		} else if (event.key === 'Enter') {
			if (target.id === 'idWidth') {
				this.widthChange();
			} else if (target.id === 'idHeight') {
				this.heightChange();
			}
			this.formatter.quill.updateContents([], 'user');
			this.formatter.repositionOverlay();
		}
	}

	/**
	 * move Cursor To End
	 * @param inputElement HTMLInputElement
	 */
	public moveCursorToEnd(inputElement: HTMLInputElement) {
		const valueLength = inputElement.value.length;

		inputElement.setSelectionRange(valueLength, valueLength);
	}
}
