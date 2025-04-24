/*
 * Copyright(c) RIB Software GmbH
 */
export interface IQtoImportResponse {
	XmlImport?: boolean;
	WarningMessage?: string;
	DetailTotal?: number;
	timeStr?: string;
	existAddressList?: string[];
	errorQtoAddrssRange?: boolean;
	errorQtosCode?: string[];
}
