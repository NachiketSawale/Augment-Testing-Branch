/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Import result status code.
 */
export enum BasicsSharedImportStatusCode {
	Successful = 1,
	SuccessfulButWarning = 0,
	PartialSuccess = -1,
	Fail = -2,
}

/**
 * Import xml result status.
 */
export enum BasicsSharedImportStatus {
	Warning = 1,
	Success = 2,
	Error = 3,
}
