/*
 * Copyright(c) RIB Software GmbH
 */

import { IDocumentEntity } from './document-entity.interface';
import { IWipAccrualEntity } from './wip-accrual-entity.interface';
import { IWipBillingschemaEntity } from './wip-billingschema-entity.interface';
import { IWipBoqEntity } from './wip-boq-entity.interface';
import { IWipCommentEntity } from './wip-comment-entity.interface';
import { IGeneralsEntity } from './generals-entity.interface';
import { IWipStatusHistoryEntity } from './wip-status-history-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IWipStatusEntity } from './wip-status-entity.interface';

export interface IWipHeaderEntityGenerated extends IEntityBase {

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
	AmountNet: number;

	/**
	 * AmountNetOc
	 */
	AmountNetOc: number;

	/**
	 * BasSalesTaxMethodFk
	 */
	BasSalesTaxMethodFk: number;

	/**
	 * BillingSchemaFk
	 */
	BillingSchemaFk: number;

	/**
	 * BusinesspartnerFk
	 */
	BusinesspartnerFk: number;

	/**
	 * ClerkFk
	 */
	ClerkFk: number;

	/**
	 * Code
	 */
	Code: string;

	/**
	 * CommentText
	 */
	CommentText?: string | null;

	/**
	 * CompanyFk
	 */
	CompanyFk: number;

	/**
	 * CompanyResponsibleFk
	 */
	CompanyResponsibleFk: number;

	/**
	 * ConfigurationFk
	 */
	ConfigurationFk?: number | null;

	/**
	 * ContactFk
	 */
	ContactFk?: number | null;

	/**
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/**
	 * CurrencyFk
	 */
	CurrencyFk: number;

	/**
	 * CustomerFk
	 */
	CustomerFk?: number | null;

	/**
	 * DateEffective
	 */
	DateEffective: string;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * DocumentDate
	 */
	DocumentDate?: string | null;

	/**
	 * DocumentEntities
	 */
	DocumentEntities?: IDocumentEntity[] | null;

	/**
	 * ExchangeRate
	 */
	ExchangeRate: number;

	/**
	 * FactorDJC
	 */
	FactorDJC?: number | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IsBilled
	 */
	IsBilled: boolean;

	/**
	 * IsCanceled
	 */
	IsCanceled: boolean;

	/**
	 * IsContractRelated
	 */
	IsContractRelated?: boolean | null;

	/**
	 * IsDiverseDebitorsAllowed
	 */
	IsDiverseDebitorsAllowed?: boolean | null;

	/**
	 * IsMulticontract
	 */
	IsMulticontract: boolean;

	/**
	 * IsNotAccrual
	 */
	IsNotAccrual: boolean;

	/**
	 * IsOrderedStatus
	 */
	IsOrderedStatus?: boolean | null;

	/**
	 * IsReadOnly
	 */
	IsReadOnly?: boolean | null;

	/**
	 * LanguageFk
	 */
	LanguageFk: number;

	/**
	 * ObjUnitFk
	 */
	ObjUnitFk?: number | null;

	/**
	 * OrdHeaderFk
	 */
	OrdHeaderFk: number;

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
	 * PerformedFrom
	 */
	PerformedFrom?: string | null;

	/**
	 * PerformedTo
	 */
	PerformedTo?: string | null;

	/**
	 * PermissionObjectInfo
	 */
	PermissionObjectInfo?: string | null;

	/**
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/**
	 * ProjectFk
	 */
	ProjectFk: number;

	/**
	 * QtoHeaderFk
	 */
	QtoHeaderFk?: number | null;

	/**
	 * Remark
	 */
	Remark?: string | null;

	/**
	 * RubricCategoryFk
	 */
	RubricCategoryFk: number;

	/**
	 * SearchPattern
	 */
	SearchPattern?: string | null;

	/**
	 * SubsidiaryFk
	 */
	SubsidiaryFk: number;

	/**
	 * TaxCodeFk
	 */
	TaxCodeFk: number;

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
	 * WipAccrualEntities
	 */
	WipAccrualEntities?: IWipAccrualEntity[] | null;

	/**
	 * WipBillingschemaEntities
	 */
	WipBillingschemaEntities?: IWipBillingschemaEntity[] | null;

	/**
	 * WipBoqEntities
	 */
	WipBoqEntities?: IWipBoqEntity[] | null;

	/**
	 * WipCommentEntities
	 */
	WipCommentEntities?: IWipCommentEntity[] | null;

	/**
	 * WipGeneralsEntities
	 */
	WipGeneralsEntities?: IGeneralsEntity[] | null;

	/**
	 * WipStatusEntity
	 */
	WipStatusEntity?: IWipStatusEntity | null;

	/**
	 * WipStatusFk
	 */
	WipStatusFk: number;

	/**
	 * WipStatushistoryEntities
	 */
	WipStatushistoryEntities?: IWipStatusHistoryEntity[] | null;

	/**
	 * WipVat
	 */
	WipVat: number;

	/**
	 * WipVatOc
	 */
	WipVatOc: number;
}
