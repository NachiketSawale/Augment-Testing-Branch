/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IPrjMaterialEntity } from '@libs/project/interfaces';

/**
 * Basics Material Portion entity interface
 */
export interface IProjectMaterialPortionEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	MdcMaterialFk: number;
	Code: string;
	CostCode: string | null;
	Description: string;
	CostPerUnit: number | null;
	IsEstimatePrice: boolean;
	IsDayWorkRate: boolean;
	PriceConditionFk?: number;
	PriceExtra: number;
	Quantity: number;
	BasMaterialPortion: IBasMaterialPortion;
	MdcMaterialPortionTypeFk?: number;
	MaterialPortionTypeFk?: number;
	MdcCostPerUnit: number;
	IsRefereToProjectCostCode: boolean;
	MdcCostCodeFK: number | null;
	MdcMaterialPortionFk: number | null;
	PrjMaterialEntity: IPrjMaterialEntity | null;
	Project2MdcCostCodeFk: number | null;
	Project2MdcMaterialFk: number | null;
}

export interface IBasMaterialPortion {
	Id: number;
	MdcMaterialFk: number;
	Code: string;
	Description: string;
	CostPerUnit: number;
	IsEstimatePrice: boolean;
	IsDayworkRate: boolean;
	MdcCostCodeFk?: number;
	PrcPriceConditionFk?: number;
	PriceExtra: number;
	Quantity: number;
	MaterialPortionTypeFk?: number;
}
