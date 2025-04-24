import { LOGISTIC_PLANTSUPPLIER_PLANT_SUPPLIER_ENTITY_INFO } from '../../model/logistic-plantsupplier-plant-supplier-entity-info.model';
import { Injectable } from '@angular/core';
import { ILogisticPlantsupplierPlantSupplierEntity } from '@libs/logistic/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class LogisticPlantsupplierPlantSupplierLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ILogisticPlantsupplierPlantSupplierEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'logistic/plantsupplier',
					endPointRead: 'filtered',
					usePostForRead: true
				}
			},
			{
				uuid: 'd467a9ad3f9348b1a36c5c9f1084476d',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<ILogisticPlantsupplierPlantSupplierEntity>>{
						columns: await LOGISTIC_PLANTSUPPLIER_PLANT_SUPPLIER_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}