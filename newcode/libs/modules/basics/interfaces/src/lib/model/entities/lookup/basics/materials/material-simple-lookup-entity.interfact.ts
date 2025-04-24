/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase, IEntityIdentification} from '@libs/platform/common';

/**
 * Material simple lookup entity
 */
export interface IMaterialSimpleLookupEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	Specification: string;
	PriceUnit: number;
	BasUomPriceUnitFk?: number | null;
	FactorPriceUnit?: number | null;
	Cost: number;
	MdcMaterialFk?: number | null;
	MaterialCatalogFk: number;
	PrcStructureFk?: number | null;
	Userdefined1: string;
	Userdefined2: string;
	Userdefined3: string;
	Userdefined4: string;
	Userdefined5: string;
	MdcContextFk: number;
	Islive: boolean;
	IsNeutral: boolean;
	MaterialIslive: boolean;
	MaterialCatalogCode: string;
	BasCurrencyFk?: number | null;
	BasUomFk: number;
	BusinessPartnerFk?: number | null;
	MdcMaterialGroupFk: number;
	SearchPattern: string;
	EstCostTypeFk?: number | null;
	IsLabour?: boolean | null;
	IsRate?: boolean | null;
	EstimatePrice: number;
	MdcCostCodeFk?: number | null;
	RealFactorQuantity?: number | null;
	RealFactorCosts?: number | null;
	FactorHour: number;
	IsTemplate: boolean;
	DayworkRate: number;
	BasCo2SourceFk?: number | null;
	Co2Project?: number | null;
	Co2Source?: number | null;
	DescriptionInfo: IDescriptionInfo;
	DescriptionInfo2: IDescriptionInfo;
}