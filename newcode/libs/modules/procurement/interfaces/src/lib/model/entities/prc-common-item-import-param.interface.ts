/*
 * Copyright(c) RIB Software GmbH
 */

export interface IPrcCommonItemImportParam {
	PrcHeaderFk: number | null | undefined;
	BpdVatGroupFk: number | null | undefined;
	HeaderTaxCodeFk: number | null | undefined;
	MainId: number | null | undefined;
	moduleName: string;
	SubMainId?: number;
}