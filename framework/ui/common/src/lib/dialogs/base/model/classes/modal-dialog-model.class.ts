/*
 * Copyright(c) RIB Software GmbH
 */

import { MatDialogRef } from '@angular/material/dialog';

import { cloneDeep } from 'lodash';

import { ModalDialogWindowComponent } from '../../components/modal-dialog-window/modal-dialog-window.component';

import {
	IClosingDialogButtonEventInfo,
	ICustomDialog,
	ICustomDialogOptions,
	IDialog,
	IDialogButtonBase,
	IDialogButtonEventInfo,
	IDialogDetails,
	IDialogEventInfo,
	IEditorDialogResult,
	StandardDialogButtonId
} from '../..';
import { IDialogAlarmConfig } from '../interfaces/dialog-alarm-config.interface';

import { DefaultButtons } from '../data/dialog-default-buttons';
import { DialogDetailsModel } from './dialog-details-model.class';
import { StaticProvider, Type } from '@angular/core';
import { IDialogBodyDescriptionBase } from '../interfaces/dialog-body-description-base.interface';
import { Translatable } from '@libs/platform/common';
import { IDialogFooterModel } from '../interfaces/dialog-footer-model.interface';
import { IDialogHeaderModel } from '../interfaces/dialog-header-model.interface';


/**
 * This class holds the common information for dialog and provides the basic functionality to header
 * footer and body.
 */
export class ModalDialogModel<TValue, TBody, TDetailsBody> implements IDialogHeaderModel, IDialogFooterModel<TValue, TBody, TDetailsBody> {
	/**
	 * Dialog reference.
	 */
	private dialogRef!: MatDialogRef<ModalDialogWindowComponent<TValue, TBody, TDetailsBody>>;

	/**
	 * Overlay message.
	 */
	public alarm: IDialogAlarmConfig | string | undefined = '';

	/**
	 * Standard buttons.
	 */
	public buttons: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>[] = [];

	/**
	 * Custom buttons.
	 */
	public customButtons: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>[] = [];

	/**
	 * returns the dialog reference.
	 */
	public get dialogReference(): MatDialogRef<ModalDialogWindowComponent<TValue, TBody, TDetailsBody>> {
		return this.dialogRef;
	}

	/**
	 * sets the dialog reference value.
	 */
	public set dialogReference(dialogRef: MatDialogRef<ModalDialogWindowComponent<TValue, TBody, TDetailsBody>>) {
		this.dialogRef = dialogRef;
	}

	/**
	 * returns the dialog options.
	 */
	public get modalOptions(): ICustomDialogOptions<TValue, TBody, TDetailsBody> {
		return this.tempModalOptions;
	}

	/**
	 * sets the dialog options value.
	 */
	public set modalOptions(options: ICustomDialogOptions<TValue, TBody, TDetailsBody>) {
		this.tempModalOptions = options;
	}

	/**
	 * Label for Dont show again checkbox.
	 */
	public readonly dontShowAgain = {
		// TODO: make translatable
		label: 'Dont show this message again'
	};

	public constructor(private tempModalOptions: ICustomDialogOptions<TValue, TBody, TDetailsBody>) {
		this._headerText = cloneDeep(tempModalOptions.headerText);

		this.details = new DialogDetailsModel<TDetailsBody>(this.tempModalOptions.details);

		this.value = this.tempModalOptions.value;

		this.dialogWrapper = (function createDialogWrapper(owner: ModalDialogModel<TValue, TBody, TDetailsBody>): ICustomDialog<TValue, TBody, TDetailsBody> {
			return {
				get body(): TBody {
					if (!owner.dialogBody) {
						throw new Error('Dialog body has not been initialized.');
					}

					return owner.dialogBody;
				},
				get details(): IDialogDetails<TDetailsBody> | undefined {
					return owner.details.detailsWrapper;
				},
				get value(): TValue | undefined {
					return owner.value;
				},
				set value(v: TValue | undefined) {
					owner.value = v;
				},
				get headerText(): Translatable | undefined {
					return owner._headerText;
				},
				set headerText(v: Translatable | undefined) {
					owner._headerText = v;
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					const result: IEditorDialogResult<TValue> = {
						// TODO: fall back to dialog default button (if any) before switching to "cancel"
						closingButtonId: closingButtonId ?? StandardDialogButtonId.Cancel,
						value: owner.value
					};
					owner.dialogRef.close(result);
				}
			};
		})(this);
	}

	public get isReady(): boolean {
		return Boolean(this.dialogBody);
	}

	public value?: TValue;

	public dialogBody?: TBody;

	public readonly dialogWrapper: ICustomDialog<TValue, TBody, TDetailsBody>;

	/**
	 * This function initializes the class.
	 *
	 * @param {IDialogOptions} modalOptions Dialog data.
	 */
	public createDialog(modalOptions: ICustomDialogOptions<TValue, TBody, TDetailsBody>) {
		this.tempModalOptions = modalOptions;
		this.buttons = this.getDialogButtons();
		this.customButtons = this.getCustomDialogButtons();
	}

	/**
	 * This function returns the disable status for dialog footer buttons.
	 *
	 * @param {IDialogButtonBase} button Button.
	 * @returns  {boolean | undefined} Is disabled.
	 */
	public isDisabled(button: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>): boolean | undefined {
		if (!button) {
			return undefined;
		}

		if (typeof button.isDisabled === 'function') {
			if (!this.isReady) {
				return true;
			}

			const info = this.getButtonInfo(button);
			return button.isDisabled(info);
		}

		return Boolean(button.isDisabled);
	}

	/**
	 * This function returns the caption for dialog footer buttons.
	 *
	 * @param {IDialogButtonBase} button Button.
	 * @returns Caption text.
	 */
	public getCaption(button: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>): Translatable | undefined {
		if (!button) {
			return undefined;
		}

		if (typeof button.caption === 'function') {
			if (!this.isReady) {
				return '';
			}

			const info = this.getButtonInfo(button);
			return button.caption(info);
		}

		return button.caption;
	}

	/**
	 * This function returns the tooltip text for dialog footer buttons.
	 *
	 * @param {IDialogButtonBase} button Button.
	 * @returns  {string | undefined} Tooltip text.
	 */
	public getTooltip(button: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>): string | undefined {
		if (!button) {
			return undefined;
		}

		if (typeof button.tooltip === 'function') {
			if (!this.isReady) {
				return undefined;
			}

			const info = this.getButtonInfo(button);
			return button.tooltip(info);
		}

		return button.tooltip;
	}

	/**
	 * This function returns the visibility status for dialog footer buttons.
	 *
	 * @param {IDialogButtonBase} button Button.
	 * @returns {boolean | undefined} Is visible.
	 */
	public isShown(button: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>): boolean | undefined {
		if (!button) {
			return undefined;
		}

		if (typeof button.isVisible === 'function') {
			if (!this.isReady) {
				return true;
			}

			const info = this.getButtonInfo(button);
			return button.isVisible(info);
		}

		if (typeof button.isVisible === 'boolean') {
			return button.isVisible;
		}

		return true;
	}

	/**
	 * This function returns the button object from array of buttons based on id received as argument.
	 *
	 * @param {string} id Unique button id.
	 * @returns {IDialogButtonBase| undefined} Button.
	 */
	public getButtonById(id: string | undefined): IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody> | undefined {
		let button = this.buttons.find((btn: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>) => {
			return btn.id === id;
		});

		if (!button) {
			button = this.customButtons.find((btn: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>) => {
				return btn.id === id;
			});
		}
		return button;
	}

	/**
	 * This function handles the click event for footer buttons.
	 *
	 * @param {IDialogButtonBase} button Button.
	 * @param {MouseEvent} event Mouse event.
	 */
	public async click(button: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>, event: MouseEvent) {
		const info: IClosingDialogButtonEventInfo<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody> = {
			dialog: this.dialogWrapper,
			cancel: false,
			button: button
		};

		// TODO: commit form and grid

		if (button.fn) {
			await Promise.resolve(button.fn(event, info));
		}

		// TODO: check whether dialog has already been closed in button.fn
		if (!button.fn || (button.autoClose && !info.cancel)) {
			const result = this.getResultValue(info, button.id);
			this.dialogRef.close(result);
		}
	}

	/**
	 * This function returns the standard buttons for the dialog footer which are aligned right.
	 *
	 * @returns Standard footer buttons.
	 */
	private getDialogButtons(): IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>[] {
		const result = [];

		const getButtonById = (array: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>[], id: string) => {
			const button = array.find((btn) => {
				return btn.id === id;
			});
			return button;
		};

		// insert user defined buttons.
		this.tempModalOptions.buttons?.forEach((btn) => {
			if (!getButtonById(DefaultButtons, btn.id)) {
				result.push(btn);
			}
		});

		const defButtons: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>[] = [];
		DefaultButtons.forEach((defBtn) => {
			defButtons.push({ ...defBtn });
		});

		defButtons.forEach((defBtn) => {
			const userButton = this.tempModalOptions.buttons ?
				getButtonById(this.tempModalOptions.buttons, defBtn.id) :
				null;

			if (userButton) {
				// extend defaultButton with some properties from userButton.

				//Properties that are not getter/setter
				const descriptors = {
					...Object.getOwnPropertyDescriptors(userButton),
					...Object.getOwnPropertyDescriptors(defBtn) 
				};
				
				//Object with all properties (regular fields & getter/setter).
				const tarButton = Object.create(
					//Properties that are only getters/setters
					Object.getPrototypeOf(userButton), 
					descriptors
				);
				
				result.push(tarButton);
			}
		});

		// if no Button is configured visible, then make ok button visible.
		if (!result.length) {
			const defaultBtn = DefaultButtons.find((btn) => {
				return btn.id === StandardDialogButtonId.Ok;
			});
			if (!defaultBtn) {
				throw new Error('Default ok button not found.');
			}

			const btn: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody> = {
				...defaultBtn
			};
			result.push(btn);
		}
		// set default button (button will be clicked when enter is pressed).
		if (!this.tempModalOptions.defaultButtonId) {
			this.tempModalOptions.defaultButtonId = StandardDialogButtonId.Ok;
		}

		return result;
	}

	/**
	 * This function returns the value of property from modal options.
	 *
	 * @param {string} buttonName Button caption.
	 * @param {string} propertyName Button propery name.
	 * @returns {boolean | ((arg: IDialogEventInfo) => boolean)}
	 */
	// TODO: still required after revised calls?
	/*
	private getButtonPropertyValue(buttonName: string, propertyName: string): boolean | ((arg: IDialogEventInfo) => boolean) {
		const btnName = buttonName.charAt(0).toUpperCase() + buttonName.slice(1).toLowerCase();
		const key = propertyName + btnName + 'Button';
		const value = this.tempModalOptions[key as keyof IDialogOptions] as boolean | ((arg: IDialogEventInfo) => boolean);
		return value;
	}*/

	private getButtonPropertyValue<TDialog extends IDialog<TDetailsBody>, TDetailsBody = void>(
		buttonName: string,
		propertyName: string
	): boolean | ((arg: IDialogEventInfo<TDialog, TDetailsBody>) => boolean) | undefined {
		const key = `${propertyName}${buttonName.charAt(0).toUpperCase()}${buttonName.slice(1).toLowerCase()}Button` as keyof ICustomDialogOptions<TValue, TBody, TDetailsBody>;
		return this.tempModalOptions[key] as boolean | ((arg: IDialogEventInfo<TDialog, TDetailsBody>) => boolean) | undefined;
	}

	/**
	 * This function returns the custom buttons for the dialog footer which are aligned left.
	 *
	 * @returns {IDialogButtonBase[]} Custom dialog buttons.
	 */
	private getCustomDialogButtons(): IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>[] {
		const buttons: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>[] = [];
		this.tempModalOptions.customButtons?.forEach(btn => {
			buttons.push(btn);
		});

		return buttons;
	}

	/**
	 * This function returns the button information along with dialog standard information.
	 *
	 * @param btn Button.
	 * @returns Button information.
	 */
	private getButtonInfo(btn: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>): IDialogButtonEventInfo<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody> {
		const info: IDialogButtonEventInfo<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody> = {
			dialog: this.dialogWrapper,
			button: btn
		};

		// covered in dialog wrapper object?
		/*info.close = (result) => {
			this.dialogRef.close(result);
		};*/
		return info;
	}


	/**
	 * Returns result object when dialog is closed.
	 *
	 * @param info Button information.
	 * @param buttonId Unique button id.
	 * @returns Result Object.
	 */
	private getResultValue(info: IDialogEventInfo<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>, buttonId: string): IEditorDialogResult<TValue> {
		return {
			// TODO: define (or find?) dialog default button ID constants
			closingButtonId: buttonId ?? StandardDialogButtonId.Cancel,
			value: this.value
		};
	}

	/**
	 * Sets the alarm message. which disappear after a short time automatically.
	 *
	 * @param {string} msgKey Overlay message.
	 */
	public setAlarm(msgKey: string) {
		this.alarm = msgKey;
	}

	/**
	 * Click event for the default button, when 'enter' key is pressed.
	 *
	 * @param {Event} event.
	 */
	public onReturnButtonPress(event: Event) {
		event.preventDefault();
		const button = this.getButtonById(this.tempModalOptions.defaultButtonId);

		if (button && this.isShown(button) && !this.isDisabled(button)) {
			this.click(button, event as MouseEvent);
		}
	}

	/**
	 * Closes dialog on header close icon click event.
	 *
	 * @param {MouseEvent} event
	 */
	public cancel(event: MouseEvent): void {
		this.click({ id: StandardDialogButtonId.Cancel }, event);
	}

	private _headerText?: Translatable;

	public get headerText(): Translatable | undefined {
		return this._headerText;
	}

	public get body(): Type<TBody> {
		return this.modalOptions.bodyComponent;
	}

	/**
	 * Custom injection providers supplied for the body component of the dialog.
	 */
	public get bodyProviders(): StaticProvider[] | undefined {
		return this.modalOptions.bodyProviders;
	}

	public get topDescription(): IDialogBodyDescriptionBase | Translatable | undefined {
		return this.modalOptions.topDescription;
	}

	public get bottomDescription(): IDialogBodyDescriptionBase | Translatable | undefined {
		return this.modalOptions.bottomDescription;
	}

	/**
	 * An object that represents the content and logic of the details area.
	 */
	public readonly details: DialogDetailsModel<TDetailsBody>;
}