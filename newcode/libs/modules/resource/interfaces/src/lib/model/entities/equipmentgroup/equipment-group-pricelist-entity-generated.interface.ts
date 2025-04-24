/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IEntityBase } from '@libs/platform/common';

export interface IEquipmentGroupPricelistEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantGroupFk: number;
	 PlantPriceListFk: number;
	 IsManual: boolean;
	 PricingGroupFk: number;
	 UomFk: number;
	 PricePortion01: number;
	 PricePortion02: number;
	 PricePortion03: number;
	 PricePortion04: number;
	 PricePortion05: number;
	 PricePortion06: number;
	 ValidFrom?: Date;
	 ValidTo?: Date;
	 CommentText?: string;
}