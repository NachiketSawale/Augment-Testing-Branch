/*
 * Copyright(c) RIB Software GmbH
 */
import { IDescriptionInfo } from '@libs/platform/common';
import { IBasicsSearchStructurePreDefine } from '@libs/basics/interfaces';

export interface IMaterialDefinitionsEntity {
	loginCompany: number;
	config: IMaterialDefinitions;
}

export interface IMaterialDefinitions {
	category: {
		entity: ICategoryEntity,
		type: string
	};
	filterOption: IFilterOptionEntity;
	mainCategoryId: number;
	sortOption: number;
}

export interface ICategoryEntity {
	Id: number;
	Code: string;
	DescriptionInfo: IDescriptionInfo;
}

export interface IFilterOptionEntity {
	AttributeFilters: [];
	CategoryIdsFilter: [];
	FilterByFramework: boolean;
	MaterialTypeFilter: {
		IsForProcurement: boolean;
	};
	PreDefine: IBasicsSearchStructurePreDefine;
	SortOption: number | null;
	StructureId: number | null;
	UomIdsFilter: [];
	UomsFilter: [];
	mainCategoryId: number | null;
	sortOption: number;
}
