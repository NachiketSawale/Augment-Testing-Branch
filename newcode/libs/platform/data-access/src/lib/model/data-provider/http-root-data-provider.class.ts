/*
 * Copyright(c) RIB Software GmbH
 */

import {lastValueFrom} from 'rxjs';
import { IDataServiceOptions } from '../data-service/interface/options/data-service-options.interface';
import { HttpClient } from '@angular/common/http';
import { ServiceLocator } from '@libs/platform/common';

import { ISearchResult } from '@libs/platform/common';
import { ISearchPayload } from '@libs/platform/common';
import { IRootDataProvider } from './root-data-provider.interface';
import { HttpDataProvider } from './http-data-provider.class';


export class HttpRootDataProvider<T, U> extends HttpDataProvider<T> implements IRootDataProvider<T, U> {
	public constructor(options: IDataServiceOptions<T>) {
		super(options);
	}

	public filter(payload: ISearchPayload): Promise<ISearchResult<T>> {
		const http = ServiceLocator.injector.get(HttpClient);
		const endPoint = this.endPoint(this.serviceOptions.readInfo, 'byfilter');
		const usePost = this.usePost(this.serviceOptions.readInfo, true);
		const httpOption = this.evaluateParameterEnhanced(this.serviceOptions.readInfo, usePost, payload);

		return lastValueFrom(http.request<ISearchResult<T>>(usePost ? 'POST' : 'GET', this.serviceUrl + endPoint, httpOption));
	}

	public async filterEnhanced<PT extends object, RT>(payload: PT, onSuccess: (filtered: RT) => ISearchResult<T>): Promise<ISearchResult<T>> {
		const http = ServiceLocator.injector.get(HttpClient);
		const endPoint = this.endPoint(this.serviceOptions.readInfo, 'byfilter');
		const usePost = this.usePost(this.serviceOptions.readInfo, true);
		const httpOption = this.evaluateParameterEnhanced(this.serviceOptions.readInfo, usePost, payload);

		const rawResult = await lastValueFrom(http.request<RT>(usePost ? 'POST' : 'GET', this.serviceUrl + endPoint, httpOption));

		return onSuccess(rawResult);
	}

	public update(complete: U): Promise<U> {
		const http = ServiceLocator.injector.get(HttpClient);
		const endPoint = this.endPoint(this.serviceOptions.updateInfo, 'update');
		const httpOption = {
			...({body: complete})
		};

		return lastValueFrom(http.request<U>('POST', this.serviceUrl + endPoint, httpOption));
	}

	/**
	 * Delete single entity or array of entities
	 * @param entities
	 */
	public delete(entities: T | T[]): void {
		const http = ServiceLocator.injector.get(HttpClient);
		const endPoint = this.endPoint(this.serviceOptions.deleteInfo, 'delete');
		const httpOption = {
			...({body: entities})
		};

		http.request<T | T[]>('POST', this.serviceUrl + endPoint, httpOption).subscribe();
	}

}