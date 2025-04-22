/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Provides data about a server-side exception as received from the back-end.
 */
export interface IException {

	/**
	 * The full C# class name of the exception.
	 */
	readonly ClassName: string;

	/**
	 * Optionally, some additional exception data.
	 */
	readonly Data?: unknown;

	/**
	 * Some detailed information about the error.
	 */
	readonly ErrorDetail?: string;

	/**
	 * The brief error message.
	 */
	readonly ErrorMessage?: string;

	/**
	 * The method in which the exception occurred.
	 */
	readonly ExceptionMethod?: string;

	/**
	 * The internal error code.
	 */
	readonly HResult: number;

	/**
	 * An optional link to some additional documentation on the error.
	 */
	readonly HelpURL?: string;

	/**
	 * Information on the underlying exception, if any.
	 */
	readonly InnerException?: IException;

	/**
	 * The brief error message.
	 */
	readonly Message?: string;

	/**
	 * The stack index.
	 */
	readonly RemoteStackIndex: number;

	/**
	 * The remote stack-trace, if any.
	 */
	readonly RemoteStackTraceString?: string;

	/**
	 * The source where the error occurred.
	 */
	readonly Source?: string;

	/**
	 * The stack-trace, if any.
	 */
	readonly StackTraceString?: string;

	/**
	 * Windows error reporting information.
	 */
	readonly WatsonBuckets?: unknown;
}
