/*
 * Copyright(c) RIB Software GmbH
 */

import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IOrdHeaderEntityGenerated extends IEntityBase {

	/**
	 * AddressFk
	 */
	AddressFk?: number | null;

	/**
	 * AmountGross
	 */
	AmountGross?: number | null;

	/**
	 * AmountGrossOc
	 */
	AmountGrossOc?: number | null;

	/**
	 * AmountNet
	 */
	AmountNet?: number | null;

	/**
	 * AmountNetOc
	 */
	AmountNetOc?: number | null;

	/**
	 * ApprovedChangeOrderGrossOc
	 */
	ApprovedChangeOrderGrossOc?: number | null;

	/**
	 * ApprovedChangeOrderNetOc
	 */
	ApprovedChangeOrderNetOc?: number | null;

	/**
	 * BankFk
	 */
	BankFk?: number | null;

	/**
	 * BasSalesTaxMethodFk
	 */
	BasSalesTaxMethodFk?: number | null;

	/**
	 * BidHeaderCode
	 */
	BidHeaderCode?: string | null;

	/**
	 * BidHeaderDescription
	 */
	BidHeaderDescription?: IDescriptionInfo | null;

	/**
	 * BidHeaderFk
	 */
	BidHeaderFk?: number | null;

	/**
	 * BillToFk
	 */
	BillToFk?: number | null;

	/**
	 * BillingSchemaFk
	 */
	BillingSchemaFk?: number | null;

	/**
	 * BlobsBillToPartyFk
	 */
	BlobsBillToPartyFk?: number | null;

	/**
	 * BlobsFooterFk
	 */
	BlobsFooterFk?: number | null;

	/**
	 * BlobsHeaderFk
	 */
	BlobsHeaderFk?: number | null;

	/**
	 * BlobsReferenceFk
	 */
	BlobsReferenceFk?: number | null;

	/**
	 * BlobsSalutationFk
	 */
	BlobsSalutationFk?: number | null;

	/**
	 * BlobsSubjectFk
	 */
	BlobsSubjectFk?: number | null;

	/**
	 * BoqWicCatBoqFk
	 */
	BoqWicCatBoqFk?: number | null;

	/**
	 * BoqWicCatFk
	 */
	BoqWicCatFk?: number | null;

	/**
	 * BusinesspartnerBilltoFk
	 */
	BusinesspartnerBilltoFk?: number | null;

	/**
	 * BusinesspartnerFk
	 */
	BusinesspartnerFk?: number | null;

	/**
	 * ChildItems
	 */
	ChildItems?: IOrdHeaderEntity[] | null;

	/**
	 * ClerkFk
	 */
	ClerkFk?: number | null;

	/**
	 * ClobsBillToPartyFk
	 */
	ClobsBillToPartyFk?: number | null;

	/**
	 * ClobsFooterFk
	 */
	ClobsFooterFk?: number | null;

	/**
	 * ClobsHeaderFk
	 */
	ClobsHeaderFk?: number | null;

	/**
	 * ClobsReferenceFk
	 */
	ClobsReferenceFk?: number | null;

	/**
	 * ClobsSalutationFk
	 */
	ClobsSalutationFk?: number | null;

	/**
	 * ClobsSubjectFk
	 */
	ClobsSubjectFk?: number | null;

	/**
	 * Code
	 */
	Code?: string | null;

	/**
	 * Comment
	 */
	Comment?: string | null;

	/**
	 * CommentText
	 */
	CommentText?: string | null;

	/**
	 * CompanyFk
	 */
	CompanyFk?: number | null;

	/**
	 * CompanyResponsibleFk
	 */
	CompanyResponsibleFk?: number | null;

	/**
	 * ConfigurationFk
	 */
	ConfigurationFk?: number | null;

	/**
	 * ContactBilltoFk
	 */
	ContactBilltoFk?: number | null;

	/**
	 * ContactFk
	 */
	ContactFk?: number | null;

	/**
	 * ContractTypeFk
	 */
	ContractTypeFk?: number | null;

	/**
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/**
	 * CurrencyFk
	 */
	CurrencyFk?: number | null;

	/**
	 * CustomerBilltoFk
	 */
	CustomerBilltoFk?: number | null;

	/**
	 * CustomerFk
	 */
	CustomerFk?: number | null;

	/**
	 * DateEffective
	 */
	DateEffective?: string | null;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * EstHeaderCode
	 */
	EstHeaderCode?: string | null;

	/**
	 * EstHeaderDescription
	 */
	EstHeaderDescription?: IDescriptionInfo | null;

	/**
	 * EstHeaderFk
	 */
	EstHeaderFk?: number | null;

	/**
	 * ExchangeRate
	 */
	ExchangeRate?: number | null;

	/**
	 * Flag
	 */
	Flag?: string | null;

	/**
	 * FrameworkContractFk
	 */
	FrameworkContractFk?: number | null;

	/**
	 * HasChildren
	 */
	HasChildren?: boolean | null;

	/**
	 * Icon
	 */
	Icon?: string | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IndirectCostsBalancingConfigDetailFk
	 */
	IndirectCostsBalancingConfigDetailFk?: number | null;

	/**
	 * IsCanceled
	 */
	IsCanceled?: boolean | null;

	/**
	 * IsDays
	 */
	IsDays?: boolean | null;

	/**
	 * IsDiverseDebitorsAllowed
	 */
	IsDiverseDebitorsAllowed?: boolean | null;

	/**
	 * IsFramework
	 */
	IsFramework?: boolean | null;

	/**
	 * IsFreeItemsAllowed
	 */
	IsFreeItemsAllowed?: boolean | null;

	/**
	 * IsLive
	 */
	IsLive?: boolean | null;

	/**
	 * IsMainContractFramework
	 */
	IsMainContractFramework?: boolean | null;

	/**
	 * IsNotAccrualPrr
	 */
	IsNotAccrualPrr?: boolean | null;

	/**
	 * IsOrdered
	 */
	IsOrdered?: boolean | null;

	/**
	 * IsOrderedStatus
	 */
	IsOrderedStatus?: boolean | null;

	/**
	 * IsTransferred
	 */
	IsTransferred?: boolean | null;

	/**
	 * IsWarrenty
	 */
	IsWarrenty?: boolean | null;

	/**
	 * LanguageFk
	 */
	LanguageFk?: number | null;

	/**
	 * NotApprChangeOrderGrossOc
	 */
	NotApprChangeOrderGrossOc?: number | null;

	/**
	 * NotApprChangeOrderNetOc
	 */
	NotApprChangeOrderNetOc?: number | null;

	/**
	 * ObjUnitFk
	 */
	ObjUnitFk?: number | null;

	/**
	 * OrdHeaderCode
	 */
	OrdHeaderCode?: string | null;

	/**
	 * OrdHeaderDescription
	 */
	OrdHeaderDescription?: IDescriptionInfo | null;

	/**
	 * OrdHeaderEntities_OrdHeaderFk
	 */
	OrdHeaderEntities_OrdHeaderFk?: IOrdHeaderEntity[] | null;

	/**
	 * OrdHeaderEntity_OrdHeaderFk
	 */
	OrdHeaderEntity_OrdHeaderFk?: IOrdHeaderEntity | null;

	/**
	 * OrdHeaderFk
	 */
	OrdHeaderFk?: number | null;

	/**
	 * OrdStatusFk
	 */
	OrdStatusFk?: number | null;

	/**
	 * OrdWarrentyTypeFk
	 */
	OrdWarrentyTypeFk?: number | null;

	/**
	 * OrderDate
	 */
	OrderDate?: string | null;

	/**
	 * OrderNoCustomer
	 */
	OrderNoCustomer?: string | null;

	/**
	 * PaymentTermAdFk
	 */
	PaymentTermAdFk?: number | null;

	/**
	 * PaymentTermFiFk
	 */
	PaymentTermFiFk?: number | null;

	/**
	 * PaymentTermPaFk
	 */
	PaymentTermPaFk?: number | null;

	/**
	 * PermissionObjectInfo
	 */
	PermissionObjectInfo?: string | null;

	/**
	 * PlannedEnd
	 */
	PlannedEnd?: string | null;

	/**
	 * PlannedStart
	 */
	PlannedStart?: string | null;

	/**
	 * PrcIncotermFk
	 */
	PrcIncotermFk?: number | null;

	/**
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/**
	 * PrjChangeFk
	 */
	PrjChangeFk?: number | null;

	/**
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/**
	 * ProjectnoCustomer
	 */
	ProjectnoCustomer?: string | null;

	/**
	 * QtoHeaderCode
	 */
	QtoHeaderCode?: string | null;

	/**
	 * QtoHeaderDescription
	 */
	QtoHeaderDescription?: string | null;

	/**
	 * QtoIds
	 */
	QtoIds?: string | null;

	/**
	 * Remark
	 */
	Remark?: string | null;

	/**
	 * RestrictFrameworkContractCallOff
	 */
	RestrictFrameworkContractCallOff?: boolean | null;

	/**
	 * RevisionApplicable
	 */
	RevisionApplicable?: boolean | null;

	/**
	 * RubricCategoryFk
	 */
	RubricCategoryFk?: number | null;

	/**
	 * SearchPattern
	 */
	SearchPattern?: string | null;

	/**
	 * SubsidiaryBilltoFk
	 */
	SubsidiaryBilltoFk?: number | null;

	/**
	 * SubsidiaryFk
	 */
	SubsidiaryFk?: number | null;

	/**
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;

	/**
	 * Total
	 */
	Total?: number | null;

	/**
	 * TypeFk
	 */
	TypeFk?: number | null;

	/**
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/**
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/**
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/**
	 * UserDefined4
	 */
	UserDefined4?: string | null;

	/**
	 * UserDefined5
	 */
	UserDefined5?: string | null;

	/**
	 * UserDefinedDate01
	 */
	UserDefinedDate01?: string | null;

	/**
	 * UserDefinedDate02
	 */
	UserDefinedDate02?: string | null;

	/**
	 * UserDefinedDate03
	 */
	UserDefinedDate03?: string | null;

	/**
	 * UserDefinedDate04
	 */
	UserDefinedDate04?: string | null;

	/**
	 * UserDefinedDate05
	 */
	UserDefinedDate05?: string | null;

	/**
	 * VatGroupFk
	 */
	VatGroupFk?: number | null;

	/**
	 * WarrantyAmount
	 */
	WarrantyAmount?: number | null;

	/**
	 * WipCurrent
	 */
	WipCurrent?: number | null;

	/**
	 * WipDuration
	 */
	WipDuration?: number | null;

	/**
	 * WipFirst
	 */
	WipFirst?: string | null;

	/**
	 * WipFrom
	 */
	WipFrom?: string | null;

	/**
	 * WipTypeFk
	 */
	WipTypeFk?: number | null;

	/**
	 * WipUntil
	 */
	WipUntil?: string | null;

	/**
	 * timeStr
	 */
	timeStr?: object | null;
}
