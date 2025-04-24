/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Procurement baseline update code type
 */
export enum ProcurementBaseLineUpdateCode {
	NotChanged = 1,
	GetDataFromBaseLineSuccess = 2,
	GetDataFromBaseLineFailed,
	UpdateSuccess,
	UpdateFailed,
	NotFoundFileExported
}