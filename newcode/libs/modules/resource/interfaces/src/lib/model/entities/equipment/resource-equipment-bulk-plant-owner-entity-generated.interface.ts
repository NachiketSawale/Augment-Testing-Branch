/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentBulkPlantOwnerEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk: number;
	 CompanyFk: number;
	 ProjectFk: number;
	 DropPointFk: number;
	 TotalQuantity: number;
	 YardQuantity: number;
	 ConstructionProjectFk: number;
	 ConstructionDropPointFk: number;
	 ProjectQuantity: number;
}