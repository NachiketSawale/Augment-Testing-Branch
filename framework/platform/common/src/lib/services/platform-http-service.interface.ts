/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { CustomHttpRequest, DeleteHttpOptions, GetHttpOptions, PatchHttpOptions, PostHttpOptions, PutHttpOptions } from '../model/http-option/http-options.type';

export interface IPlatformHttpService {
	get$<T>(serviceUrl: string, httpOptions?: GetHttpOptions): Observable<T>;

	get<T>(serviceUrl: string, httpOptions?: GetHttpOptions): Promise<T>;

	post$<T>(serviceUrl: string, payload: unknown, httpOptions?: PostHttpOptions): Observable<T>;

	post<T>(serviceUrl: string, payload: unknown, httpOptions?: PostHttpOptions): Promise<T>;

	delete$<T>(serviceUrl: string, httpOptions?: DeleteHttpOptions): Observable<T>;

	delete<T>(serviceUrl: string, httpOptions?: DeleteHttpOptions): Promise<T>;


	put$<T>(serviceUrl: string, payload: unknown, httpOptions?: PutHttpOptions): Observable<T>;

	put<T>(serviceUrl: string, payload: unknown, httpOptions?: PutHttpOptions): Promise<T>;


	patch$<T>(serviceUrl: string, payload: unknown, httpOptions?: PatchHttpOptions): Observable<T>;

	patch<T>(serviceUrl: string, payload: unknown, httpOptions?: PatchHttpOptions): Promise<T>;

	request<T>(requestType: string, isBaseUrl: boolean, url: string, httpOptions?: CustomHttpRequest): Promise<T>;

}