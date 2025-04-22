/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';

export interface IQuoteHeaderEntity extends IEntityBase, IEntityIdentification {
	/*
	 * AssetMasterCode
	 */
	AssetMasterCode?: string | null;

	/*
	 * AssetMasterDescription
	 */
	AssetMasterDescription?: string | null;

	/*
	 * BillingSchemaFinal
	 */
	BillingSchemaFinal?: number | null;

	/*
	 * BillingSchemaFinalOC
	 */
	BillingSchemaFinalOC?: number | null;

	/*
	 * BillingSchemaFk
	 */
	BillingSchemaFk?: number | null;

	/*
	 * BoqWithMaxPackageId
	 */
	BoqWithMaxPackageId?: number | null;

	/*
	 * BpdVatGroupFk
	 */
	BpdVatGroupFk?: number | null;

	/*
	 * BusinessPartnerFk
	 */
	BusinessPartnerFk: number;

	/*
	 * ClerkPrcFk
	 */
	ClerkPrcFk?: number | null;

	/*
	 * ClerkReqFk
	 */
	ClerkReqFk?: number | null;

	/*
	 * Co2ProjectTotal
	 */
	Co2ProjectTotal?: number | null;

	/*
	 * Co2SourceTotal
	 */
	Co2SourceTotal?: number | null;

	/*
	 * Code
	 */
	Code: string;

	/*
	 * Company
	 */
	Company?: object | null;

	/*
	 * CompanyFk
	 */
	CompanyFk: number;

	/*
	 * Currency
	 */
	Currency?: object | null;

	/*
	 * CurrencyFk
	 */
	CurrencyFk: number;

	/*
	 * DateDelivery
	 */
	DateDelivery?: string | null;

	/*
	 * DateEffective
	 */
	DateEffective: string;

	/*
	 * DatePricefixing
	 */
	DatePricefixing?: string | null;

	/*
	 * DateQuoted
	 */
	DateQuoted: string;

	/*
	 * DateReceived
	 */
	DateReceived?: string | null;

	/*
	 * DealWithRateUpdateLater
	 */
	DealWithRateUpdateLater?: boolean | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * EvaluationCompleteDto
	 */
	EvaluationCompleteDto?: object | null;

	/*
	 * EvaluationDto
	 */
	EvaluationDto?: object | null;

	/*
	 * EvaluationFk
	 */
	EvaluationFk?: number | null;

	/*
	 * EvaluationSchemaFk
	 */
	EvaluationSchemaFk?: number | null;

	/*
	 * ExchangeRate
	 */
	ExchangeRate: number;

	/*
	 * ExtendedDate
	 */
	ExtendedDate?: string | null;

	/*
	 * ExternalCode
	 */
	ExternalCode?: string | null;

	/*
	 * Gross
	 */
	Gross?: number | null;

	/*
	 * GrossOc
	 */
	GrossOc?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IdealQtnBusinessPartnerFk
	 */
	IdealQtnBusinessPartnerFk?: number | null;

	/*
	 * IncotermFk
	 */
	IncotermFk?: number | null;

	/*
	 * IsBidderDeniedRequest
	 */
	IsBidderDeniedRequest?: boolean | null;

	/*
	 * IsCreateByMaterials
	 */
	IsCreateByMaterials?: boolean | null;

	/*
	 * IsExcluded
	 */
	IsExcluded: boolean;

	/*
	 * IsIdealBidder
	 */
	IsIdealBidder: boolean;

	/*
	 * IsShortlisted
	 */
	IsShortlisted: boolean;

	/*
	 * IsValidated
	 */
	IsValidated: boolean;

	/*
	 * NetTotal
	 */
	NetTotal?: number | null;

	/*
	 * OverallDiscount
	 */
	OverallDiscount: number;

	/*
	 * OverallDiscountOc
	 */
	OverallDiscountOc: number;

	/*
	 * OverallDiscountPercent
	 */
	OverallDiscountPercent: number;

	/*
	 * PackageDeliveryAddress
	 */
	PackageDeliveryAddress?: string | null;

	/*
	 * PackageDescription
	 */
	PackageDescription?: string | null;

	/*
	 * PackageFk
	 */
	PackageFk?: number | null;

	/*
	 * PackageNumber
	 */
	PackageNumber?: string | null;

	/*
	 * PackageTextInfo
	 */
	PackageTextInfo?: string | null;

	/*
	 * PaymentTermAdFk
	 */
	PaymentTermAdFk?: number | null;

	/*
	 * PaymentTermFiFk
	 */
	PaymentTermFiFk?: number | null;

	/*
	 * PaymentTermPaFk
	 */
	PaymentTermPaFk?: number | null;

	/*
	 * PermissionObjectInfo
	 */
	PermissionObjectInfo?: string | null;

	/*
	 * PrcAwardMethodFk
	 */
	PrcAwardMethodFk?: number | null;

	/*
	 * PrcConfigurationFk
	 */
	PrcConfigurationFk: number;

	/*
	 * PrcContractTypeFk
	 */
	PrcContractTypeFk?: number | null;

	/*
	 * PrcHeaderFk
	 */
	PrcHeaderFk?: number | null;

	/*
	 * PrcStructureCode
	 */
	PrcStructureCode?: string | null;

	/*
	 * PrcStructureDescription
	 */
	PrcStructureDescription?: string | null;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/*
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/*
	 * ProjectStatusFk
	 */
	ProjectStatusFk?: number | null;

	/*
	 * QtnHeaderFk
	 */
	QtnHeaderFk?: number | null;

	/*
	 * QtnTotalEntities
	 */
	QtnTotalEntities?: object[] | null;

	/*
	 * QuoteVersion
	 */
	QuoteVersion: number;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * ReqHeaders
	 */
	ReqHeaders?: object[] | null;

	/*
	 * RequisitonProjectFk
	 */
	RequisitonProjectFk?: number | null;

	/*
	 * RfqHeaderFk
	 */
	RfqHeaderFk: number;

	/*
	 * RubricCategoryFk
	 */
	RubricCategoryFk?: number | null;

	/*
	 * SalesTaxMethodFk
	 */
	SalesTaxMethodFk: number;

	/*
	 * StatusFk
	 */
	StatusFk: number;

	/*
	 * SubsidiaryFk
	 */
	SubsidiaryFk?: number | null;

	/*
	 * SupplierFk
	 */
	SupplierFk?: number | null;

	/*
	 * TotalLeadTime
	 */
	TotalLeadTime?: number | null;

	/*
	 * TypeFk
	 */
	TypeFk: number;

	/*
	 * UpdateWithQuoteData
	 */
	UpdateWithQuoteData?: boolean | null;

	/*
	 * UpdateWithReqData
	 */
	UpdateWithReqData?: boolean | null;

	/*
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/*
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/*
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/*
	 * UserDefined4
	 */
	UserDefined4?: string | null;

	/*
	 * UserDefined5
	 */
	UserDefined5?: string | null;

	/*
	 * UserDefinedDate01
	 */
	UserDefinedDate01?: string | null;

	/*
	 * ValueNet
	 */
	ValueNet?: number | null;

	/*
	 * ValueNetFinal
	 */
	ValueNetFinal?: number | null;

	/*
	 * ValueNetOc
	 */
	ValueNetOc?: number | null;

	/*
	 * ValueTax
	 */
	ValueTax?: number | null;

	/*
	 * ValueTaxOc
	 */
	ValueTaxOc?: number | null;

	/*
	 * materialIds
	 */
	materialIds?: number[] | null;

	/*
	 * materialIds
	 */
	PrcHeaderEntity?: IPrcHeaderEntity;

	TaxCodeFk?: number;

	/*
  * DeadlineDate
  */
	DeadlineDate?: Date | null;

	/*
  * DeadlineTime
  */
	DeadlineTime?: string | null;

	/*
  * DateAwardDeadline
  */
	DateAwardDeadline?: Date | null;
}
