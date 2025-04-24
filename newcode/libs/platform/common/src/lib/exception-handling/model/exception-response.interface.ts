/*
 * Copyright(c) RIB Software GmbH
 */

import { IException } from './exception.interface';

/**
 * Provides data about a response from the back-end that informs about an exception.
 */
export interface IExceptionResponse {

	/**
	 * The error code.
	 */
	readonly ErrorCode: number;

	/**
	 * The brief error message.
	 */
	readonly ErrorMessage: string;

	/**
	 * Some detailed information about the error.
	 */
	readonly ErrorDetail: string;

	/**
	 * Stack-trace information about the error, if available.
	 */
	readonly StackTrace?: string;

	/**
	 * The full exception object.
	 */
	readonly Exception: IException;
}
