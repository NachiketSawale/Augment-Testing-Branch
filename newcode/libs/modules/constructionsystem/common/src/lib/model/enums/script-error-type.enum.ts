/*
 * Copyright(c) RIB Software GmbH
 */

export enum ScriptErrorType {
	All = 0, // No specified error level
	Error = 1, // Error level
	Warning = 2, // Warning level
	Info = 3, // Information level
	Debug = 4, // Program debug information level
	ExternalError = 5,
}
