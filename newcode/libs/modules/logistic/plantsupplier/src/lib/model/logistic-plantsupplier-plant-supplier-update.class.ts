/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILogisticPlantsupplierPlantSupplierEntity, ILogisticPlantsupplierPlantSupplyItemEntity } from '@libs/logistic/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class LogisticPlantsupplierPlantSupplierUpdate implements CompleteIdentification<ILogisticPlantsupplierPlantSupplierEntity> {
	public MainItemId: number = 0;
	public Plantsupplier: ILogisticPlantsupplierPlantSupplierEntity[] | null = [];
	public PlantSupplierItemsToSave: ILogisticPlantsupplierPlantSupplyItemEntity[] | null = [];
	public PlantSupplierItemsToDelete: ILogisticPlantsupplierPlantSupplyItemEntity[] | null = [];
}