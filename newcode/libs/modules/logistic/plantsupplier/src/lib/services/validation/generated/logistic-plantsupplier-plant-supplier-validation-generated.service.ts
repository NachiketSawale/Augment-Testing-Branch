/*
 * Copyright(c) RIB Software GmbH
 * ----------------------------------------------------------------------
 * This is auto-generated code by ClientTypeScriptValidationServiceGenerator.
 * ----------------------------------------------------------------------
 * This code was generated by RIB Model Generator tool.
 *
 * Changes to this file may cause incorrect behavior and will be lost if
 * the code is regenerated.
 * ----------------------------------------------------------------------
 */

import { LogisticPlantsupplierPlantSupplierDataService } from '../../data/logistic-plantsupplier-plant-supplier-data.service';
import { inject } from '@angular/core';
import { ILogisticPlantsupplierPlantSupplierEntity } from '@libs/logistic/interfaces';
import { BaseGeneratorRevalidationService } from '@libs/platform/data-access';

export class LogisticPlantsupplierPlantSupplierValidationGeneratedService extends BaseGeneratorRevalidationService<ILogisticPlantsupplierPlantSupplierEntity> {
	protected logisticPlantsupplierPlantSupplierData: LogisticPlantsupplierPlantSupplierDataService = inject(LogisticPlantsupplierPlantSupplierDataService);
	public constructor(){
		super({moduleSubModule: 'Logistic.Plantsupplier', typeName: 'PlantSupplierDto'});
	}
	protected getDataService(): LogisticPlantsupplierPlantSupplierDataService {
		return this.logisticPlantsupplierPlantSupplierData;
	}
}