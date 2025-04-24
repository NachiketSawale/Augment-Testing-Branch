import { IDataProvider } from './data-provider.interface';
import { lastValueFrom } from 'rxjs';
import { IDataServiceOptions } from '../data-service/interface/options/data-service-options.interface';
import { HttpClient } from '@angular/common/http';
import { ServiceLocator } from '@libs/platform/common';

import { PlatformConfigurationService } from '@libs/platform/common';
import { inject } from '@angular/core';
import { IIdentificationData } from '@libs/platform/common';
import { IDataServiceEndPointOptions } from '../data-service/data-service-end-point-options.interface';


export class HttpDataProvider<T> implements IDataProvider<T> {
	protected readonly serviceUrl: string = '';
	protected serviceOptions: IDataServiceOptions<T>;
	protected configService = inject(PlatformConfigurationService);

	public constructor(options: IDataServiceOptions<T>) {
		this.serviceOptions = options;
		this.serviceUrl = this.configService.webApiBaseUrl + this.serviceOptions.apiUrl + '/';
	}

	public create(identificationData: IIdentificationData | null): Promise<T> {
		const http = ServiceLocator.injector.get(HttpClient);
		const endPoint = this.endPoint(this.serviceOptions.createInfo, 'create');
		const usePost = this.usePost(this.serviceOptions.createInfo, true);
		const httpOption= this.evaluateParameter(this.serviceOptions.createInfo, usePost, identificationData);

		return lastValueFrom(http.request<T>(usePost ? 'POST' : 'GET', this.serviceUrl + endPoint, httpOption));
	}

	public async createEnhanced<PT extends object, RT>(payload: PT | undefined, onSuccess: (created: RT) => T): Promise<T> {
		const http = ServiceLocator.injector.get(HttpClient);
		const endPoint = this.endPoint(this.serviceOptions.createInfo, 'create');
		const usePost = this.usePost(this.serviceOptions.createInfo, true);
		const httpOption= this.evaluateParameterEnhanced(this.serviceOptions.createInfo, usePost, payload);

		const rawResult = await lastValueFrom(http.request<RT>(usePost ? 'POST' : 'GET', this.serviceUrl + endPoint, httpOption));
		const result = onSuccess(rawResult);

		return result;
	}

	protected doLoad(http: HttpClient, endPoint: string, usePost: boolean, httpOption: object): Promise<T[]> {
		return lastValueFrom(http.request<T[]>(usePost ? 'POST' : 'GET', this.serviceUrl + endPoint, httpOption));
	}

	public load(identificationData: IIdentificationData | null): Promise<T[]> {
		const http = ServiceLocator.injector.get(HttpClient);
		const endPoint = this.endPoint(this.serviceOptions.readInfo, 'listbyparent');
		const usePost = this.usePost(this.serviceOptions.readInfo, false);
		const httpOption= this.evaluateParameter(this.serviceOptions.readInfo, usePost, identificationData);

		return this.doLoad(http, endPoint, usePost, httpOption);
	}

	public async loadEnhanced<PT extends object, RT>(payload: PT | undefined, onSuccess: (loaded: RT) => T[]): Promise<T[]> {
		if (payload === null) {
			return Promise.resolve([]);
		} else {
			const http = ServiceLocator.injector.get(HttpClient);
			const endPoint = this.endPoint(this.serviceOptions.readInfo, 'listbyparent');
			const usePost = this.usePost(this.serviceOptions.readInfo, false);
			const httpOption= this.evaluateParameterEnhanced(this.serviceOptions.readInfo, usePost, payload);

			const rawResult = await lastValueFrom(http.request<RT>(usePost ? 'POST' : 'GET', this.serviceUrl + endPoint, httpOption));
			const result = onSuccess(rawResult);

			return result;
		}
	}

	protected usePost(endPointOptions: IDataServiceEndPointOptions | undefined, defValue: boolean): boolean {
		return endPointOptions && endPointOptions.usePost !== undefined ? endPointOptions.usePost : defValue;
	}

	protected endPoint(endPointOptions: IDataServiceEndPointOptions | undefined, defValue: string): string {
		return endPointOptions && endPointOptions.endPoint ? endPointOptions.endPoint : defValue;
	}

	protected evaluateParameter(endPointOptions: IDataServiceEndPointOptions | undefined, usePost: boolean, ident: IIdentificationData | null) {
		let httpOption= {};
		if (usePost) {
			if (ident !== null && typeof endPointOptions?.prepareParam === 'function' ){
				httpOption = { body: endPointOptions.prepareParam(ident) };
			} else {
				httpOption = { body: ident };
			}
		} else if (ident !== null && typeof endPointOptions?.prepareParam === 'function' ) {
			httpOption = { params: endPointOptions.prepareParam(ident) };
		} else {
			httpOption = { params:ident };
		}

		return httpOption;
	}

	protected evaluateParameterEnhanced(endPointOptions: IDataServiceEndPointOptions | undefined, usePost: boolean, payload: object | undefined) {
		let httpOption= {};
		if (usePost) {
			httpOption = { body: payload };
		} else if (payload !== null && typeof endPointOptions?.prepareParam === 'function' ) {
			console.error('In enhanced create/load function prepareParam method is not supported');
			httpOption = { params: payload };
		} else {
			httpOption = { params: payload };
		}

		return httpOption;
	}
}