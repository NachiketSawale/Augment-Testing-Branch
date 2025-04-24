/*
 * Copyright(c) RIB Software GmbH
 */
import { IExceptionResponse, IFileSelectControlResult } from '@libs/platform/common';
import { BasicsSharedImportStatusCode } from './basics-import-status.enums';

export type ImportErrorType = string | IExceptionResponse | undefined;

export interface IBasicsSharedImportDataEntity {
	file?: IFileSelectControlResult | IFileSelectControlResult[];
	dialogLoading?: boolean;
	uploadResult: IUploadResult[];
	importResult: IImportResult[];
}

export interface IUploadResult {
	uploaded: boolean;
	uploadKey: string;
}

export interface IImportResult {
	StatusCode: BasicsSharedImportStatusCode;
	InfoList?: string[];
	ImportObjects?: unknown[];
	LogFilePath?: string | null;

	FileName?: string;
	UploadKey?: string;
	Error?: ImportErrorType;
}
