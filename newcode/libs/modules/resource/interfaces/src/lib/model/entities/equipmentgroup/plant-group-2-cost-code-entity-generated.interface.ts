/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IEntityBase } from '@libs/platform/common';

export interface IPlantGroup2CostCodeEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantGroupFk: number;
	 CostCodePriceP1Fk?: number;
	 CostCodePriceP2Fk?: number;
	 CostCodePriceP3Fk?: number;
	 CostCodePriceP4Fk?: number;
	 CostCodePriceP5Fk?: number;
	 CostCodePriceP6Fk?: number;
	 CommentText?: string;
	 MdcContextFk: number;
}