/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IInvPeslookupVEntityGenerated {
	/*
	 * BpName1
	 */
	BpName1?: string | null;

	/*
	 * BpName2
	 */
	BpName2?: string | null;

	/*
	 * BusinessPartnerFk
	 */
	BusinessPartnerFk: number;

	/*
	 * ClerkPrcFk
	 */
	ClerkPrcFk: number;

	/*
	 * ClerkReqFk
	 */
	ClerkReqFk?: number | null;

	/*
	 * Code
	 */
	Code: string;

	/*
	 * CompanyFk
	 */
	CompanyFk: number;

	/*
	 * ConCode
	 */
	ConCode?: string | null;

	/*
	 * ConDescription
	 */
	ConDescription?: string | null;

	/*
	 * ConHeaderFk
	 */
	ConHeaderFk?: number | null;

	/*
	 * ControllingUnitCode
	 */
	ControllingUnitCode?: string | null;

	/*
	 * ControllingUnitDescriptionInfo
	 */
	ControllingUnitDescriptionInfo?: IDescriptionInfo | null;

	/*
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/*
	 * CurrencyFk
	 */
	CurrencyFk: number;

	/*
	 * DateDelivered
	 */
	DateDelivered: Date | string;

	/*
	 * DateDeliveredfrom
	 */
	DateDeliveredfrom?: Date | string | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * DocumentDate
	 */
	DocumentDate?: Date | string | null;

	/*
	 * Icon
	 */
	Icon?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * PesStatusFk
	 */
	PesStatusFk: number;

	/*
	 * PesValue
	 */
	PesValue: number;

	/*
	 * PesValueOc
	 */
	PesValueOc: number;

	/*
	 * PesVat
	 */
	PesVat: number;

	/*
	 * PesVatOc
	 */
	PesVatOc: number;

	/*
	 * PrcConfigurationFk
	 */
	PrcConfigurationFk: number;

	/*
	 * PrcHeaderFk
	 */
	PrcHeaderFk?: number | null;

	/*
	 * PrcPackageFk
	 */
	PrcPackageFk?: number | null;

	/*
	 * PrcStructureCode
	 */
	PrcStructureCode?: string | null;

	/*
	 * PrcStructureDescriptionInfo
	 */
	PrcStructureDescriptionInfo?: IDescriptionInfo | null;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/*
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * SalesTaxMethodFk
	 */
	SalesTaxMethodFk: number;

	/*
	 * SearchPattern
	 */
	SearchPattern?: string | null;

	/*
	 * StatusDescriptionInfo
	 */
	StatusDescriptionInfo?: IDescriptionInfo | null;

	/*
	 * StatusIcon
	 */
	StatusIcon?: number | null;

	/*
	 * StatusIsAccepted
	 */
	StatusIsAccepted?: boolean | null;

	/*
	 * StatusIsCanceled
	 */
	StatusIsCanceled?: boolean | null;

	/*
	 * StatusIsInvoiced
	 */
	StatusIsInvoiced?: boolean | null;

	/*
	 * StatusIsVirtual
	 */
	StatusIsVirtual?: boolean | null;

	/*
	 * SubsidiaryFk
	 */
	SubsidiaryFk?: number | null;

	/*
	 * SupplierCode
	 */
	SupplierCode?: string | null;

	/*
	 * SupplierDescription
	 */
	SupplierDescription?: string | null;

	/*
	 * SupplierFk
	 */
	SupplierFk?: number | null;

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
