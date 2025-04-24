/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { ICompanyICPartnerAccEntity } from './company-icpartner-acc-entity.interface';

export interface ICompanyICPartnerEntity extends IEntityBase {
	AccountCost?: string | null;
	AccountRevenue?: string | null;
	BasCompanyFk?: number | null;
	BasCompanyPartnerFk?: number | null;
	BpdCustomerFk?: number | null;
	BpdSupplierFk?: number | null;
	CompanyICPartnerAcc?: ICompanyICPartnerAccEntity | null;
	Id?: number | null;
	MainItemId?: number | null;
	MdcBillSchemaBilFk?: number | null;
	MdcBillSchemaInvFk?: number | null;
	MdcControllingunitIcFk?: number | null;
	PrcConfigurationBilFk?: number | null;
	PrcConfigurationInvFk?: number | null;
	ReadOnlyPreliminaryActual?: boolean | null;
	CompanyFk?: number | null;
}
