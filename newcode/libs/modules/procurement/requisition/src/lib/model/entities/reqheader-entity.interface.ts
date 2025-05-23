/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IBasicsClerkEntity, IBasicsCustomizeReqStatusEntity, ICompanyEntity } from '@libs/basics/interfaces';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';
import { AddressEntity } from '@libs/basics/shared';

export interface IReqHeaderEntity extends IEntityBase, IEntityIdentification {
	ReqStatusFk: number;
	CompanyFk: number;
	ProjectFk?: number | null;
	PackageFk?: number | null;
	TaxCodeFk: number;
	ClerkPrcFk?: number | null;
	ClerkReqFk?: number | null;
	BasCurrencyFk: number;
	ExchangeRate: number;
	ProjectChangeFk?: number | null;
	ReqHeaderFk?: number | null;
	HasChanges: boolean;
	MaterialCatalogFk?: number | null;
	PrcHeaderFk: number;
	Code?: string | null;
	Description?: string | null;
	SearchPattern?: string | null;
	DateReceived: Date;
	DateCanceled?: Date | null;
	DateRequired?: Date | null;
	ReqTypeFk: number;
	ControllingUnitFk?: number | null;
	BusinessPartnerFk?: number | null;
	SubsidiaryFk?: number | null;
	SupplierFk?: number | null;
	IncotermFk?: number | null;
	AddressFk?: number | null;
	Remark?: string | null;
	UserDefined1?: string | null;
	UserDefined2?: string | null;
	UserDefined3?: string | null;
	UserDefined4?: string | null;
	Package2HeaderFk?: number | null;
	UserDefined5?: string | null;
	BasPaymentTermFiFk?: number | null;
	BasPaymentTermPaFk?: number | null;
	PrcAwardmethodFk: number;
	PrcContracttypeFk: number;
	BasPaymentTermAdFk?: number | null;
	DateEffective: Date;
	BpdVatGroupFk?: number | null;
	OverallDiscount: number;
	OverallDiscountOc: number;
	OverallDiscountPercent: number;
	DeadlineDate?: Date | null;
	DeadlineTime?: unknown | null;
	DateDelivery?: Date | null;
	SalesTaxMethodFk: number;
	DatePriceFixing?: Date | null;
	BoqWicCatFk?: number | null;
	BoqWicCatBoqFk?: number | null;
	ReqStatus?: IBasicsCustomizeReqStatusEntity | null;
	PrcHeaderEntity?: IPrcHeaderEntity | null;
	AddressEntity?: AddressEntity | null;
	VatPercent: number;
	PrcItems?: unknown | null;
	GeneralItems?: unknown | null;
	ClerkPrcDescription?: string | null;
	ReqCompany?: ICompanyEntity | null;
	BasCurrencyDescription?: string | null;
	ClerkReqItem?: IBasicsClerkEntity | null;
	ClerkPrcItem?: IBasicsClerkEntity | null;
	TotalLeadTime: number;
	QuoteRequisition?: object | null;
	PermissionObjectInfo?: string | null;
	TotalQuantity: number;
	BlobAction: number;
	DealWithRateUpdateLater?: boolean | null;
	RfqCode?: string | null;
	RfqDescription?: string | null;
	ProjectStatusFk?: number | null;
	MaxBoqPackageId?: number | null;
	NeedUpdateUcToItemsBoqs?: boolean | null;
	// ReqTotals?: ReqTotalEntity[] | null;
	// ReqVariantEntities?: ReqVariantEntity[] | null;
	originVatGroupFk?: number | null;
	PlannedStart?: Date | null;
	PlannedEnd?: Date | null;
	DateAwardDeadline?: Date | null;
	DateRequested?: Date | null;
}
