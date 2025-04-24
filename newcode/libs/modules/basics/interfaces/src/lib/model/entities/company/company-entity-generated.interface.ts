/*
 * Copyright(c) RIB Software GmbH
 */

import { IBlobsEntity } from './blobs-entity.interface';
import { ICompanyEntity } from './company-entity.interface';

import { ICompanyNumberEntity } from './company-number-entity.interface';

import { ICompanyTransheaderEntity } from './company-transheader-entity.interface';
import { ICompanyUrlEntity } from './company-url-entity.interface';
import { ICompanyYearEntity } from './company-year-entity.interface';
import { ICompanyCreditorEntity } from './company-creditor-entity.interface';
import { ICompanyDebtorEntity } from './company-debtor-entity.interface';

import { ITrsConfigEntity } from './trs-config-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { ICompany2BasClerkEntity } from './company-2bas-clerk-entity.interface';
import { ICompany2CostCodeEntity } from './company-2cost-code-entity.interface';
import { ICompany2PrjGroupEntity } from './company-2prj-group-entity.interface';
import { ICompany2TextModuleEntity } from './company-2text-module-entity.interface';
import { ICompanyRoleBas2FrmEntity } from './company-role-bas-2frm-entity.interface';
import { IRubricCategory2CompanyEntity } from './rubric-category-2company-entity.interface';

export interface ICompanyEntityGenerated extends IEntityBase {

	/**
	 * AddressDto
	 */
	//AddressDto?: IAddressEntity | null;

	/**
	 * AddressFk
	 */
	AddressFk?: number | null;

	/**
	 * BillingSchemaFk
	 */
	BillingSchemaFk?: number | null;

	/**
	 * BlobsEntity
	 */
	BlobsEntity?: IBlobsEntity | null;

	/**
	 * BlobsEntity_BlobsLetterHeaderFk
	 */
	BlobsEntity_BlobsLetterHeaderFk?: IBlobsEntity | null;

	/**
	 * BlobsFk
	 */
	BlobsFk?: number | null;

	/**
	 * BlobsLetterHeaderFk
	 */
	BlobsLetterHeaderFk?: number | null;

	/**
	 * BusinessPartnerFk
	 */
	BusinessPartnerFk?: number | null;

	/**
	 * CalendarFk
	 */
	CalendarFk?: number | null;

	/**
	 * ClerkFk
	 */
	ClerkFk?: number | null;

	/**
	 * Code
	 */
	Code: string;

	/**
	 * Companies
	 */
	Companies?: ICompanyEntity[] | null;

	/**
	 * Company2BasClerkEntities
	 */
	Company2BasClerkEntities?: ICompany2BasClerkEntity[] | null;

	/**
	 * Company2costCodeEntities
	 */
	Company2costCodeEntities?: ICompany2CostCodeEntity[] | null;

	/**
	 * Company2prjGroupEntities
	 */
	Company2prjGroupEntities?: ICompany2PrjGroupEntity[] | null;

	/**
	 * Company2textModuleEntities
	 */
	Company2textModuleEntities?: ICompany2TextModuleEntity[] | null;

	/**
	 * CompanyChildren
	 */
	CompanyChildren?: ICompanyEntity[] | null;

	/**
	 * CompanyFk
	 */
	CompanyFk?: number | null;

	/**
	 * CompanyName
	 */
	CompanyName?: string | null;

	/**
	 * CompanyName2
	 */
	CompanyName2?: string | null;

	/**
	 * CompanyName3
	 */
	CompanyName3?: string | null;

	/**
	 * CompanyNumberEntities
	 */
	CompanyNumberEntities?: ICompanyNumberEntity[] | null;

	/**
	 * CompanyParent
	 */
	CompanyParent?: ICompanyEntity | null;

	/**
	 * CompanyRoleBas2frmEntities
	 */
	CompanyRoleBas2frmEntities?: ICompanyRoleBas2FrmEntity[] | null;

	/**
	 * CompanyTransheaderEntities
	 */
	CompanyTransheaderEntities?: ICompanyTransheaderEntity[] | null;

	/**
	 * CompanyTypeFk
	 */
	CompanyTypeFk: number;

	/**
	 * CompanyUrlEntities
	 */
	CompanyUrlEntities?: ICompanyUrlEntity[] | null;

	/**
	 * CompanyYearEntities
	 */
	CompanyYearEntities?: ICompanyYearEntity[] | null;

	/**
	 * CompanycreditorEntities
	 */
	CompanycreditorEntities?: ICompanyCreditorEntity[] | null;

	/**
	 * CompanydebtorEntities
	 */
	CompanydebtorEntities?: ICompanyDebtorEntity[] | null;

	/**
	 * ContextFk
	 */
	ContextFk: number;

	/**
	 * CountryFk
	 */
	CountryFk: number;

	/**
	 * CrefoNo
	 */
	CrefoNo?: string | null;

	/**
	 * CurrencyFk
	 */
	CurrencyFk: number;

	/**
	 * DefectContextFk
	 */
	DefectContextFk?: number | null;

	/**
	 * DunsNo
	 */
	DunsNo?: string | null;

	/**
	 * Email
	 */
	Email?: string | null;

	/**
	 * EquipmentContextFk
	 */
	EquipmentContextFk: number;

	/**
	 * EquipmentDivisionFk
	 */
	EquipmentDivisionFk: number;

	/**
	 * ExternalCode
	 */
	ExternalCode?: string | null;

	/**
	 * HasChildren
	 */
	HasChildren: boolean;

	/**
	 * HsqContextFk
	 */
	HsqContextFk?: number | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * Internet
	 */
	Internet?: string | null;

	/**
	 * IsCalculateOverGross
	 */
	IsCalculateOverGross: boolean;

	/**
	 * IsLive
	 */
	IsLive: boolean;

	/**
	 * IsRestrictedToProfitCenter
	 */
	IsRestrictedToProfitCenter: boolean;

	/**
	 * IsRibArchive
	 */
	IsRibArchive: boolean;

	/**
	 * IsSequenceBasedOnProfitCenter
	 */
	IsSequenceBasedOnProfitCenter: boolean;

	/**
	 * LanguageFk
	 */
	LanguageFk: number;

	/**
	 * LedgerContextFk
	 */
	LedgerContextFk: number;

	/**
	 * LineItemContextFk
	 */
	LineItemContextFk: number;

	/**
	 * LoginAllowed
	 */
	LoginAllowed: boolean;

	/**
	 * LogisticContextFk
	 */
	LogisticContextFk: number;

	/**
	 * ModuleContextFk
	 */
	ModuleContextFk: number;

	/**
	 * PaymentTermFiFk
	 */
	PaymentTermFiFk?: number | null;

	/**
	 * PaymentTermPaFk
	 */
	PaymentTermPaFk?: number | null;

	/**
	 * PriceConditionFk
	 */
	PriceConditionFk?: number | null;

	/**
	 * Profitcenter
	 */
	Profitcenter?: string | null;

	/**
	 * ProjectContextFk
	 */
	ProjectContextFk?: number | null;

	/**
	 * PrrMethodFk
	 */
	PrrMethodFk: number;

	/**
	 * ResourceContextFk
	 */
	ResourceContextFk?: number | null;

	/**
	 * RubricCategory2companyEntities
	 */
	RubricCategory2companyEntities?: IRubricCategory2CompanyEntity[] | null;

	/**
	 * SchedulingContextFk
	 */
	SchedulingContextFk?: number | null;

	/**
	 * SearchPattern
	 */
	SearchPattern?: string | null;

	/**
	 * Signatory
	 */
	Signatory?: string | null;

	/**
	 * SubledgerContextFk
	 */
	SubledgerContextFk: number;

	/**
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;

	/**
	 * TaxNo
	 */
	TaxNo?: string | null;

	/**
	 * TelefaxPattern
	 */
	TelefaxPattern?: string | null;

	/**
	 * TelephoneNumberDto
	 */
	//TelephoneNumberDto?: ITelephoneNumberEntity | null;

	/**
	 * TelephoneNumberFk
	 */
	TelephoneNumberFk?: number | null;

	/**
	 * TelephoneNumberTelefaxDto
	 */
	//TelephoneNumberTelefaxDto?: ITelephoneNumberEntity | null;

	/**
	 * TelephonePattern
	 */
	TelephonePattern?: string | null;

	/**
	 * TelephoneTelefaxFk
	 */
	TelephoneTelefaxFk?: number | null;

	/**
	 * TextModuleContextFk
	 */
	TextModuleContextFk: number;

	/**
	 * TimesheetContextFk
	 */
	TimesheetContextFk?: number | null;

	/**
	 * TrsPrjConfigEntities
	 */
	TrsPrjConfigEntities?: ITrsConfigEntity[] | null;

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
	 * ValidFrom
	 */
	ValidFrom?: string | null;

	/**
	 * ValidTo
	 */
	ValidTo?: string | null;

	/**
	 * VatNo
	 */
	VatNo?: string | null;
}
