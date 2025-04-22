/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, StaticProvider, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { cloneDeep } from 'lodash';

import { Observable } from 'rxjs/internal/Observable';

import { ModalDialogWindowComponent } from '../components/modal-dialog-window/modal-dialog-window.component';

import { DialogDefaultModalOptions } from '../model/data/dialog-default-modal-options';

import { DialogConsts } from '../model/enums/dialog-constants.enum';
import { DialogKeycodes } from '../model/enums/dialog-keycodes.enum';

import { IDialogData } from '../model/interfaces/dialog-data-interface';

import {
	ConcreteDialogDetailOptions,
	ICustomDialog,
	ICustomDialogOptions,
	IDialog,
	IDialogButtonBase,
	IDialogButtonEventInfo,
	IDialogOptions,
	IDialogResult,
	IEditorDialogResult,
	StandardDialogButtonId
} from '..';
import { ModalDialogModel } from '../model/classes/modal-dialog-model.class';
import { DialogButtonAdapter } from '../model/classes/dialog-button-adapter.class';
import { lastValueFrom } from 'rxjs';

/**
 * This service can display modal dialog boxes.
 *
 * The dialogs displayed by this service are custom dialogs. A custom dialog is
 * a modal dialog that can display an arbitrary component as its content. This
 * custom content is surrounded by the standard elements of a dialog box, such
 * as a header bar and a footer with buttons.
 *
 * In order to display a custom dialog, prepare a {@link ICustomDialogOptions}
 * object and pass it to the {@link show} method. Once the dialog box has been
 * closed, the promise returned by {@link show} will be resolved and provide
 * some information about the outcome of the dialog.
 *
 * If you wish to display one of the standard dialogs rather than supplying a
 * custom component for the dialog body, consider using one of the pre-defined
 * dialogs instead:
 *
 * - {@link UiCommonMessageBoxService | message boxes, error dialogs, yes/no dialogs}
 * - {@link UiCommonInputDialogService | input dialogs}
 * - {@link UiCommonFormDialogService | form dialogs}
 *
 * @group Dialog Framework
 */
@Injectable({
	providedIn: 'root'
})
export class UiCommonDialogService {
	private defaultModalOptions = DialogDefaultModalOptions;

	private readonly matDialog = inject(MatDialog);

	/**
	 * Displays a custom dialog box.
	 *
	 * @typeParam TValue The value type to edit in the dialog. If the dialog is
	 *   there only to display some data, use `void`.
	 * @typeParam TBody The component type that constitutes the body of the dialog
	 *   box.
	 * @typeParam TDetailsBody The component type to display in the details area
	 *   of the dialog box if a details area is available *and* if its type is set
	 *   to {@link DialogDetailsType.Custom}.
	 * @param customModalOptions An object that contains configuration options for
	 *   the dialog box.
	 * @returns Result of the dialog.
	 */
	public show<TValue, TBody, TDetailsBody = void>(customModalOptions: ICustomDialogOptions<TValue, TBody, TDetailsBody>): Promise<IEditorDialogResult<TValue>> | undefined {
		if (!customModalOptions) {
			throw new Error('Dialog was not configured correctly. Modal options are undefined.');
		}

		const saveSettings = () => {
			//TODO: This function saves the dialog settings when dialog is closed.
			//TODO: Currently setting saved using local storage in future will be done using API.
			if (customModalOptions.id) {
				if (typeof dialog.modalOptions.dontShowAgain === 'object' && dialog.modalOptions.dontShowAgain.showOption && dialog.modalOptions.dontShowAgain.activated) {
					localStorage.setItem(customModalOptions.id, 'false');
				}
			}
		};

		const tempModalOptions = this.cleanUpOptions(customModalOptions);

		tempModalOptions.id = customModalOptions.id;

		if (tempModalOptions.details) {
			if (!tempModalOptions.customButtons) {
				tempModalOptions.customButtons = [];
			}

			tempModalOptions.customButtons.unshift(this.createShowDetailsButton({ id: DialogConsts.showDetailsId }));
		}

		if (typeof tempModalOptions.dontShowAgain === 'object' && tempModalOptions.dontShowAgain.showOption && !tempModalOptions.id) {
			throw new Error('If dontShowAgain.showOption is enabled, a custom id has to be provided.');
		}
		// TODO: check how to integrate details
		/*let*/
		const dialog = new ModalDialogModel<TValue, TBody, TDetailsBody>(tempModalOptions);
		/*if ('details' in customModalOptions) {
			dialog = new UiCommonModalDialogDetails();
			const details = <IModalBasicDetails>customModalOptions.details;
			(<UiCommonModalDialogDetails<TValue>>dialog).details = details;
		}*/

		dialog.createDialog(tempModalOptions);

		let showDialog = true;

		if (typeof tempModalOptions.dontShowAgain === 'object' && tempModalOptions.dontShowAgain.showOption && tempModalOptions.id) {
			const value = localStorage.getItem(tempModalOptions.id);
			if (value) {
				showDialog = JSON.parse(value);
			}
		}

		const data: IDialogData<TValue, TBody, TDetailsBody> = {
			dialog: dialog
		};
		// TODO: restore?
		/*if (dataItem) {
			Object.assign(data, { dataItem: dataItem });
		}*/

		if (showDialog) {
			const dialogRef = this.matDialog.open(ModalDialogWindowComponent<TValue, TBody, TDetailsBody>, {
				backdropClass: 'backdropClass',
				panelClass: tempModalOptions.windowClass,
				disableClose: true,
				data: data,
				width: tempModalOptions.width,
				height: tempModalOptions.height ? tempModalOptions.height : '',
				maxHeight: tempModalOptions.maxHeight,
				minHeight: tempModalOptions.minHeight ? tempModalOptions.minHeight : '',
				position: {
					top: '30px',
					left: tempModalOptions.left ? tempModalOptions.left : ''
				}
			});
			dialogRef.id = tempModalOptions.id ? tempModalOptions.id : '';
			dialog.dialogReference = dialogRef;

			dialogRef.afterClosed().subscribe((result: IEditorDialogResult<TValue>) => {
				if (result) {
					// TODO: replace with default button ID constant
					if (result.closingButtonId == StandardDialogButtonId.Ok || result) {
						saveSettings();
					} else {
						if ([
							StandardDialogButtonId.Ok,
							StandardDialogButtonId.Yes,
							StandardDialogButtonId.Retry
						].some((value) => Object.keys(result).includes(value))) {
							saveSettings();
						}
					}
				}
			});

			dialogRef.afterOpened().subscribe(() => {
				const existCondition = setInterval(function () {
					const modalDialogList = document.getElementsByClassName('cdk-overlay-pane');
					if (modalDialogList.length) {
						clearInterval(existCondition);
						if (tempModalOptions.id) {
							modalDialogList[modalDialogList.length - 1].classList.add(tempModalOptions.id);
							if (tempModalOptions.left) {
								(<HTMLElement>modalDialogList[modalDialogList.length - 1]).style.margin = '0px';
							}
						}
					}
				}, 100);
			});

			if (tempModalOptions.keyboard) {
				dialogRef.keydownEvents().subscribe((e) => {
					if (e.keyCode === DialogKeycodes.escKeycode) {
						dialogRef.close({
							closingButtonId: StandardDialogButtonId.Cancel
						});
					}
				});
			}

			return lastValueFrom(dialogRef.afterClosed());
		} else {
			const observable$ = new Observable<IDialogResult>((observer) => {
				if (typeof tempModalOptions.dontShowAgain === 'object') {
					const key = tempModalOptions.dontShowAgain.defaultActionButtonId;
					observer.next({ closingButtonId: key });
				}
			});
			return lastValueFrom(observable$);
		}
	}

	/**
	 * Function modifies the default dialog options data.
	 *
	 * @param {IDialogOptions} customModalOptions Default options.
	 * @returns {IDialogOptions} Modified dialog Options.
	 */
	private cleanUpOptions<TValue, TBody, TDetailsBody>(customModalOptions: ICustomDialogOptions<TValue, TBody, TDetailsBody>): ICustomDialogOptions<TValue, TBody, TDetailsBody> {
		let tempModalOptions: ICustomDialogOptions<TValue, TBody, TDetailsBody> = Object.assign({}, cloneDeep(this.defaultModalOptions), customModalOptions);
		tempModalOptions = this.cleanSizeValues(tempModalOptions);
		if (typeof customModalOptions.dontShowAgain === 'boolean') {
			tempModalOptions.dontShowAgain = Object.assign({}, this.defaultModalOptions.dontShowAgain, { showOption: customModalOptions.dontShowAgain });
		}
		return tempModalOptions;
	}

	/**
	 * Function sets dimensions for modal dialog.
	 *
	 * @param {IDialogOptions} tempModalOptions Default Dialog options.
	 * @returns { IDialogOptions } Modified dialog Options with dimensions.
	 */
	private cleanSizeValues<TValue, TBody, TDetailsBody>(tempModalOptions: ICustomDialogOptions<TValue, TBody, TDetailsBody>): ICustomDialogOptions<TValue, TBody, TDetailsBody> {
		const maxSize = '90%';
		const minWidth = '600px';
		const minHeight = '400px';

		if (tempModalOptions.width === 'max') {
			tempModalOptions.width = maxSize;
		}
		if (tempModalOptions.maxWidth === 'max') {
			tempModalOptions.maxWidth = maxSize;
		}
		if (tempModalOptions.height === 'max') {
			tempModalOptions.height = maxSize;
		}
		if (tempModalOptions.maxHeight === 'max') {
			tempModalOptions.maxHeight = maxSize;
		}
		if (tempModalOptions.minWidth === 'min') {
			tempModalOptions.minWidth = minWidth;
		}
		if (tempModalOptions.minHeight === 'min') {
			tempModalOptions.minHeight = minHeight;
		}
		return tempModalOptions;
	}

	// TODO: check whether this getCleanIconClassValue method is still required anywhere
	/*
	 * Function gets icon class value for dialog.
	 *
	 * @param {string | undefined} value
	 * @returns { string | undefined } classname
	 *
	private getCleanIconClassValue(value?: string): string | undefined {
		switch (value) {
			case 'question':
				return 'ico-question';
			case 'asterix':
			case 'info':
			case 'information':
			case 'ico-information':
				return 'ico-info';
			case 'warning':
			case 'exclamation':
				return 'ico-warning';
			case 'error':
			case 'hand':
			case 'stop':
				return 'ico-error';
			default:
				return value;
		}
	}*/

	/**
	 * Function creates the copy to clipboard button.
	 *
	 * @param {(info: IDialogEventInfo) => string | string} dataToCopy Clipboard data.
	 * @param {{ tooltip?: string; processSuccess: (info: IDialogEventInfo, msgKey: string) => void }} config  //TODO:Kept any due to lack of object details. will be changed in future.
	 * @returns button
	 */
	public createCopyToClipboardButton<TValue, TBody, TDetails = void>(dataToCopy: ((info: IDialogButtonEventInfo<ICustomDialog<TValue, TBody, TDetails>, TDetails>) => string) | string, config: {
		tooltip?: string;
		processSuccess: (info: IDialogButtonEventInfo<ICustomDialog<TValue, TBody, TDetails>, TDetails>, msgKey: string) => void
	}): IDialogButtonBase<ICustomDialog<TValue, TBody, TDetails>, TDetails> {
		const copyButton = {
			id: 'copyToClipboard',
			caption: 'Copy',
			isVisible: function (info: IDialogButtonEventInfo<ICustomDialog<TValue, TBody, TDetails>, TDetails>) {
				return !!(info.dialog.details?.isVisible && navigator && navigator.clipboard);
			},
			fn: function ($event: MouseEvent, info: IDialogButtonEventInfo<ICustomDialog<TValue, TBody, TDetails>, TDetails>) {
				const retrieveData$ = new Observable<string>((observer) => {
					observer.next(typeof dataToCopy === 'function' ? dataToCopy(info) : dataToCopy);
				});
				const processSuccess = typeof config === 'object' && typeof config.processSuccess === 'function' ? config.processSuccess : () => {
				};

				retrieveData$.subscribe((data) => {
					return navigator.clipboard.writeText(data).then(
						() => {
							processSuccess(info, 'ui.common.dialog.copyToClipboardSucess');
							setTimeout(() => {
								// TODO: put alarm() function on IDialog?
								//info.dialogObject.alarm = undefined;
							}, 2000);
						},
						() => {
							processSuccess(info, 'ui.common.dialog.copyToClipboardFailed');
						}
					);
				});
				return undefined;
			}
		};
		return Object.assign(copyButton, config);
	}

	/**
	 * Function creates the showDetails button for detail messagebox dialog.
	 *
	 * @param config Default dialog options.
	 * @returns button
	 */
	private createShowDetailsButton<TValue, TBody, TDetailsBody = void>(config: IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>, detailsOptions?: ConcreteDialogDetailOptions<TDetailsBody>): IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody> {
		const showCaption = detailsOptions?.showCaption ?? 'ui.common.dialog.showDetails';
		const hideCaption = detailsOptions?.hideCaption ?? 'ui.common.dialog.hideDetails';

		return {
			...config,
			caption: info => {
				return info.dialog.details?.isVisible ? hideCaption : showCaption;
			},
			fn: ($event, info) => {
				if (info.dialog.details) {
					info.dialog.details.isVisible = !info.dialog.details.isVisible;
				}
			}
		};
	}

	// ---- utilities ----

	/**
	 * Generates button adapters to use button definitions for a given dialog in a custom dialog.
	 *
	 * Use this method if you need to use a list of {@link IDialogButtonBase | dialog button definitions}
	 * defined for a given dialog type (derived from {@link IDialog}) in a custom dialog (of type
	 * {@link ICustomDialog}).
	 *
	 * @typeParam TSrcDialog The source dialog type.
	 * @typeParam TValue The data type edited in the dialog, or `void` if the dialog only outputs
	 *   information.
	 * @typeParam TBody The type of the component used for the body of the custom dialog.
	 * @typeParam TDetailsBody The type of the component used for the details area of the
	 *   custom dialog, if details are shown and configured as {@link DialogDetailsType.Custom}.
	 *
	 * @param buttons The button definitions.
	 * @param getSrcDialog A function that can be used to extract a dialog reference from the
	 *   custom dialog.
	 *
	 * @returns An array of button wrappers that can be used in the custom dialog.
	 */
	public createButtonAdapters<TSrcDialog extends IDialog<TDetailsBody>, TValue, TBody, TDetailsBody = void>(
		buttons: IDialogButtonBase<TSrcDialog, TDetailsBody>[],
		getSrcDialog: (dialog: ICustomDialog<TValue, TBody, TDetailsBody>) => TSrcDialog
	): IDialogButtonBase<ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>[] {
		return buttons.map(b => new DialogButtonAdapter<TValue, TBody, TSrcDialog, TDetailsBody>(b, getSrcDialog));
	}

	/**
	 * Creates a custom dialog options object based on another dialog options object.
	 *
	 * The scenario in which you would use this function is when you are dealing with a dialog
	 * options object whose type is derived from {@link IDialogOptions} that describes a dialog
	 * whose runtime wrapper type is derived from {@link IDialog}.
	 * This function creates a corresponding {@link ICustomDialogOptions} object that takes
	 * over as many of the settings of the source options object as possible.
	 *
	 * Wrapper objects are created for the buttons, so the event handlers receive the correctly
	 * typed dialog reference.
	 * The {@link createButtonAdapters} method is used for this purpose.
	 *
	 * @typeParam TSrcDialog The type of the source dialog.
	 * @typeParam TSrcDialogOptions The type of the source options object.
	 * @typeParam TValue The type of the value to edit in the dialog. Set to `void` if
	 *   no data gets edited in the dialog.
	 * @typeParam TBody The type of the component that constitutes the body of the dialog.
	 * @typeParam TDetailsBody The type of the component that is shown in the details area
	 *   if its type is set to {@link DialogDetailsType.Custom}, otherwise `void`.
	 *
	 * @param srcOptions The source dialog options.
	 * @param getSrcDialog A function that can be used to extract a dialog reference from the
	 *   custom dialog.
	 * @param bodyComponent The component that constitutes the body of the custom dialog.
	 * @param bodyProviders An optional array of injection providers used when instantiating
	 *   the body component.
	 * @param details The optional details area of the dialog box.
	 *
	 * @returns The {@link ICustomDialogOptions | custom dialog options object} based on the
	 *   source object.
	 */
	public createOptionsForCustom<TSrcDialog extends IDialog<TDetailsBody>, TSrcDialogOptions extends IDialogOptions<TSrcDialog, TDetailsBody>, TValue = void, TBody = never, TDetailsBody = void>(
		srcOptions: TSrcDialogOptions,
		getSrcDialog: (dialog: ICustomDialog<TValue, TBody, TDetailsBody>) => TSrcDialog,
		bodyComponent: Type<TBody>,
		bodyProviders: StaticProvider[] = [],
		details?: ConcreteDialogDetailOptions<TDetailsBody>
	): ICustomDialogOptions<TValue, TBody, TDetailsBody> {
		const result: ICustomDialogOptions<TValue, TBody, TDetailsBody> = {
			bodyComponent,
			bodyProviders,
			details
		};

		Object.assign(result, srcOptions);

		if (Array.isArray(srcOptions.buttons)) {
			result.buttons = this.createButtonAdapters(srcOptions.buttons, getSrcDialog);
		}

		if (Array.isArray(srcOptions.customButtons)) {
			result.customButtons = this.createButtonAdapters(srcOptions.customButtons, getSrcDialog);
		}

		return result;
	}
}
