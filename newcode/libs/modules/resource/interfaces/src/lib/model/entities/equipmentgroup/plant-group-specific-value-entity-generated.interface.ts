/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification, IEntityBase } from '@libs/platform/common';

export interface IPlantGroupSpecificValueEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantGroupFk: number;
	 DescriptionInfo?: IDescriptionInfo;
	 SpecificValueTypeFk: number;
	 UomFromTypeFk?: number;
	 UomFk?: number;
	 IsInherited: boolean;
	 IsManual: boolean;
	 CommentText?: string;
	 Value?: string;
	 Factor: number;
	 CostCodeFk?: number;
	 PlantGroupSpecificValueFk?: number;
	 PlantAssemblyTypeFk?: number;
}