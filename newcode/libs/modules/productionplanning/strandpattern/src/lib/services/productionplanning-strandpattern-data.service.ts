/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, IEntityList } from '@libs/platform/data-access';

import { ProductionplanningStrandpatternEntity } from '../model/productionplanning-strandpattern-entity.class';
import { ProductionplanningStrandpatternComplete } from '../model/productionplanning-strandpattern-complete.class';

export const PRODUCTIONPLANNING_STRANDPATTERN_DATA_TOKEN = new InjectionToken<ProductionplanningStrandpatternDataService>('productionplanningStrandpatternDataToken');

@Injectable({
	providedIn: 'root',
})
export class ProductionplanningStrandpatternDataService extends DataServiceFlatRoot<ProductionplanningStrandpatternEntity, ProductionplanningStrandpatternComplete> {
	public constructor() {
		const options: IDataServiceOptions<ProductionplanningStrandpatternEntity> = {
			apiUrl: 'productionplanning/strandpattern',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<ProductionplanningStrandpatternEntity>>{
				role: ServiceRole.Root,
				itemName: 'Strandpattern',
			},
			entityActions: {createSupported: true, deleteSupported: true},
		};

		super(options);
	}

	protected takeOverUpdatedFromComplete(complete: ProductionplanningStrandpatternComplete, entityList: IEntityList<ProductionplanningStrandpatternEntity>) {
		if (complete && complete.StrandPattern && complete.StrandPattern.length > 0) {
			entityList.updateEntities(complete.StrandPattern);
		}
	}

	public override createUpdateEntity(modified: ProductionplanningStrandpatternEntity | null): ProductionplanningStrandpatternComplete {
		const complete = new ProductionplanningStrandpatternComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.StrandPattern = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: ProductionplanningStrandpatternComplete): ProductionplanningStrandpatternEntity[] {
		if (complete.StrandPattern === null) {
			complete.StrandPattern = [];
		}

		return complete.StrandPattern;
	}

	protected override checkCreateIsAllowed(entities: ProductionplanningStrandpatternEntity[] | ProductionplanningStrandpatternEntity | null): boolean {
		if (entities === null) {
			return false;
		}

		return typeof entities !== typeof ProductionplanningStrandpatternEntity;
	}

	public getProcessors() {
		return this.processor.getProcessors();
	}
}
