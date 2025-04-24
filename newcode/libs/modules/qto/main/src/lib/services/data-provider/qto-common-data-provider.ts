/*
 * Copyright(c) RIB Software GmbH
 */

import { IDataProvider, IDataServiceOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import {PlatformConfigurationService, IEntityIdentification, IIdentificationData, ServiceLocator} from '@libs/platform/common';
import { map, lastValueFrom } from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {inject} from '@angular/core';

/**
 * Read options
 */
export interface IQtoDataServiceReadEndPointOptions<T> extends IDataServiceEndPointOptions {
	readonly prepareParam?: (ident: IIdentificationData) => HttpParams | {
		[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
	};
	readonly processData?: (resp: unknown) => T[];
}

/**
 * Create options
 */
export interface IQtoDataServiceCreateEndPointOptions<T> extends IDataServiceEndPointOptions {
	readonly prepareParam?: (ident: IIdentificationData) => HttpParams | {
		[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
	};
	readonly processData?: (resp: unknown) => T;
}

/**
 * qto common data provider.
 */
export class QtoCommonDataProvider<T extends IEntityIdentification> implements IDataProvider<T> {

	protected serviceUrl: string = '';
	protected serviceOptions!: IDataServiceOptions<T>;
	protected configService = inject(PlatformConfigurationService);

	public setOption(options: IDataServiceOptions<T>) {
		this.serviceOptions = options;
		this.serviceUrl = this.configService.webApiBaseUrl + this.serviceOptions.apiUrl + '/';
	}

	public create(identificationData: IIdentificationData | null): Promise<T> {

		if (identificationData === null) {
			throw '';
		}

		const http = ServiceLocator.injector.get(HttpClient);
		const endPoint = this.endPoint(this.serviceOptions.createInfo, 'create');
		const usePost = this.usePost(this.serviceOptions.createInfo, true);
		const params = this.getParams(this.serviceOptions.createInfo as IQtoDataServiceCreateEndPointOptions<T>, identificationData, {});

		let httpOption= {};
		if (usePost){
			httpOption =  {body: params};
		} else {
			httpOption = {params: params};
		}

		return lastValueFrom(http.request<T>(usePost ? 'POST' : 'GET', this.serviceUrl + endPoint, httpOption).pipe(
			map((resp) => {
				return this.processCreate(this.serviceOptions.createInfo as IQtoDataServiceCreateEndPointOptions<T>, resp);
			})));
	}

	public load(identificationData: IIdentificationData | null): Promise<T[]> {
		if (identificationData === null) {
			return Promise.resolve([]);
		} else {
			const http = ServiceLocator.injector.get(HttpClient);

			const endPoint = this.endPoint(this.serviceOptions.readInfo, 'list');
			const usePost = this.usePost(this.serviceOptions.readInfo, false);
			const params = this.getParams(this.serviceOptions.readInfo as IQtoDataServiceReadEndPointOptions<T>, identificationData, {});

			let httpOption= {};
			if (usePost){
				httpOption =  {body: params};
			} else {
				httpOption = {params: params};
			}

			return lastValueFrom(http.request<unknown>(usePost ? 'POST' : 'GET', this.serviceUrl + endPoint, httpOption).pipe(
				map((resp) => {
					return this.processLoad(this.serviceOptions.readInfo as IQtoDataServiceReadEndPointOptions<T>, resp);
				})));

		}
	}
	protected usePost(endPointOptions: IDataServiceEndPointOptions | undefined, defValue: boolean): boolean {
		return endPointOptions && endPointOptions.usePost !== undefined ? endPointOptions.usePost : defValue;
	}

	protected endPoint(endPointOptions: IDataServiceEndPointOptions | undefined, defValue: string): string {
		return endPointOptions && endPointOptions.endPoint ? endPointOptions.endPoint : defValue;
	}

	protected getParams(endPointOptions: IQtoDataServiceReadEndPointOptions<T> | IQtoDataServiceCreateEndPointOptions<T>  | undefined, identificationData: IIdentificationData, defValue: unknown): unknown {
		return endPointOptions && endPointOptions.prepareParam ? endPointOptions.prepareParam(identificationData) : defValue;
	}

	protected processLoad(endPointOptions: IQtoDataServiceReadEndPointOptions<T> | undefined, resp: unknown): T[] {
		return endPointOptions && endPointOptions.processData ? endPointOptions.processData(resp) : (resp as {
			Main: unknown
		}).Main as T[];
	}

	protected processCreate(endPointOptions: IQtoDataServiceCreateEndPointOptions<T> | undefined, resp: unknown): T {
		return endPointOptions && endPointOptions.processData ? endPointOptions.processData(resp) : resp as T;
	}
}
