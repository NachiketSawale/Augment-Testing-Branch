/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantSpecificValueEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk: number;
	 DescriptionInfo?: IDescriptionInfo | null;
	 SpecificValueTypeFk: number;
	 UomFromTypeFk?: number | null;
	 UomFk?: number | null;
	 Quantity?: number | null;
	 Value?: string | null;
	 IsManual: boolean;
	 Factor?: number | null;
	 CommentText?: string | null;
	 CostCodeFk?: number | null;
	 PlantAssemblyTypeFk?: number | null;
	 PlantGroupSpecValueFk?: number | null;
	 PlantGroupSpecValueRootFk?: number | null;
}