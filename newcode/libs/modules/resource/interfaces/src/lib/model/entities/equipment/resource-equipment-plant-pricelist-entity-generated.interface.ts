/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantPricelistEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk: number;
	 PricelistFk: number;
	 PricingGroupFk: number;
	 IsManual: boolean;
	 PricePortion1: number;
	 PricePortion2: number;
	 PricePortion3: number;
	 PricePortion4: number;
	 PricePortion5: number;
	 PricePortion6: number;
	 ValidFrom?: Date | null;
	 ValidTo?: Date | null;
	 CommentText?: string | null;
	 UomFk: number;
	 QualityFactor: number;
}