/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { AddressEntity, TelephoneEntity } from '@libs/basics/shared';
import { IPrcCommonTotalEntity } from '../prccommon';
import { IPackage2HeaderCreateCompleteEntity } from './package-2header-create-entity.interface';



export interface IPrcPackageEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	CompanyFk: number;
	ProjectFk: number;
	PackageStatusFk: number;
	ConfigurationFk?: number;
	Code?: string;
	Description?: string;
	StructureFk?: number;
	CurrencyFk: number;
	ExchangeRate: number;
	Reference?: string;
	PlannedStart?: Date;
	PlannedEnd?: Date;
	ActualStart?: Date;
	ActualEnd?: Date;
	Quantity: number;
	UomFk: number;
	PackageTypeFk?: number;
	ClerkPrcFk?: number;
	ClerkReqFk?: number;
	TaxCodeFk: number;
	Remark?: string;
	Remark2?: string;
	AddressFk?: number;
	Remark3?: string;
	ActivityFk?: number;
	ScheduleFk?: number;
	IsLive: boolean;
	Userdefined1?: string;
	Userdefined2?: string;
	Userdefined3?: string;
	Userdefined4?: string;
	Userdefined5?: string;
	SearchPattern?: string;
	BusinessPartnerFk?: number;
	SubsidiaryFk?: number;
	CashProjectionFk?: number;
	AssetMasterFk?: number;
	PrcContractTypeFk?: number;
	SupplierFk?: number;
	UserDefinedDate1?: Date;
	UserDefinedDate2?: Date;
	UserDefinedDate3?: Date;
	UserDefinedDate4?: Date;
	UserDefinedDate5?: Date;
	BaselinePath?: string;
	BaselineUpdate?: Date;
	DateEffective: Date;
	BpdVatGroupFk?: number;
	BaselinePhase?: number;
	CountryFk?: number;
	RegionFk?: number;
	TelephoneNumberFk?: number;
	TelephoneTelefaxFk?: number;
	TelephoneMobileFk?: number;
	Email?: string;
	MdcControllingUnitFk?: number;
	OverallDiscount: number;
	OverallDiscountOc: number;
	OverallDiscountPercent: number;
	TextInfo?: string;
	DeadlineDate?: Date;
	DeadlineTime?: string;
	PrcCopyModeFk: number;
	DateDelivery?: Date;
	SalesTaxMethodFk: number;
	BaselineCOMgntUpdate?: Date;
	BaselineUpdateStatus?: string;
	PermissionObjectInfo?: string;
	ComCurrencyCode?: string;
	ComCurrencyDes?: string;
	TotalLeadTime: number;
	RequisitionCode?: string;
	RequisitionDescription?: string;
	RequisitionStatus?: string;
	RfqCode?: string;
	RfqDescription?: string;
	RfqStatus?: string;
	ContractCode?: string;
	ContractDescription?: string;
	BusinessPartnerName?: string;
	BusinessPartnerSubsidiaryName?: string;
	SupplierNumber?: string;
	ContractStatus?: string;
	ProjectStatusFk: number;
	BlobAction: number;
	TelephoneNumber?: TelephoneEntity;
	TelephoneNumberTelefax?: TelephoneEntity;
	TelephoneMobil?: TelephoneEntity;
	IsChangedStructure?: boolean;
	DealWithRateUpdateLater?: boolean;
	Package2HeaderComplete?: IPackage2HeaderCreateCompleteEntity;
	PrcTotalsDto?: IPrcCommonTotalEntity[];
	// Package2ClerkDto?: ClerkDataEntity[] ;
	NeedUpdateCUToItemsBoq?: boolean;
	AddressEntity?: AddressEntity;
	// custom in UI.
	isCreateByPackage?: boolean;
	VatPercent?: number;
	AllConfigurationFk?: number;
	originVatGroupFk?: number;
	DateAwardDeadline?: Date | string | null;
	DateRequested?: Date | string | null;

}
