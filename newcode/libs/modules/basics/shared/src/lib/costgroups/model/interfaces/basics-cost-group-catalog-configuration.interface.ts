/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { ICostGroupCatEntity } from '../entities/cost-group-cat-entity.interface';

export interface IBasicsCustomizProjectCatalogConfigurationType {
	Id: number;

	CatConfigFk: number;

	LineitemcontextFk: number;

	DescriptionInfo: IDescriptionInfo;

	Sorting: number;

	IsDefault: boolean;

	IsLive: boolean;

	IsProject: boolean;

	IsConstructionSystem: boolean;

	IsMaterial: boolean;

	IsActivityCriteria: boolean;

	IsEmployee: boolean;

	InsertedAt: string;

	InsertedBy: number;

	UpdatedAt?: string;

	UpdatedBy?: string;

	Version: number;

	IsAssembly: boolean;

	IsWorkItemCatalog: boolean;
}

export interface IBasicsCustomizeProjectCatalogConfiguration {
	Id: number;
	DescriptionInfo: IDescriptionInfo;

	InsertedAt: string;

	InsertedBy: number;

	UpdatedAt?: string;

	UpdatedBy?: string;

	Version: number;
}

export interface IBasicsCustomizeProjectCostGroupCatalogAssignment {
	Id: number;

	ProjectCatalogConfigurationFk: number;

	CostGroupCatalogFk?: number;

	Sorting: number;

	IsProjectCatalog: boolean;

	IsBoQ: boolean;

	IsEstimate: boolean;

	IsConstructionSystem: boolean;

	IsProcurement: boolean;

	IsEngineering: boolean;

	IsProductionSystem: boolean;

	IsModel: boolean;

	IsQuantityTakeOff: boolean;

	Code: string;

	DescriptionInfo: IDescriptionInfo;

	SourceCostGroupCatalogFk?: number;

	InsertedAt: string;

	InsertedBy: number;

	UpdatedAt?: string;

	UpdatedBy?: string;

	Version: number;

	IsControlling: boolean;

	IsDefect: boolean;
}

/**
 *
 * Style Option Interface
 */
export interface IBasicsCustomizeProjectCatalogConfigurationInterface {
	Type: IBasicsCustomizProjectCatalogConfigurationType;

	Configuration: IBasicsCustomizeProjectCatalogConfiguration;

	Assignments: IBasicsCustomizeProjectCostGroupCatalogAssignment[];
}

export interface IBasicsCostGroupCache {
	key: string;
	configuration?: IBasicsCustomizeProjectCatalogConfiguration;
	configurationType?: IBasicsCustomizProjectCatalogConfigurationType;
	configurationAssign?: IBasicsCustomizeProjectCostGroupCatalogAssignment[];
	licCostGroupCats?: ICostGroupCatEntity[] | null;
	prjCostGroupCats?: ICostGroupCatEntity[] | null;
}
