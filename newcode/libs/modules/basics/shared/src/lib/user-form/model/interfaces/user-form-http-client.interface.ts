/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents the callback to handle the response when call the public APIs via user form client.
 */
export type IUserFormHttpCallback = (response: IUserFormHttpResponse) => void;

/**
 * The response data when call the API via http client.
 */
export interface IUserFormHttpResponse {
	status: boolean;
	data?: unknown;
	error?: string;
}

/**
 * Represents a client used to call specified API url with current credentials from user form.
 */
export interface IUserFormHttpClient {
	get: (url: string, callback?: IUserFormHttpCallback) => void;
	post: (url: string, data?: object, callback?: IUserFormHttpCallback) => void;
	put: (url: string, data?: object, callback?: IUserFormHttpCallback) => void;
	patch: (url: string, data?: object, callback?: IUserFormHttpCallback) => void;
}