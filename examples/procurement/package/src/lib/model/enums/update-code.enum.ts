/*
 * Copyright(c) RIB Software GmbH
 */

export enum UpdateCode {
	NotChanged = 1,
	GetDataFromBaseLineSuccess = 2,
	GetDataFromBaseLineFailed = 3,
	UpdateSuccess = 4,
	UpdateFailed = 5,
	NotFoundFileExported = 6
}
