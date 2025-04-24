/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase} from '@libs/platform/common';

/**
 * TaxCodeMatrix dto
 */
export interface TaxCodeMatrixDto extends IEntityBase {
	Id: number;
	Code: string;
	VatPercent: number;
	MdcTaxCodeFk: number;
	BpdVatgroupFk: number;
	BasVatclauseFk?: number;
	BasVatcalculationtypeFk: number;
	TaxCategory: string;
	DescriptionInfo?: IDescriptionInfo;
	UserDefined1: string;
	UserDefined2: string;
	UserDefined3: string;
}