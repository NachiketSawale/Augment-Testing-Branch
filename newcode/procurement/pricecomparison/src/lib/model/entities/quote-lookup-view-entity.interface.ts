/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IQuoteLookupViewEntity {
	Id: number;
	DescriptionInfo: IDescriptionInfo;
	CompanyFk: number;
	ProjectFk?: number;
	Code: string;
	Description?: string;
	DateQuoted: Date;
	DateReceived?: Date;
	ExchangeRate: number;
	SearchPattern?: string;
	QuoteVersion: number;
	Remark?: string;
	UserDefined1?: string;
	UserDefined2?: string;
	UserDefined3?: string;
	UserDefined4?: string;
	StatusDescriptionInfo: IDescriptionInfo;
	UserDefined5?: string;
	BusinessPartnerName1?: string;
	BusinessPartnerName2?: string;
	BusinessPartnerFk: number;
	BusinessPartnerMatchCode?: string;
	SupplierCode?: string;
	SupplierDescription?: string;
	Currency?: string;
	SubsidiaryDescription?: string;
	SubsidiaryAddressCity?: string;
	SubsidiaryAddressStreet?: string;
	SubsidiaryAddressZipCode?: string;
	SubsidiaryAddressCountryISO2?: string;
	Icon?: number;
	RfqHeaderFk: number;
	QtnHeaderFk?: number;
	StatusFk: number;
}