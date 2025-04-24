/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IEntityBase } from '@libs/platform/common';

export interface IPlantGroupWoTypeEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantGroupFk: number;
	 WorkOperationTypeFk: number;
	 IsPriced: boolean;
	 Percent: number;
}