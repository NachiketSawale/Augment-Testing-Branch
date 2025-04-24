/*
 * Copyright(c) RIB Software GmbH
 */
import { IFileSelectControlResult } from '@libs/platform/common';

export interface IImportPackageFromRow {
	FileName: IFileSelectControlResult;
	PrjProjectFk: number;
	StructureFk: number;
	ConfigurationFk: number;
}

export interface IImportPackageModalOptions {
	dialogLoading: boolean;
	oKBtnRequirement: boolean;
	isError: boolean;
	errorDetail: string;
}
