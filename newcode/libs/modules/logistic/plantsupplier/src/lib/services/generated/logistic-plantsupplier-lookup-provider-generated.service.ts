/*
 * Copyright(c) RIB Software GmbH
 * ----------------------------------------------------------------------
 * This is auto-generated code by ClientTSLookupHelperGenerator.
 * ----------------------------------------------------------------------
 * This code was generated by RIB Model Generator tool.
 *
 * Changes to this file may cause incorrect behavior and will be lost if
 * the code is regenerated.
 * ----------------------------------------------------------------------
 */

import { LogisticPlantsupplierPlantSupplierLookupService } from '../lookupdata/logistic-plantsupplier-plant-supplier-lookup.service';
import { ILogisticPlantsupplierPlantSupplierEntity } from '@libs/logistic/interfaces';
import { createLookup, FieldType, ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';

export class LogisticPlantsupplierLookupProviderGeneratedService {
	public providePlantSupplierLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T,ILogisticPlantsupplierPlantSupplierEntity>({
				dataServiceToken: LogisticPlantsupplierPlantSupplierLookupService,
				showClearButton: !!options?.showClearButton
			})
		};
	}
	public providePlantSupplierReadonlyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T,ILogisticPlantsupplierPlantSupplierEntity>({
				dataServiceToken: LogisticPlantsupplierPlantSupplierLookupService,
				showClearButton: false
			})
		};
	}
}