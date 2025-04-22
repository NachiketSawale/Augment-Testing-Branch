/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import {
	PlatformConfigurationService,
	IException,
	IExceptionResponse,
	PlatformTranslateService,
	Translatable
} from '@libs/platform/common';

import {
	DialogDetailsType,
	ICustomDialog,
	IDialog,
	IDialogButtonBase,
	IDialogButtonEventInfo,
	IDialogDoNotShowAgain,
	IDialogResult,
	StandardDialogButtonId,
	UiCommonDialogService
} from '../../base';

import { IDialogErrorInfo, IMessageBoxOptions, IYesNoDialogOptions } from '..';

import { MessageBoxComponent } from '../components/message-box/message-box.component';
import { getMessageBoxOptionsToken } from '../model/message-box-options.interface';
import { UiCommonDialogDownloadButtonUtilityService } from '../../base/services/dialog-download-button-utility.service';

function isException(exception: IDialogErrorInfo | IException | IExceptionResponse): exception is IException {
	return 'ClassName' in exception;
}

function isExceptionResponse(exception: IDialogErrorInfo | IException | IExceptionResponse): exception is IExceptionResponse {
	return 'Exception' in exception;
}

function isTranslatableException(exception: IDialogErrorInfo | IException | IExceptionResponse | Translatable): exception is Translatable {
	if (typeof exception === 'string') {
		return true;
	}

	if (typeof exception === 'object') {
		if ('key' in exception || 'text' in exception) {
			return true;
		}
	}

	return false;
}

/**
 * This service can display simple information dialog boxes with one or more buttons.
 *
 * @group Dialogs
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonMessageBoxService {

	private readonly dialogSvc = inject(UiCommonDialogService);

	private readonly translateSvc = inject(PlatformTranslateService);

	private readonly configSvc = inject(PlatformConfigurationService);

	private readonly dialogDownloadBtnUtilitySvc = inject(UiCommonDialogDownloadButtonUtilityService);

	/**
	 * Displays a message box with error information.
	 *
	 * @param exception An object containing information about the error.
	 *
	 * @returns The result object of the dialog.
	 */
	public showErrorDialog(exception: IDialogErrorInfo): Promise<IDialogResult> | undefined;

	/**
	 * Displays a message box with error information based on a server-side exception.
	 *
	 * @param exception An object containing information about the exception.
	 *
	 * @returns The result object of the dialog.
	 */
	public showErrorDialog(exception: IException): Promise<IDialogResult> | undefined;

	/**
	 * Displays a message box with error information based on a server-side response describing an exception.
	 *
	 * @param exception An object containing information about the response.
	 *
	 * @returns The result object of the dialog.
	 */
	public showErrorDialog(exception: IExceptionResponse): Promise<IDialogResult> | undefined;

	/**
	 * Displays a message box with a single error message.
	 *
	 * @param bodyText The error message.
	 *
	 * @returns The result object of the dialog.
	 */
	public showErrorDialog(bodyText: Translatable): Promise<IDialogResult> | undefined;

	/**
	 * An extended dialog to display an exception to user.
	 *
	 * @param exception Error Information.
	 * @returns Result of the dialog
	 */
	public showErrorDialog(exception: IDialogErrorInfo | IException | IExceptionResponse | Translatable): Promise<IDialogResult> | undefined {
		const tlsSvc = this.translateSvc;
		const configSvc = this.configSvc;

		const msgBoxOptions = ((owner): IMessageBoxOptions => {
			if (isTranslatableException(exception)) {
				return {
					headerText: 'ui.common.dialog.errorTitle',
					bodyText: exception,
					iconClass: 'error',
					buttons: [{
						id: StandardDialogButtonId.Ok
					}],
					// TODO: copy to clipboard button DEV-17863
				};
			}

			const settings = (function normalizeSettings(): IDialogErrorInfo {
				if (isException(exception)) {
					return {
						errorCode: exception.HResult,
						errorMessage: exception.ErrorMessage ?? '',
						errorDetail: exception.ErrorDetail ?? '',
						detailStackTrace: exception.StackTraceString ?? '',
						detailMethod: exception.ExceptionMethod ?? '',
						detailMessage: exception.ErrorDetail,
						errorVersion: configSvc.fullProductVersion
					};
				} else if (isExceptionResponse(exception)) {
					return {
						errorCode: exception.ErrorCode,
						errorMessage: exception.ErrorMessage,
						errorDetail: exception.ErrorDetail,
						detailStackTrace: exception.StackTrace ?? '',
						detailMethod: exception.Exception.ExceptionMethod ?? '',
						detailMessage: exception.Exception.ErrorDetail,
						errorVersion: configSvc.fullProductVersion
					};
				} else {
					return exception;
				}
			})();

			// extract exception information to display
			const exceptionDetails = [{
				headerKey: 'ui.common.dialog.errorMessage',
				value: settings.errorMessage
			}, {
				headerKey: 'ui.common.dialog.errorVersion',
				value: settings.errorVersion
			}, {
				headerKey: 'ui.common.dialog.errorDetail',
				value: settings.errorDetail
			}, {
				headerKey: 'ui.common.dialog.errorMethod',
				value: settings.detailMethod
			}, {
				headerKey: 'ui.common.dialog.errorStacktrace',
				value: settings.detailStackTrace
			}];

			// combine exception information into formatted text block
			const detailText = exceptionDetails.filter(d => d.value).map(d => `<div>
\t<h4>${tlsSvc.instant(d.headerKey).text}</h4>
\t<p>${d.value}</p>
</div>`).join('\n');
			// TODO: beware of HTML/script injection in the above - sanitize! DEV-17860

			const downloadBtn = owner.dialogDownloadBtnUtilitySvc.createDownloadButton(
				{
					dataContent: function (info): string {
						return JSON.stringify(settings,undefined,4);
					},
					name: 'error.json',
					type: 'text/json'
				},(info,msg)=>{
					//TODO: Set alarm data. 
					console.log(info,msg);
				},{
					isVisible: (info) =>{
						return !!info.dialog.details?.isVisible;
					}
				}
			);

			// display message box
			return {
				windowClass: 'error-dialog', // TODO: is this correct?
				width: '800px',
				bodyFlexColumn: true, // TODO: is this still required?
				// TODO: Does this need to be added to dialog options?
				//bodyMarginLarge: true,
				resizeable: false,
				headerText: 'ui.common.dialog.errorTitle',
				bodyText: {
					key: 'ui.common.dialog.exceptionSummaryPattern',
					params: settings
				},
				iconClass: 'error',
				details: {
					type: DialogDetailsType.LongText,
					value: detailText
				},
				buttons: [{
					id: StandardDialogButtonId.Ok
				}],
				customButtons:[this.clipboard() as IDialogButtonBase<IDialog<void>, void>,
					downloadBtn
				],
				// TODO: copy to clipboard button DEV-17863
			};
		})(this);

		return this.showMsgBox(msgBoxOptions);
	}

	public clipboard() {
        return this.dialogSvc.createCopyToClipboardButton(
            () => {
                // console.log('copy to clipboard');
                return 'copy to clipboard';
            },
            {
                tooltip: 'cloud.common.copyToClipboardTooltip',
                processSuccess: (info: IDialogButtonEventInfo<ICustomDialog<void, string, void>, void>, msgKey: string) => {
                    // set(info.dialog, 'alarm', msgKey);
            },
          },
        );
    }

	/**
	 * Displays a standard message box with an optional *Do not show again* option.
	 * It displays a text, a title, an OK-button and optionally a dialog icon.
	 *
	 * @param bodyText Body description.
	 * @param headerText Header title.
	 * @param iconClass Css class.
	 * @param dialogId Unique id for dialog.
	 * @param dontShowAgain
	 * @returns Result of the dialog.
	 */
	public showMsgBox(bodyText: string, headerText: string, iconClass: string, dialogId: string, dontShowAgain: IDialogDoNotShowAgain | boolean): Promise<IDialogResult> | undefined;

	/**
	 * Displays a standard message box.
	 * It displays a text, a title, an OK-button and optionally a dialog icon.
	 *
	 * @param bodyText Body description.
	 * @param headerText Header title.
	 * @param iconClass Css class.
	 * @returns Result of the dialog.
	 */
	public showMsgBox(bodyText: string, headerText: string, iconClass: string): Promise<IDialogResult> | undefined;

	/**
	 * Displays a standard message box based on a configuration object.
	 * It displays a text, a title, an OK-button and optionally a dialog icon.
	 *
	 * @typeParam TDetailsBody If the message box has a details area whose type is
	 *   {@link DialogDetailsType.Custom}, the component type to show in this details
	 *   area. Otherwise, `void`.
	 *
	 * @param options An object that contains the settings for the message box.
	 *
	 * @returns Result of the dialog.
	 */
	public showMsgBox<TDetailsBody = void>(options: IMessageBoxOptions<TDetailsBody>): Promise<IDialogResult> | undefined;

	public showMsgBox<TDetailsBody = void>(bodyTextOrOptions: string | IMessageBoxOptions<TDetailsBody>, headerText?: string, iconClass?: string, dialogId?: string, dontShowAgain?: IDialogDoNotShowAgain | boolean): Promise<IDialogResult> | undefined {
		const origOptions: IMessageBoxOptions<TDetailsBody> = typeof bodyTextOrOptions === 'object' ? bodyTextOrOptions : {
			bodyText: bodyTextOrOptions,
			headerText,
			iconClass,
			id: dialogId,
			dontShowAgain
		};

		const msgBoxOptions = this.dialogSvc.createOptionsForCustom(origOptions,
			dlg => dlg.body.dialogInfo,
			MessageBoxComponent<TDetailsBody>,
			[{
				provide: getMessageBoxOptionsToken<TDetailsBody>(),
				useValue: origOptions
			}],
			origOptions.details);

		msgBoxOptions.windowClass = 'msgbox';
		msgBoxOptions.bodyLargeMargin = true;
		msgBoxOptions.width = '40%';
		return this.dialogSvc.show(msgBoxOptions);
	}

	/**
	 * A standard dialog for information messages.
	 * It displays a text, a title, an OK-button and an information icon.
	 *
	 * @param bodyText Body description.
	 * @param customId Unique id for dialog.
	 * @param dontShowAgain
	 *
	 * @returns Result of the dialog.
	 */
	public showInfoBox(bodyText: string, customId: string, dontShowAgain: IDialogDoNotShowAgain | boolean): Promise<IDialogResult> | undefined {
		// TODO: make header translatable
		return this.showMsgBox(bodyText, 'Information', 'info', customId, dontShowAgain);
	}

	/**
	 * Shows a dialog box with Yes/No buttons.
	 * The question icon is predefined.
	 *
	 * @param bodyText Body description.
	 * @param headerText Header title.
	 *
	 * @returns The result of the dialog.
	 */
	public showYesNoDialog(bodyText: string, headerText: string): Promise<IDialogResult> | undefined;

	/**
	 * Shows a dialog box with Yes/No buttons based on a configuration object.
	 * The question icon is predefined.
	 *
	 * @param options The configuration object.
	 *
	 * @returns The result of the dialog.
	 */
	public showYesNoDialog(options: IYesNoDialogOptions): Promise<IDialogResult> | undefined;

	public showYesNoDialog(bodyTextOrOptions: IYesNoDialogOptions | string, headerText?: string): Promise<IDialogResult> | undefined {
		const origOptions: IYesNoDialogOptions = typeof bodyTextOrOptions === 'object' ? bodyTextOrOptions : {
			bodyText: bodyTextOrOptions,
			headerText
		};

		const msgBoxOptions: IMessageBoxOptions = {
			...origOptions,
			buttons: [
				{ id: StandardDialogButtonId.Yes },
				{ id: StandardDialogButtonId.No },
			],
			defaultButtonId: origOptions.defaultButtonId || StandardDialogButtonId.Yes,
			iconClass: 'ico-question',
		};

		if (origOptions.showCancelButton) {
			if (!msgBoxOptions.buttons) {
				throw new Error('Initialization of message box options has failed.');
			}

			msgBoxOptions.buttons.push({
				id: 'cancel',
				caption: { key: 'ui.common.dialog.cancelBtn' }
			});
		}

		return this.showMsgBox(msgBoxOptions);
	}

	/**
	 * Show a dialog to delete a selection.
	 *
	 * @typeParam TValue The type of items to delete.
	 *
	 * @param customModalOptions Default dialog options.
	 * @returns Result of the dialog.
	 */
	// generic parameter will be used when items to delete are displayed in grid
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public deleteSelectionDialog<TValue>(customModalOptions?: IMessageBoxOptions): Promise<IDialogResult> | undefined {
		const finalOptions: IMessageBoxOptions = {
			id: 'general-delete-sel',
			headerText: 'ui.common.dialog.deleteSelTitle',
			bodyText: 'ui.common.dialog.deleteSelMsg',
			iconClass: 'ico-warning',
			defaultButtonId: 'cancel',
			dontShowAgain: false,
			...customModalOptions,
			buttons: [
				{ id: StandardDialogButtonId.Yes },
				{ id: StandardDialogButtonId.Cancel },
			]
		};

		// TODO: configure details as grid and supply items; possibly use special options interface

		return this.showMsgBox(finalOptions);
	}
}
