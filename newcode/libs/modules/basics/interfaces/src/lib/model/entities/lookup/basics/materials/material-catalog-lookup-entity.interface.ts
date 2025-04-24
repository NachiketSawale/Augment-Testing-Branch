/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase, IEntityIdentification} from '@libs/platform/common';

/**
 * Material catalog lookup entity
 */
export interface IMaterialCatalogLookupEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	ContextFk: number;
	MaterialCatalogTypeFk: number;
	DescriptionInfo: IDescriptionInfo;
	ValidFrom?: Date;
	ValidTo?: Date;
	Islive: boolean;
	ClerkFk?: number;
	DataDate?: Date;
	BusinessPartnerFk?: number;
	SubsidiaryFk?: number;
	SupplierFk?: number;
	PaymentTermFk?: number;
	IncotermFk?: number;
	IsNeutral: boolean;
	BusinessPartnerName1: string;
	IsInternetCatalog: boolean;
	BusinessPartnerName2: string;
	BasRubricCategoryFk: number;
	ConHeaderFk?: number;
	ConHeaderCode: string;
	ConHeaderDescription: string;
	PaymentTermFiFk?: number;
	PaymentTermAdFk?: number;
}