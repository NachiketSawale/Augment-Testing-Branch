/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyTransactionEntity } from '@libs/basics/interfaces';


export interface AccrualTransactionWizardOptions {
	contextUrlSuffix: string;
	translateSource?: string;
}

export interface ITransactionContextBaseEntity {
	TransactionTypeId: number;
	CompanyPeriodId?: number;
	CompanyYearId?: number;
	EffectiveDate: Date | string;
	VoucherNo?: string | null;
	AccrualModeId: number;
	PostingNarrative?: string | null;
	Comment?: string | null;
	Abbreviation?: string | null;
	UseCompanyNumber: boolean;
}

export interface IAccountValidationEntity {
	Id: number;
	AccountCode: string;
	OffsetAccountCode: string;
	HeaderCode: string;
	HeaderDescription: string;
	StructureCode: string;
	ErrorMsg: string;
}

export interface ICreateTransactionResponse {
	SuccessCount: number;
	AccountValidations?: IAccountValidationEntity[];
	Transactions?: ICompanyTransactionEntity[];
}


