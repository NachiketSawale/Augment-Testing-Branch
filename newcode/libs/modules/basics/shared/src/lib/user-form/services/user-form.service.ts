/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import * as _ from 'lodash';
import { firstValueFrom, map } from 'rxjs';
import { IUserFormDisplayOptions } from '../model/interfaces/user-form-connector-initialize-options.interface';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { IUserFormData } from '../model/interfaces/user-form-data.interface';
import { BasicsSharedUserFormConnector } from '../model/user-form-connector.class';
import { UserFormDisplayMode } from '../model/interfaces/user-form-display-mode.enum';
import { IUserFormTemplate } from '../model/interfaces/user-form-template.interface';
import { PlatformAuthService } from '@libs/platform/authentication';
import { IClosingDialogButtonEventInfo, IDialogButtonEventInfo, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsSharedUserFormDialogBodyComponent } from '../components/user-form-dialog-body/user-form-dialog-body.component';
import { IUserFormDialogOptions, IUserFormEditorDialog } from '../model/interfaces/user-form-dialog-options.interface';

/**
 * Represents the injection token to access the dialog options in user form dialog.
 */
export const USER_FORM_DIALOG_OPTIONS_TOKEN = new InjectionToken<IUserFormDialogOptions>('user-form_dlg_options');

@Injectable({
	providedIn: 'root'
})
/**
 * The service to manage user form.
 */
export class BasicsSharedUserFormService {
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private authService = inject(PlatformAuthService);
	private dialogService = inject(UiCommonDialogService);
	private messageBoxService = inject(UiCommonMessageBoxService);
	private translateService = inject(PlatformTranslateService);

	public constructor() {
		this.translateService.load(['basics.userform']).then();
	}

	private getTemplateUrl(options: IUserFormDisplayOptions): Promise<IUserFormTemplate> {
		let args = new HttpParams({
			fromObject: {
				formId: options.formId
			}
		});

		if (options.formDataId) {
			args = args.append('formDataId', options.formDataId);
		}
		if (options.contextId) {
			args = args.append('contextId', options.contextId);
		}
		if (options.editable) {
			args = args.append('editable', options.editable);
		}
		if (options.fromModule) {
			args = args.append('fromModule', options.fromModule);
		}
		if (options.context1Id) {
			args = args.append('context1Id', options.context1Id);
		}
		if (options.tempContextId) {
			args = args.append('tempContextId', options.tempContextId);
		}

		// TODO-DRIZZLE: Below must be move from the service to outside.
		// if (options.rubricFk === 78 && options.context1Id) {
		// 	// args.context1Id = options.context1Id;
		// }
		// if (options.rubricFk === 91 && options.tempContextId) {
		// 	// args.tempContextId = options.tempContextId;
		// }

		const urlResult = this.http.request('GET', this.configService.webApiBaseUrl + 'basics/userform/getformlink', {
			params: args,
			observe: 'response',
			responseType: 'text'
		}).pipe(
			map((response: HttpResponse<string>) => {
				return {
					url: response.body || '',
					windowOptions: response.headers.get('WindowOptions') || ''
				};
			})
		);

		return firstValueFrom(urlResult);
	}

	private getUserInfo(): Promise<{ UserId: string }> {
		const user = this.authService.getUserData().pipe(
			map((user: { user_id: string }) => {
				return {
					UserId: user.user_id
				};
			})
		);
		return firstValueFrom(user);
	}

	private getCompanyInfo(): Promise<{ id: string, companyName: string }> {
		return Promise.resolve({
			id: this.configService.clientId?.toString() || '',
			companyName: '' // TODO-DRIZZLE: To be implementd.
		});
	}

	private connectWindow(window: Window, connector: BasicsSharedUserFormConnector): void {
		_.extend(window, {
			userInfo: connector.options.userInfo,
			clientContext: this.configService.getContext(),
			initialData: !_.isNil(connector.options.initialData) ? connector.options.initialData : {},
			saveCallbackFunction: this.getSaveCallback(connector)
		});

		const initFn = _.get(window, 'initFormData') as unknown as () => void;
		if (_.isFunction(initFn)) {
			initFn();
		}

		connector.connect(window);
	}

	private getSaveCallback(connector: BasicsSharedUserFormConnector) {
		return (formData: IUserFormData[]) => {
			return connector.saveFormData(formData);
		};
	}

	private bindFormElementChangeEvent(window: Window, connector: BasicsSharedUserFormConnector) {
		if (window.document.forms.length) {
			const form = window.document.forms[0];
			const elements = form.elements;
			for (let i = 0; i < elements.length; i++) {
				const ctrl = elements[i] as HTMLInputElement;
				ctrl.addEventListener('change', () => {
					connector.emitFormChanged([{
						name: ctrl.name,
						value: ctrl.type === 'checkbox' ? ctrl.checked.toString() : ctrl.value
					}]);
				}, false);
			}
		}
	}

	private attachEvent(window: Window, connector: BasicsSharedUserFormConnector) {
		window.addEventListener('unload', () => {
			// TODO-DRIZZLE: To be implemented.
			// if (options.modal && obj && obj.target.URL !== 'about:blank') {
			// 	cloudDesktopModalBackgroundService.setModalBackground(false);
			// }
			connector.emitFormClosed();
		});

		if (connector.options.editable) {
			this.bindFormElementChangeEvent(window, connector);
		}
	}

	private openAsWindowWithIframe(url: string, w: Window, callback: (window: Window) => void) {
		w.document.title = url.substring(url.lastIndexOf('/') + 1).toLowerCase();
		w.document.body.style.width = '100%';
		w.document.body.style.height = '100%';
		w.document.body.style.padding = '0px';
		w.document.body.style.margin = '0px';
		w.document.body.style.overflow = 'hidden';
		w.document.body.innerHTML = '<iframe credentialless width="100%" height="100%" sandbox="allow-forms allow-scripts allow-presentation allow-modals allow-same-origin"></iframe>';

		const iframe = w.document.body.querySelector('iframe');
		if (iframe) {
			iframe.addEventListener('load', function () {
				callback(iframe?.contentWindow as Window);
			});
			iframe.setAttribute('src', url);
		}
	}

	private showWarning(message: string) {
		this.messageBoxService.showMsgBox(message, 'Warning', 'ico-warning', 'message', false);
	}

	private async createConnector(options: IUserFormDisplayOptions, previewOnly?: boolean): Promise<BasicsSharedUserFormConnector> {
		const userInfo = await this.getUserInfo();
		const companyInfo = await this.getCompanyInfo();
		const initializeOptions = _.extend({
			preview: previewOnly,
			userInfo: userInfo,
			companyInfo: companyInfo
		}, options);
		return new BasicsSharedUserFormConnector(initializeOptions);
	}

	private async showAsDialog(template: IUserFormTemplate, connector: BasicsSharedUserFormConnector): Promise<Window> {
		return new Promise((resolve) => {
			const modalOptions = {
				url: template.url,
				windowClass: 'form-modal-dialog',
				width: '1050px',
				height: '800px',
				backdrop: false,
				headerText: {
					key: 'basics.userform.defaultContainerTitle'
				},
				resizeable: true,
				onLoaded: (window: Window) => {
					resolve(window);
				},
				buttons: [{
					id: 'save',
					caption: {key: 'basics.common.button.save'},
					autoClose: false,
					isDisabled: (info: IDialogButtonEventInfo<IUserFormEditorDialog, void>) => {
						return connector.options.isReadonly || !connector.options.editable;
					},
					fn: (event: MouseEvent, info: IClosingDialogButtonEventInfo<IUserFormEditorDialog, void>) => {
						const formDataItems = connector.collectFormData();
						const formData = connector.toUserFormData(formDataItems);
						info.dialog.saving = true;
						connector.saveFormData(formData).then(() => {
							info.dialog.saving = false;
							info.dialog.close('save');
						});
					}
				}, {
					id: StandardDialogButtonId.Cancel
				}]
			};
			const customOptions = this.dialogService.createOptionsForCustom<IUserFormEditorDialog, IUserFormDialogOptions, IUserFormData[], BasicsSharedUserFormDialogBodyComponent>(
				modalOptions,
				info => info.body.dialogInfo,
				BasicsSharedUserFormDialogBodyComponent,
				[{
					provide: USER_FORM_DIALOG_OPTIONS_TOKEN,
					useValue: modalOptions
				}]
			);

			return this.dialogService.show(customOptions);
		});
	}

	private showAsContainer(template: IUserFormTemplate, connector: BasicsSharedUserFormConnector): Promise<Window> {
		return new Promise<Window>((resolve, reject) => {
			if (connector.options.container) {
				let iframe = connector.options.container.querySelector('iframe');
				if (!iframe) {
					connector.options.container.innerHTML = '<iframe credentialless class="fullwidth fullheight border-none"></iframe>';
					iframe = connector.options.container.querySelector('iframe');
				}
				if (iframe) {
					// Remove last bound load event if exist
					const loadFn = _.get(iframe, '__iframeLoadFn');
					if (_.isFunction(loadFn)) {
						iframe.removeEventListener('load', loadFn);
					}

					// Bind the new load event
					iframe.addEventListener('load', () => {
						resolve(iframe?.contentWindow as Window);
					});

					iframe.setAttribute('src', template.url);
				}
			} else {
				reject('Load failed - Please ensure that container is ready!');
			}
		});
	}

	private showAsIframe(template: IUserFormTemplate, connector: BasicsSharedUserFormConnector): Promise<Window> {
		return new Promise<Window>((resolve, reject) => {
			if (connector.options.iframe) {
				// Remove last bound load event if exist
				const loadFn = _.get(connector.options.iframe, '__iframeLoadFn');
				if (_.isFunction(loadFn)) {
					connector.options.iframe.removeEventListener('load', loadFn);
				}

				// Bind the new load event
				connector.options.iframe.addEventListener('load', () => {
					resolve(connector.options.iframe?.contentWindow as Window);
				});

				connector.options.iframe.setAttribute('src', template.url);
			} else {
				reject('Load failed - Please ensure that iframe is ready!');
			}
		});
	}

	private showAsWindow(template: IUserFormTemplate, connector: BasicsSharedUserFormConnector): Promise<Window> {
		return new Promise<Window>((resolve, reject) => {
			const w = window.open('about:blank', '_user_form_win', template.windowOptions || '');
			if (w) {
				this.openAsWindowWithIframe(template.url, w, (contentWin: Window) => {
					resolve(contentWin);
				});
			} else {
				reject('Open window failed - Please ensure that no popup-blocker is activated!');
			}
		});
	}

	private async showAsDisplayMode(template: IUserFormTemplate, connector: BasicsSharedUserFormConnector): Promise<Window> {
		return new Promise<Window>((resolve, reject) => {
			if (connector.options.displayMode === UserFormDisplayMode.Container) {
				this.showAsContainer(template, connector).then(resolve, reject);
			} else if (connector.options.displayMode === UserFormDisplayMode.IFrame) {
				this.showAsIframe(template, connector).then(resolve, reject);
			} else if (connector.options.displayMode === UserFormDisplayMode.Dialog) {
				this.showAsDialog(template, connector).then(resolve, reject);
			} else {
				this.showAsWindow(template, connector).then(resolve, reject);
			}
		});
	}

	public async preview(formId: number): Promise<void> {
		const options: IUserFormDisplayOptions = {
			formId: formId,
			editable: false,
			isReadonly: true,
			displayMode: UserFormDisplayMode.Window
		};
		const connector = await this.createConnector(options, true);
		const template = await this.getTemplateUrl(connector.options);

		return this.showAsDisplayMode(template, connector).then((window: Window) => {
			this.connectWindow(window, connector);
		}, (reason) => {
			this.showWarning(reason);
			return reason;
		});
	}

	public async show(options: IUserFormDisplayOptions): Promise<BasicsSharedUserFormConnector> {
		const connector = await this.createConnector(options);
		const template = await this.getTemplateUrl(connector.options);

		if (connector.options.modal) {
			// TODO-DRIZZLE: To be implemented.
			// cloudDesktopModalBackgroundService.setModalBackground(true);
		}

		return this.showAsDisplayMode(template, connector).then((window: Window) => {
			this.attachEvent(window, connector);
			this.connectWindow(window, connector);
			return connector;
		}, (reason) => {
			this.showWarning(reason);
			return reason;
		});
	}

}