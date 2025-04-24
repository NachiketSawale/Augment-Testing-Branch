/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { LookupUrlParams, ILookupRequestOptions } from '../model/interfaces/lookup-http-cache.model';

/**
 * Service for making HTTP requests with caching mechanism where same ongoing requests are stored in a cache
 * till they are resolved so that they would not be requested repeatedly during this period.
 */
@Injectable({
	providedIn: 'root',
})
export class LookupHttpCacheService {
	/**
	 * HTTP client for making requests.
	 * @private
	 */
	private readonly http = inject(HttpClient);

	/**
	 * Configuration service for platform settings.
	 * @private
	 */
	private readonly configService = inject(PlatformConfigurationService);

	/**
	 * Cache to store ongoing requests.
	 * @private
	 */
	private readonly cache = new Map<string, Promise<unknown>>();

	/**
	 * Generates a unique key for the request based on the URL and options.
	 * @param url - The request URL.
	 * @param options - The request options.
	 * @returns The generated key.
	 * @private
	 */
	private generateKey(url: string, options?: ILookupRequestOptions): string {
		const params = options?.params ? JSON.stringify(options.params) : '';
		const body = options?.body ? JSON.stringify(options.body) : '';
		return `${url}:${params}:${body}`;
	}

	/**
	 * Makes a GET request with caching.
	 * @template T - The type of the response.
	 * @param url - The request URL.
	 * @param options - The request options.
	 * @returns A promise that resolves to the response.
	 */
	public async getWithCache<T>(url: string, options?: ILookupRequestOptions): Promise<T> {
		return this.fetchWithCache<T>('GET', url, options);
	}

	/**
	 * Makes a POST request with caching.
	 * @template T - The type of the response.
	 * @param url - The request URL.
	 * @param options - The request options.
	 * @returns A promise that resolves to the response.
	 */
	public async postWithCache<T>(url: string, options?: ILookupRequestOptions): Promise<T> {
		return this.fetchWithCache<T>('POST', url, options);
	}

	/**
	 * Fetches data with caching.
	 * @template T - The type of the response.
	 * @param method - The HTTP method.
	 * @param url - The request URL.
	 * @param options - The request options.
	 * @returns A promise that resolves to the response.
	 * @private
	 */
	public async fetchWithCache<T>(method: string, url: string, options?: ILookupRequestOptions): Promise<T> {
		const key = this.generateKey(url, options);

		// Check if request is already in progress
		if (this.cache.has(key)) {
			return this.cache.get(key) as Promise<T>;
		}

		// Create a new request and store its promise in the cache
		const promise = this.httpRequest<T>(method, url, options).finally(() => this.cache.delete(key)); // Remove the request after completion

		this.cache.set(key, promise);

		return promise;
	}

	/**
	 * Makes an HTTP request.
	 * @template T - The type of the response.
	 * @param method - The HTTP method.
	 * @param url - The request URL.
	 * @param options - The request options.
	 * @returns A promise that resolves to the response.
	 * @private
	 */
	private async httpRequest<T>(method: string, url: string, options?: ILookupRequestOptions): Promise<T> {
		return firstValueFrom(
			this.http.request<T>(method, this.configService.webApiBaseUrl + url, {
				...options,
				params: options?.params ? this.convertObjectToHttpParams(options?.params) : undefined,
			}),
		);
	}

	/**
	 * Converts an object to HTTP parameters.
	 * @param paramsObject - The object containing the parameters.
	 * @returns The HTTP parameters.
	 * @private
	 */
	private convertObjectToHttpParams(paramsObject: LookupUrlParams): HttpParams {
		return Object.keys(paramsObject).reduce((params, key) => {
			const value = paramsObject[key];

			if (value) {
				params.set(key, value);
			}

			return params;
		}, new HttpParams());
	}
}
