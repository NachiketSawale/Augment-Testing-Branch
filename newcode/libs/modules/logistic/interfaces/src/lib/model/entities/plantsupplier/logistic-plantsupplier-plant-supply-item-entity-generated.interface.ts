/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ILogisticPlantsupplierPlantSupplyItemEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantSupplierFk: number;
	 ConsumptionDate: Date;
	 MaterialFk: number;
	 PlantFk: number;
	 Quantity: number;
	 Price: number;
	 PlantSupplyItemStatusFk: number;
	 JobFk: number;
	 ExternalId?: string | null;
	 IsSettled: boolean;
}