/*
 * Copyright(c) RIB Software GmbH
 */


import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';
import { IPrcPackageEntity } from '../entities/common/estimate-main-prc-package-entity.interface';
export interface IEstMainPrcPackageDeleteDataEntity {
	IsChecked: boolean;

	EstHeaderFk: number;

	SelectedLevel: string;

	PrjProjectFk: number;

	IsLineItems: boolean;

	IsResources: boolean;

	EstLineItems: IEstLineItemEntity[];

	NotMatchingEstLineItems: IEstLineItemEntity[];

	EstResources: IEstResourceEntity[];

	PrcPackages: IPrcPackageEntity[];

	PackageResources: IEstResourceEntity[];

	IsGeneratePrc: boolean;
	
	IsDisablePrc: boolean;
}

