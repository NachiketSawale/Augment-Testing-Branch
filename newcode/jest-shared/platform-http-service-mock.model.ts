/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable, of, throwError, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CustomHttpRequest, DeleteHttpOptions, GetHttpOptions, PatchHttpOptions, PostHttpOptions, PutHttpOptions } from '../libs/platform/common/src/index';
import { IPlatformHttpService } from '../libs/platform/common/src/lib/services/platform-http-service.interface';
import { HttpRequestOptions } from '../libs/modules/basics/costcodes/src/lib/services/wizard/import-cost-codes.service';

type MockResponsePayload = { [key: string]: any } | string | number | boolean | null | MockResponsePayload[];
type MockResponse = MockResponsePayload | ((options: HttpRequestOptions) => MockResponsePayload);
type ValidParameters = { [key: string]: string[]; };  // Index signature

export class PlatformHttpServiceMock implements IPlatformHttpService {

	private readonly mockResponses = new Map<string, MockResponse>();
	private shouldThrowError: boolean = false;
	private delayMs: number = 0;  // Default delay

	private getKey(method: string, serviceUrl: string): string {
		if (serviceUrl.endsWith('/') && !serviceUrl.includes('?')) {
			serviceUrl = serviceUrl.substring(0, serviceUrl.length - 1);
		}
		return `${method.toLowerCase()}:${serviceUrl}`;
	}

	setMockResponse(method: 'GET' | 'POST' | 'DELETE' | 'UPDATE' | 'PUT' | string, serviceUrl: string, response: MockResponse) {
		const key = this.getKey(method, serviceUrl);
		this.mockResponses.set(key, response);
	}

	setShouldThrowError(shouldThrow: boolean) {
		this.shouldThrowError = shouldThrow;
	}

	setDelay(ms: number): void {
		this.delayMs = ms;
	}

	private validParameters: ValidParameters = {
		get: ['headers'],
		post: ['headers', 'context'],
		put: ['headers', 'context'],
		patch: ['headers', 'context'],
		delete: ['headers']
	};

	private validateParameters(method: string, httpOptions?: any): void {
		const validParams = this.validParameters[method.toLowerCase()];
		if (validParams && httpOptions && httpOptions.headers) {
			const keys = Object.keys(httpOptions.headers);
			const invalidParams = keys.filter(key => !validParams.includes(key));
			if (invalidParams.length > 0) {
				throw new Error(`Unsupported parameters: ${invalidParams.join(', ')}`);
			}
		}
	}

	private getMockResponse<T>(method: string, serviceUrl: string, httpOptions?: HttpRequestOptions): T {
		const key = this.getKey(method, serviceUrl);
		const response = this.mockResponses.get(key);
		if (!response) {
			throw new Error(`No mock response set for ${method.toUpperCase()} on ${serviceUrl}`);
		}

		if (typeof response === 'function') {
			return response(httpOptions ?? {});
		}

		return response as T;
	}

	// Observable methods
	get$<T>(serviceUrl: string, httpOptions?: GetHttpOptions): Observable<T> {
		try {
			this.validateParameters('get', httpOptions);
			return timer(this.delayMs).pipe(
				switchMap(() =>
					this.shouldThrowError ? throwError(() => new Error('Mock error occurred')) : of(this.getMockResponse<T>('get', serviceUrl, httpOptions)))
			);
		} catch (error) {
			return throwError(() => error);
		}
	}

	post$<T>(serviceUrl: string, payload: unknown, httpOptions?: PostHttpOptions): Observable<T> {
		try {
			this.validateParameters('post', httpOptions);
			return timer(this.delayMs).pipe(
				switchMap(() =>
					this.shouldThrowError ? throwError(() => new Error('Mock error occurred')) : of(this.getMockResponse<T>('post', serviceUrl, httpOptions))
				)
			);
		} catch (error) {
			return throwError(() => error);
		}
	}

	put$<T>(serviceUrl: string, payload: unknown, httpOptions?: PutHttpOptions): Observable<T> {
		try {
			this.validateParameters('put', httpOptions);
			return timer(this.delayMs).pipe(
				switchMap(() =>
					this.shouldThrowError ? throwError(() => new Error('Mock error occurred')) : of(this.getMockResponse<T>('put', serviceUrl, httpOptions))
				)
			);
		} catch (error) {
			return throwError(() => error);
		}
	}

	patch$<T>(serviceUrl: string, payload: unknown, httpOptions?: PatchHttpOptions): Observable<T> {
		try {
			this.validateParameters('patch', httpOptions);
			return timer(this.delayMs).pipe(
				switchMap(() =>
					this.shouldThrowError ? throwError(() => new Error('Mock error occurred')) : of(this.getMockResponse<T>('patch', serviceUrl, httpOptions))
				)
			);
		} catch (error) {
			return throwError(() => error);
		}
	}

	delete$<T>(serviceUrl: string, httpOptions?: DeleteHttpOptions): Observable<T> {
		try {
			this.validateParameters('delete', httpOptions);
			return timer(this.delayMs).pipe(
				switchMap(() =>
					this.shouldThrowError ? throwError(() => new Error('Mock error occurred')) : of(this.getMockResponse<T>('delete', serviceUrl, httpOptions))
				)
			);
		} catch (error) {
			return throwError(() => error);
		}
	}

	// Promise methods
	get<T>(serviceUrl: string, httpOptions?: GetHttpOptions): Promise<T> {
		return new Promise((resolve, reject) => {
			try {
				this.validateParameters('get', httpOptions)
				setTimeout(() => {
					if (this.shouldThrowError) {
						reject(new Error('Mock error occurred'));
					} else {
						resolve(this.getMockResponse<T>('get', serviceUrl, httpOptions));
					}
				}, this.delayMs);
			} catch (error) {
				reject(error);
			}
		});
	}

	post<T>(serviceUrl: string, payload: unknown, httpOptions?: PostHttpOptions): Promise<T> {
		return new Promise((resolve, reject) => {
			try {
				this.validateParameters('post', httpOptions);
				setTimeout(() => {
					if (this.shouldThrowError) {
						reject(new Error('Mock error occurred'));
					} else {
						resolve(this.getMockResponse<T>('post', serviceUrl, httpOptions));
					}
				}, this.delayMs);
			} catch (error) {
				reject(error);
			}
		});
	}

	put<T>(serviceUrl: string, payload: unknown, httpOptions?: PutHttpOptions): Promise<T> {
		return new Promise((resolve, reject) => {
			try {
				this.validateParameters('put', httpOptions);
				setTimeout(() => {
					if (this.shouldThrowError) {
						reject(new Error('Mock error occurred'));
					} else {
						resolve(this.getMockResponse<T>('put', serviceUrl, httpOptions));
					}
				}, this.delayMs);
			} catch (error) {
				reject(error);
			}
		});
	}

	patch<T>(serviceUrl: string, payload: unknown, httpOptions?: PatchHttpOptions): Promise<T> {
		return new Promise((resolve, reject) => {
			try {
				this.validateParameters('patch', httpOptions);
				setTimeout(() => {
					if (this.shouldThrowError) {
						reject(new Error('Mock error occurred'));
					} else {
						resolve(this.getMockResponse<T>('patch', serviceUrl, httpOptions));
					}
				}, this.delayMs);
			} catch (error) {
				reject(error);
			}
		});
	}

	delete<T>(serviceUrl: string, httpOptions?: DeleteHttpOptions): Promise<T> {
		return new Promise((resolve, reject) => {
			try {
				this.validateParameters('delete', httpOptions);
				setTimeout(() => {
					if (this.shouldThrowError) {
						reject(new Error('Mock error occurred'));
					} else {
						resolve(this.getMockResponse<T>('delete', serviceUrl, httpOptions));
					}
				}, this.delayMs);
			} catch (error) {
				reject(error);
			}
		});
	}

	request<T>(requestType: string, isBaseUrl: boolean, serviceUrl: string, httpOptions?: CustomHttpRequest): Promise<T> {
		return new Promise((resolve, reject) => {
			try {
				this.validateParameters(requestType.toLowerCase(), httpOptions);
				setTimeout(() => {
					if (this.shouldThrowError) {
						reject(new Error('Mock error occurred'));
					} else {
						switch (requestType.toUpperCase()) {
							case 'GET':
								resolve(this.getMockResponse<T>('get', serviceUrl));
								break;
							case 'POST':
								resolve(this.getMockResponse<T>('post', serviceUrl));
								break;
							case 'PUT':
								resolve(this.getMockResponse<T>('put', serviceUrl));
								break;
							case 'PATCH':
								resolve(this.getMockResponse<T>('patch', serviceUrl));
								break;
							case 'DELETE':
								resolve(this.getMockResponse<T>('delete', serviceUrl));
								break;
							default:
								reject(new Error(`Unsupported request type: ${requestType}`));
						}
					}
				}, this.delayMs);
			} catch (error) {
				reject(error);
			}
		});
	}
}