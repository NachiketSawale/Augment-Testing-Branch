/*
 * Copyright(c) RIB Software GmbH
 */
import { LookupSimpleEntity } from '@libs/ui/common';

export interface IQtoExportConfig {
	Basic: IQtoExportBasicConfig;
	Basic2: IQtoExportBasic2Config;
	BoqCrb: IQtoExportBoqCrbConfig;
}

export interface IQtoExportBasicConfig {
	QtoScope: number;
	RebFormatId: number;
}

export interface IQtoExportBasic2Config {
	IncludeSheets: boolean;
	IncludeQtoDetail: boolean;
	IncludeGenerateDate: boolean;
}

export interface IQtoExportBoqCrbConfig {
	CrbFormatId: number;
	CrbLanguage: number;
	CrbDocumentType: number;
	CrbDocumentTypeItem?: LookupSimpleEntity[];
	QtoExportBoqCrbOption: IQtoExportBoqCrbOption;
	GridData: IRangesEntity[];
}

export interface IQtoExportBoqCrbOption {
	OptionPrices: boolean;
	OptionPriceConditions: boolean;
	OptionQuantities: boolean;
}

export interface IRangesEntity {
	Id: string;
	IsMarked: boolean;
	Name: string | null;
	Children: IRangesEntity[];
}

export interface ICrbDocType {
	CurrentCrbDocumentType: string;
	ValidCrbDocumentTypes: string[];
}
