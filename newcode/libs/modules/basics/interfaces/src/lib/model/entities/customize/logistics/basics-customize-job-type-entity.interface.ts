/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeJobTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsExternal: boolean;
	ReportFk: number;
	Report2Fk: number;
	RubricCategoryFk: number;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
	IsMaintenance: boolean;
	IsCenter: boolean;
	IsPoolJob: boolean;
	IsJointVenture: boolean;
	IsForPlantSupply: boolean;
	IsVoid: boolean;
	HasLoadingCost: boolean;
}
