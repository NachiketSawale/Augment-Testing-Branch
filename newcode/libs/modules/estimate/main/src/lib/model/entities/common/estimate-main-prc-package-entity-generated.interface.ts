/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IAddressEntity } from '@libs/ui/map';

export interface IPrcPackageEntityGenerated extends IEntityBase {
	/*
	 * ActivityFk
	 */
	ActivityFk?: number | null;

	/*
	 * ActualEnd
	 */
	ActualEnd?: string | null;

	/*
	 * ActualStart
	 */
	ActualStart?: string | null;

	/*
	 * AddressEntity
	 */
	AddressEntity?: IAddressEntity | null;

	/*
	 * AddressFk
	 */
	AddressFk?: number | null;

	/*
	 * AssetMasterFk
	 */
	AssetMasterFk?: number | null;

	/*
	 * BaselineCOMgntUpdate
	 */
	BaselineCOMgntUpdate?: string | null;

	/*
	 * BaselinePath
	 */
	BaselinePath?: string | null;

	/*
	 * BaselinePhase
	 */
	BaselinePhase?: number | null;

	/*
	 * BaselineUpdate
	 */
	BaselineUpdate?: string | null;

	/*
	 * BaselineUpdateStatus
	 */
	BaselineUpdateStatus?: string | null;

	/*
	 * BlobAction
	 */
	BlobAction?: number | null;

	/*
	 * BpdVatGroupFk
	 */
	BpdVatGroupFk?: number | null;

	/*
	 * BusinessPartnerFk
	 */
	BusinessPartnerFk?: number | null;

	/*
	 * BusinessPartnerName
	 */
	BusinessPartnerName?: string | null;

	/*
	 * BusinessPartnerSubsidiaryName
	 */
	BusinessPartnerSubsidiaryName?: string | null;

	/*
	 * CashProjectionFk
	 */
	CashProjectionFk?: number | null;

	/*
	 * ClerkPrcFk
	 */
	ClerkPrcFk?: number | null;

	/*
	 * ClerkReqFk
	 */
	ClerkReqFk?: number | null;

	/*
	 * Code
	 */
	Code: string;

	/*
	 * ComCurrencyCode
	 */
	ComCurrencyCode?: string | null;

	/*
	 * ComCurrencyDes
	 */
	ComCurrencyDes?: string | null;

	/*
	 * CompanyFk
	 */
	CompanyFk: number;

	/*
	 * ConfigurationFk
	 */
	ConfigurationFk?: number | null;

	/*
	 * Contract2PackageData
	 */
	//Contract2PackageData?: IPrcContract2PackageVEntity | null;

	/*
	 * ContractCode
	 */
	ContractCode?: string | null;

	/*
	 * ContractDescription
	 */
	//ContractDescription?: string | null;

	/*
	 * ContractStatus
	 */
	ContractStatus?: string | null;

	/*
	 * CountryFk
	 */
	CountryFk?: number | null;

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
	 * DeadlineDate
	 */
	DeadlineDate?: string | null;

	/*
	 * DeadlineTime
	 */
	DeadlineTime?: string | null;

	/*
	 * DealWithRateUpdateLater
	 */
	DealWithRateUpdateLater?: boolean | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * Email
	 */
	Email?: string | null;

	/*
	 * ExchangeRate
	 */
	ExchangeRate: number;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsChangedStructure
	 */
	IsChangedStructure?: boolean | null;

	/*
	 * IsLive
	 */
	IsLive: boolean;

	/*
	 * MainEventsDto
	 */
	//MainEventsDto?: IPrcPackageEventEntity[] | null;

	/*
	 * MainExtBidderDto
	 */
	//MainExtBidderDto?: IPrcPackage2ExtBidderEntity[] | null;

	/*
	 * MdcControllingUnitFk
	 */
	MdcControllingUnitFk?: number | null;

	/*
	 * NeedUpdateCUToItemsBoq
	 */
	NeedUpdateCUToItemsBoq?: boolean | null;

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
	 * Package2ClerkDto
	 */
	//Package2ClerkDto?: IClerkDataEntity[] | null;

	/*
	 * Package2HeaderComplete
	 */
	// Package2HeaderComplete?: Package2HeaderCreateComplete | null;

	/*
	 * PackageStatusFk
	 */
	PackageStatusFk: number;

	/*
	 * PackageTypeFk
	 */
	PackageTypeFk?: number | null;

	/*
	 * PermissionObjectInfo
	 */
	PermissionObjectInfo?: string | null;

	/*
	 * Pes2PackageData
	 */
	//Pes2PackageData?: IPrcPes2PackageVEntity | null;

	/*
	 * PlannedEnd
	 */
	PlannedEnd?: string | null;

	/*
	 * PlannedStart
	 */
	PlannedStart?: string | null;

	/*
	 * PrcContractTypeFk
	 */
	PrcContractTypeFk?: number | null;

	/*
	 * PrcCopyModeFk
	 */
	PrcCopyModeFk: number;

	/*
	 * PrcPackage2HeaderEntities
	 */
	//PrcPackage2HeaderEntities?: IPrcPackage2HeaderEntity[] | null;

	/*
	 * PrcPackagebudgetEntities
	 */
	// PrcPackagebudgetEntities?: IPrcPackageBudgetEntity[] | null;

	/*
	 * PrcPackagestatusEntity
	 */
	//PrcPackagestatusEntity?: IPrcPackageStatusEntity | null;

	/*
	 * PrcPackagetotalEntities
	 */
	//PrcPackagetotalEntities?: IPrcPackageTotalEntity[] | null;

	/*
	 * PrcPackagetypeEntity
	 */
	//PrcPackagetypeEntity?: IPrcPackageTypeEntity | null;

	/*
	 * PrcTotalsDto
	 */
	//PrcTotalsDto?: IPrcPackageTotalEntity[] | null;

	/*
	 * ProjectFk
	 */
	ProjectFk: number;

	/*
	 * ProjectStatusFk
	 */
	ProjectStatusFk?: number | null;

	/*
	 * Quantity
	 */
	Quantity: number;

	/*
	 * Quotation2PackageData
	 */
	//Quotation2PackageData?: IPrcQuotation2PackageVEntity | null;

	/*
	 * Reference
	 */
	Reference?: string | null;

	/*
	 * RegionFk
	 */
	RegionFk?: number | null;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * Remark2
	 */
	Remark2?: string | null;

	/*
	 * Remark3
	 */
	Remark3?: string | null;

	/*
	 * Requisition2PackageData
	 */
	//Requisition2PackageData?: IPrcRequisition2PackageVEntity | null;

	/*
	 * RequisitionCode
	 */
	RequisitionCode?: string | null;

	/*
	 * RequisitionDescription
	 */
	RequisitionDescription?: string | null;

	/*
	 * RequisitionStatus
	 */
	RequisitionStatus?: string | null;

	/*
	 * Rfq2PackageData
	 */
	//Rfq2PackageData?: IPrcRfq2PackageVEntity | null;

	/*
	 * RfqCode
	 */
	RfqCode?: string | null;

	/*
	 * RfqDescription
	 */
	RfqDescription?: string | null;

	/*
	 * RfqStatus
	 */
	RfqStatus?: string | null;

	/*
	 * SalesTaxMethodFk
	 */
	SalesTaxMethodFk: number;

	/*
	 * ScheduleFk
	 */
	ScheduleFk?: number | null;

	/*
	 * SearchPattern
	 */
	SearchPattern?: string | null;

	/*
	 * StructureFk
	 */
	StructureFk?: number | null;

	/*
	 * SubsidiaryFk
	 */
	SubsidiaryFk?: number | null;

	/*
	 * SupplierFk
	 */
	SupplierFk?: number | null;

	/*
	 * SupplierNumber
	 */
	SupplierNumber?: string | null;

	/*
	 * TaxCodeFk
	 */
	TaxCodeFk: number;

	/*
	 * TelephoneMobil
	 */
	//TelephoneMobil?: ITelephoneNumberEntity | null;

	/*
	 * TelephoneMobileFk
	 */
	TelephoneMobileFk?: number | null;

	/*
	 * TelephoneNumber
	 */
	//TelephoneNumber?: ITelephoneNumberEntity | null;

	/*
	 * TelephoneNumberFk
	 */
	TelephoneNumberFk?: number | null;

	/*
	 * TelephoneNumberTelefax
	 */
	//TelephoneNumberTelefax?: ITelephoneNumberEntity | null;

	/*
	 * TelephoneTelefaxFk
	 */
	TelephoneTelefaxFk?: number | null;

	/*
	 * TextInfo
	 */
	TextInfo?: string | null;

	/*
	 * Total
	 */
	//Total?: IPrcPackageTotalEntity | null;

	/*
	 * TotalLeadTime
	 */
	TotalLeadTime?: number | null;

	/*
	 * UomFk
	 */
	UomFk: number;

	/*
	 * UserDefinedDate1
	 */
	UserDefinedDate1?: string | null;

	/*
	 * UserDefinedDate2
	 */
	UserDefinedDate2?: string | null;

	/*
	 * UserDefinedDate3
	 */
	UserDefinedDate3?: string | null;

	/*
	 * UserDefinedDate4
	 */
	UserDefinedDate4?: string | null;

	/*
	 * UserDefinedDate5
	 */
	UserDefinedDate5?: string | null;

	/*
	 * Userdefined1
	 */
	Userdefined1?: string | null;

	/*
	 * Userdefined2
	 */
	Userdefined2?: string | null;

	/*
	 * Userdefined3
	 */
	Userdefined3?: string | null;

	/*
	 * Userdefined4
	 */
	Userdefined4?: string | null;

	/*
	 * Userdefined5
	 */
	Userdefined5?: string | null;
}
