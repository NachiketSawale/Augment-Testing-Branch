/*
 * Copyright (c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom, Observable } from 'rxjs';

import { PlatformConfigurationService } from './platform-configuration.service';
import { CustomHttpRequest, DeleteHttpOptions, GetHttpOptions, PatchHttpOptions, PostHttpOptions, PutHttpOptions } from '../model/http-option/http-options.type';
import { IPlatformHttpService } from './platform-http-service.interface';

/**
 * Get the http action method to handling the request and response activity
 */
@Injectable({
	providedIn: 'root',
})
export class PlatformHttpService implements IPlatformHttpService {
	/**
	 * Inject the HttpClient
	 */
	private readonly httpClient = inject(HttpClient);

	/**
	 * Inject the PlatformConfigurationService
	 */
	private readonly configService = inject(PlatformConfigurationService);

	/**
	 *  Access the Get Api from Server
	 *
	 * @param   serviceUrl endpoint of serviceUrl
	 * @param   httpOptions configure HttpOption
	 * @returns return the Observable
	 */
	public get$<T>(serviceUrl: string, httpOptions?: GetHttpOptions): Observable<T> {
		const actualUrl = this.configService.webApiBaseUrl + serviceUrl;
		return httpOptions ? this.httpClient.get<T>(actualUrl, httpOptions) : this.httpClient.get<T>(actualUrl);
	}

	/**
	 *  Access the Get Api from Server
	 *
	 * @param   serviceUrl endpoint of serviceUrl
	 * @param   httpOptions configure HttpOption
	 * @returns return the Promise
	 */
	public get<T>(serviceUrl: string, httpOptions?: GetHttpOptions): Promise<T> {
		return lastValueFrom(this.get$(serviceUrl, httpOptions));
	}

	/**
	 *  Access the Post Api from Server
	 *
	 * @param   serviceUrl endpoint of serviceUrl
	 * @param   payload payload of Post
	 * @param   httpOptions configure HttpOption
	 * @returns return the Observable
	 */
	public post$<T>(serviceUrl: string, payload: unknown, httpOptions?: PostHttpOptions): Observable<T> {
		const actualUrl = this.configService.webApiBaseUrl + serviceUrl;

		return httpOptions ? this.httpClient.post<T>(actualUrl, payload, httpOptions) : this.httpClient.post<T>(actualUrl, payload);
	}

	/**
	 *  Access the Post Api from Server
	 *
	 * @param   serviceUrl endpoint of serviceUrl
	 * @param   payload payload of Post
	 * @param   httpOptions configure HttpOption
	 * @returns return the Promise
	 */
	public post<T>(serviceUrl: string, payload: unknown, httpOptions?: PostHttpOptions): Promise<T> {
		return lastValueFrom(this.post$(serviceUrl, payload, httpOptions));
	}

	/**
	 *  Access the Delete Api from Server
	 *
	 * @param   serviceUrl endpoint of serviceUrl
	 * @param   httpOptions configure HttpOption
	 * @returns return the Observable
	 */
	public delete$<T>(serviceUrl: string, httpOptions?: DeleteHttpOptions): Observable<T> {
		const actualUrl = this.configService.webApiBaseUrl + serviceUrl;

		return httpOptions ? this.httpClient.delete<T>(actualUrl, httpOptions) : this.httpClient.delete<T>(actualUrl);
	}

	/**
	 *  Access the Delete Api from Server
	 *
	 * @param   serviceUrl endpoint of serviceUrl
	 * @param   httpOptions configure HttpOption
	 * @returns return the Promise
	 */
	public delete<T>(serviceUrl: string, httpOptions?: DeleteHttpOptions): Promise<T> {
		return lastValueFrom(this.delete$(serviceUrl, httpOptions));
	}

	/**
	 *  Access the Put Api from Server
	 *
	 * @param   serviceUrl endpoint of serviceUrl
	 * @param   payload payload of Put
	 * @param   httpOptions configure HttpOption
	 * @returns return the Observable
	 */
	public put$<T>(serviceUrl: string, payload: unknown, httpOptions?: PutHttpOptions): Observable<T> {
		const actualUrl = this.configService.webApiBaseUrl + serviceUrl;

		return httpOptions ? this.httpClient.put<T>(actualUrl, payload, httpOptions) : this.httpClient.put<T>(actualUrl, payload);
	}

	/**
	 *  Access the Put Api from Server
	 *
	 * @param   serviceUrl endpoint of serviceUrl
	 * @param   payload payload of Put
	 * @param   httpOptions configure HttpOption
	 * @returns return the Promise
	 */
	public put<T>(serviceUrl: string, payload: unknown, httpOptions?: PutHttpOptions): Promise<T> {
		return lastValueFrom(this.put$(serviceUrl, payload, httpOptions));
	}

	/**
	 *  Access the patch Api from Server
	 *
	 * @param  serviceUrl endpoint of serviceUrl
	 * @param  payload payload of patch
	 * @param  httpOptions configure HttpOption
	 * @returns return the Observable
	 */
	public patch$<T>(serviceUrl: string, payload: unknown, httpOptions?: PatchHttpOptions): Observable<T> {
		const actualUrl = this.configService.webApiBaseUrl + serviceUrl;

		return httpOptions ? this.httpClient.patch<T>(actualUrl, payload, httpOptions) : this.httpClient.patch<T>(actualUrl, payload);
	}

	/**
	 *  Access the patch Api from Server
	 *
	 * @param   serviceUrl endpoint of serviceUrl
	 * @param   payload payload of patch
	 * @param   httpOptions configure HttpOption
	 * @returns return the Promise
	 */
	public patch<T>(serviceUrl: string, payload: unknown, httpOptions?: PatchHttpOptions): Promise<T> {
		return lastValueFrom(this.patch$(serviceUrl, payload, httpOptions));
	}

	/**
	 * A generic function to fetch data based on custom request param.
	 * @param requestType GET, POST, DELETE.
	 * @param isBaseUrl : This flag indicates if the "url" shall be concatenated by webApiBaseUrl or not.
	 * @param url : It could be base url or endpoint url.
	 * @param httpOptions : Custom http options.
	 * @returns
	 */
	public request(requestType: string, isBaseUrl: boolean, url: string, httpOptions?: CustomHttpRequest) {
		return isBaseUrl ? lastValueFrom(this.httpClient.request(requestType, this.configService.webApiBaseUrl + url, httpOptions)) : lastValueFrom(this.httpClient.request(requestType, url, httpOptions));
	}
}
