/*
 * Copyright(c) RIB Software GmbH
 */
import { IUniqueFieldDto } from '@libs/basics/shared';

export interface IEstimateMainUpdateMaterialPackageUpdateItemDto {
	Id: number,
	Selected: boolean,
	Code: string,
	Description: string,
	PackageStatusFk: number,
	ConfigurationFk: number,
	IsMaterial?: boolean,
	IsService?: boolean
}

export interface IEstimateMainUpdateMaterialPackageUpdateItemParam {
	isAggregateItem: boolean,
	mergeOrCreate: number,
	isUpdateBudgetForExistedAssignment: boolean,
	isHideBoqGeneratePackage: boolean,
	updatePackages: IEstimateMainUpdateMaterialPackageUpdateItemDto[],
	uniqueFields: IUniqueFieldDto[]
}

export interface IEstimateMainUpdateMaterialPackageDataComplete {
	basicOption: number,
	updateItem: IEstimateMainUpdateMaterialPackageUpdateItemParam
}

export interface IEstimateMainUpdateMaterialPackageDataComplete {
	basicOption: number,
	updateItem: IEstimateMainUpdateMaterialPackageUpdateItemParam
}

export interface IEstimateMainUpdateMaterialPackageEntity {
	Id: number,
	Code: string,
	Description: string,
	Status: number,
	Configuration: number
}

export interface IEstimateMainUpdateMaterialPackageUpdateOptionEntity {
	IsMaterial: boolean,
	IsService: boolean,
	PrcPackageFk: number
}

