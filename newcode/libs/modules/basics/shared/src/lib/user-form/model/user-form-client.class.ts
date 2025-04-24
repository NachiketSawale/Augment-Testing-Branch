/*
 * Copyright(c) RIB Software GmbH
 */

import { isFunction, trimStart, extend } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedUserFormConnector } from './user-form-connector.class';
import { IUserFormData } from './interfaces/user-form-data.interface';
import { IUserFormCompleteData } from './interfaces/user-form-complete-data.interface';
import { IUserFormHttpCallback, IUserFormHttpClient, IUserFormHttpResponse } from './interfaces/user-form-http-client.interface';
import { IUserFormDataItem } from './interfaces/user-form-data-item.interface';
import { IUserFormElementValueParser } from './interfaces/user-form-element-value-parser.interface';

/**
 * Represents the API request client.
 */
export class BasicsSharedUserFormClient {
	private http: HttpClient = ServiceLocator.injector.get(HttpClient);
	private configService: PlatformConfigurationService = ServiceLocator.injector.get(PlatformConfigurationService);

	public constructor(private connector: BasicsSharedUserFormConnector) {

	}

	private defaultFormElemValueParser: IUserFormElementValueParser = {
		nameParser: function (ele: HTMLElement) {
			return ele.getAttribute('type') || '';
		},
		get: function (ele: HTMLElement) {
			return this.nameParser ? this.parsers[this.nameParser(ele)] : undefined;
		},
		parsers: {
			checkbox: function (ele: HTMLElement) {
				const checkboxElem = ele as HTMLInputElement;
				return checkboxElem.checked;
			},
			radio: function (ele: HTMLElement) {
				const radioElem = ele as HTMLInputElement;
				return radioElem.checked ? radioElem.value : null;
			},
			select: function (ele: HTMLElement) {
				const selectElem = ele as HTMLSelectElement;
				return selectElem.options[selectElem.selectedIndex].value;
			}
		}
	};

	private userFormElemValueParser: IUserFormElementValueParser = {
		nameParser: function (ele: HTMLElement) {
			return ele.getAttribute('type') || '';
		},
		get: function (ele: HTMLElement) {
			return this.nameParser ? this.parsers[this.nameParser(ele)] : undefined;
		},
		parsers: {},
		reset: function () {
			this.parsers = {};
		}
	};

	private buildUrl(url: string) {
		return this.configService.webApiBaseUrl + trimStart(url, '/');
	}

	private createHttpCallbackFn(callback?: (response: IUserFormHttpResponse) => void) {
		const callbackFn = (args: IUserFormHttpResponse) => {
			if (callback) {
				callback(args);
			}
		};
		return {
			next: function (data: unknown) {
				callbackFn({status: true, data: data});
			},
			error: function (reason: string) {
				callbackFn({status: false, error: reason});
			}
		};
	}

	public httpClient: IUserFormHttpClient = {
		get: (url: string, callback?: IUserFormHttpCallback) => {
			this.http.get<unknown>(this.buildUrl(url)).subscribe(this.createHttpCallbackFn(callback));
		},
		post: (url: string, data?: object, callback?: IUserFormHttpCallback) => {
			this.http.post<unknown>(this.buildUrl(url), data).subscribe(this.createHttpCallbackFn(callback));
		},
		put: (url: string, data?: object, callback?: IUserFormHttpCallback) => {
			this.http.put<unknown>(this.buildUrl(url), data).subscribe(this.createHttpCallbackFn(callback));
		},
		patch: (url: string, data?: object, callback?: IUserFormHttpCallback) => {
			this.http.patch<unknown>(this.buildUrl(url), data).subscribe(this.createHttpCallbackFn(callback));
		},
	};

	public getUserInfo() {
		return this.connector.options.userInfo;
	}

	public getClientContext() {
		return this.configService.getContext();
	}

	public getCompanyInfo() {
		return this.connector.options.companyInfo;
	}

	public getPinningProjectInfo() {
		// TODO-DRIZZLE: To be implemented.
		// var pinningProject = cloudDesktopPinningContextService.getPinningItem(cloudDesktopPinningContextService.tokens.projectToken);
		// if (pinningProject) {
		// 	return {
		// 		id: pinningProject.id,
		// 		info: pinningProject.info
		// 	};
		// }
		// return null;
	}

	public getAvailablePinningItemTokens() {
		// TODO-DRIZZLE: To be implemented.
		// return [].concat(cloudDesktopPinningContextService.tokens);
	}

	public getPinningItem(token: string) {
		// TODO-DRIZZLE: To be implemented.
		// let pinningItem = cloudDesktopPinningContextService.getPinningItem(token);
		// if (pinningItem) {
		// 	return {
		// 		id: pinningItem.id,
		// 		info: pinningItem.info
		// 	};
		// }
		return null;
	}

	public getDataSource() {
		return this.connector.getDataSource();
	}

	public saveForm(formData: IUserFormData[]) {
		this.connector.saveFormData(formData);
	}

	public registerFormSaved(callback: (data: IUserFormCompleteData) => void) {
		this.connector.registerFormSaved(callback);
	}

	public emitFormChanged(changedItems: IUserFormDataItem[]) {
		this.connector.emitFormChanged(changedItems);
	}

	public extendFormElemValueParser(nameParser: (ele: HTMLElement) => string, valueParsers: { [key: string]: (ele: HTMLInputElement) => string }) {
		this.userFormElemValueParser.nameParser = nameParser;
		extend(this.userFormElemValueParser.parsers, valueParsers);
	}

	public collectFormData(form: HTMLFormElement): IUserFormDataItem[] {
		const formData = [];
		for (let i = 0; i < form.elements.length; i++) {
			const elem = form.elements[i] as HTMLInputElement;
			if (elem.name) {
				const parseFn = this.userFormElemValueParser.get(elem) || this.defaultFormElemValueParser.get(elem);
				const newFormData = {
					name: elem.name,
					value: isFunction(parseFn) ? parseFn(elem) : elem.value,
					paramCode: elem.getAttribute('paramcode') || '',
					columnName: elem.getAttribute('columnname') || ''
				};
				formData.push(newFormData);
			}
		}
		return formData;
	}
}