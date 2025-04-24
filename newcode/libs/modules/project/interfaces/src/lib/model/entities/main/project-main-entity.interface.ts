/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */



import { IEntityBase } from '@libs/platform/common';
import { IAddressEntity } from '@libs/ui/map';

export interface IProjectEntity extends IEntityBase {

	Id: number;
	StatusFk: number;
	TypeFk: number;
	ProjectNo: string;
	ProjectIndex: number;
	ProjectName: string;
	ProjectName2: string;
	CatalogConfigTypeFk?: number | null;
	CatalogConfigFk: number;
	CurrencyFk: number;
	CompanyFk: number;
	ClerkFk: number;
	ClerkAddress: string;
	ClerkEmail: string;
	ClerkMobileNumber: string;
	ClerkTelephoneNumber: string;
	CompanyResponsibleFk: number;
	StartDate: Date;
	EndDate?: Date | null;
	MainProject: number;
	ProjectMainFk?: number | null;
	IsLive: boolean;
	RubricCategoryFk: number;
	GroupFk: number;
	BusinessUnitFk?: number | null;
	ContractTypeFk?: number | null;
	ContractNo: string;
	BusinessPartnerFk?: number | null;
	SubsidiaryFk?: number | null;
	ContactFk?: number | null;
	CustomerFk?: number | null;
	PaymentTermPaFk?: number | null;
	PaymentTermFiFk?: number | null;
	BillingSchemaFk?: number | null;
	CustomerGroupFk?: number | null;
	RealEstateFk?: number | null;
	AddressFk?: number | null;
	TelephoneNumberFk?: number | null;
	TelephoneTelefaxFk?: number | null;
	TelephoneMobilFk?: number | null;
	Email: string;
	CountryFk?: number | null;
	RegionFk?: number | null;
	DateReceipt?: Date;
	ClosingDatetime?: Date | null;
	ClosingLocation: string;
	PlannedAwardDate?: Date | null;
	TenderDate?: Date | null;
	PublicationDate?: Date | null;
	TenderRemark: string;
	WICFk?: number | null;
	CallOffNo: string;
	CallOffDate?: Date | null;
	CallOffRemark: string;
	ProjectDescription: string;
	Remark: string;
	ProjectPath: string;
	ProjectDocPath: string;
	SearchPattern: string;
	HandoverDate?: Date | null;
	WarrentyStart?: Date | null;
	WarrentyEnd?: Date | null;
	WarrentyRemark: string;
	ClassificationFk?: number | null;
	WorkCategoryFk?: number | null;
	AssetMasterFk?: number | null;
	ProjectContextFk?: number | null;
	BudgetCodeFk?: number | null;
	Matchcode: string;
	CalendarFk?: number | null;
	InternetWebCam: string;
	Distance?: number | null;
	Overnight: string;
	LanguageContractFk?: number | null;
	ProjectIndexAlpha: string;
	ControllingUnitTemplateFk?: number | null;
	ControltemplateFk?: number | null;
	BasBlobsFk?: number | null;
	Userdefined1: string;
	Userdefined2: string;
	Userdefined3: string;
	Userdefined4: string;
	Userdefined5: string;
	IsAdministration: boolean;
	IsTemplate: boolean;
	IsInterCompany: boolean;
	CheckPermission: boolean;
	PrjContentFk?: number | null;
	PrjContentTypeFk?: number | null;
	DateEffective: Date;
	RubricCatLocationFk?: number | null;
	PrjCategoryFk?: number | null;
	PrjClassificationFk?: number | null;
	PrjKindFk?: number | null;
	RubricCategorySalesFk?: number | null;
	QuantityControlFk: number;
	IsCompletePerformance: boolean;
	RubricCategoryControllingUnitFk?: number | null;
	ValidityPeriod?: number | null;
	ProjectOriginFk?: number | null;
	ValidityDate?: Date | null;
	ProjectModeFk: number;
	ProjectGroupFk: number;
	AlternativeNo?: number | null;
	AlternativeDescription: string;
	AlternativeRemark: string;
	ProjectLongNo: string;

	AddressEntity?: IAddressEntity | null;
}
