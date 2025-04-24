/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification, IDescriptionInfo } from '@libs/platform/common';

export interface IQuote2RfqVEntity extends IEntityBase, IEntityIdentification {
	RfqHeaderFk: number;
	RfqDescription?: string | null;
	QtnHeaderFk: number;
	Code?: string | null;
	QtnDescription: string | null;
	QtnStatusFk: number;
	QtnValueNet?: number | null;
	QtnValueNetOc?: number | null;
	QtnValueTax?: number | null;
	QtnValueTaxOc?: number | null;
	QtnVersion: number;
	BasCompany: number;
	PrjProjectFk?: number | null;
	BasClerkPrcFk?: number | null;
	BasCurrencyFk?: number | null;
	ExchangeRate: number;
	BpName1?: string | null;
	BpName2?: string | null;
	BpName3?: string | null;
	BpName4?: string | null;
	IsMainAddress?: boolean | null;
	BasAddressFk?: number | null;
	Subsidiary?: string | null;
	SubsidiaryAddress?: string | null;
	SubsidiaryTelephone?: string | null;
	SubsidiaryTelefax?: string | null;
	SubsidiaryMobileNo?: string | null;
	BasPaymentTermFiFk?: number | null;
	PaymentTermPaFk?: number | null;
	SupplierCode?: string | null;
	SearchPattern?: string | null;
	DateQuoted: string;
	DateReceived?: string | null;
	DatePricefixing?: string | null;
	QtnTypeFk: number;
	BpdBusinessPartnerFk?: number | null;
	BpdSubsidiaryFk?: number | null;
	BasCompanyFk?: number | null;
	BusinesspartnerEmail?: string | null;
	PrcTotaltypeFk?: number | null;
	QtnStatus: IDescriptionInfo; // todo: DescriptionTranslateTypeDto
}