/*
 * Copyright(c) RIB Software GmbH
 */
export interface IImportVCardData {
	N: string;
	familyName: string;
	givenName: string;
	additionalName: string;
	namePrefix: string;
	nameSuffix: string;
	FN: string;
	ORG: string;
}

export interface IVCardTestResult {
	fileName: string;
	charset: string;
	vCard?: IImportVCardData;
}

export interface IVCardsValidateResult {
	isValid: boolean;
	error: unknown;
}
