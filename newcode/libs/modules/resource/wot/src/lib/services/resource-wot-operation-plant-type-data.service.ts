/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, IEntityProcessor } from '@libs/platform/data-access';
import { IResourceOperationPlantTypeEntity, IResourceWorkOperationTypeEntity } from '@libs/resource/interfaces';
import { ResourceWotWorkOperationTypeDataService } from './resource-wot-work-operation-type-data.service';
import { ResourceWorkOperationTypeComplete } from '../model/resource-work-operation-type-complete.class';
import { ServiceRole } from '@libs/platform/data-access';


@Injectable({
	providedIn: 'root'
})
export class ResourceWotOperationPlantTypeDataService extends DataServiceFlatLeaf<IResourceOperationPlantTypeEntity,
	IResourceWorkOperationTypeEntity, ResourceWorkOperationTypeComplete> {

	public constructor(resourceWotDataService: ResourceWotWorkOperationTypeDataService) {
		const options: IDataServiceOptions<IResourceOperationPlantTypeEntity> = {
			apiUrl: 'resource/wot/operationplanttype',
			readInfo: <IDataServiceEndPointOptions>{
				//endPoint not necessary, as listbyparent is default in load of http data provider
				//prepareParam not necessary, as working with identification data is the new standard
				usePost: true
			},
			createInfo:{},
			roleInfo: <IDataServiceChildRoleOptions<IResourceOperationPlantTypeEntity,IResourceWorkOperationTypeEntity,ResourceWorkOperationTypeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Operation2PlantTypes',
				parent: resourceWotDataService
			},
		};

		super(options);
	}

	protected override provideAllProcessor(options: IDataServiceOptions<IResourceOperationPlantTypeEntity>): IEntityProcessor<IResourceOperationPlantTypeEntity>[] {
		return [
			...super.provideAllProcessor(options)//,
			// inject(RESOURCE_CATALOG_PRICEINDEN_NEWENTITYVALIDATION_TOKEN)
		];
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: ResourceWorkOperationTypeComplete, modified: IResourceOperationPlantTypeEntity[], deleted: IResourceOperationPlantTypeEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.Operation2PlantTypesToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.Operation2PlantTypesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: ResourceWorkOperationTypeComplete): IResourceOperationPlantTypeEntity[] {
		if (!complete.Operation2PlantTypesToSave) {
			complete.Operation2PlantTypesToSave = [];
		}

		return complete.Operation2PlantTypesToSave;
	}
}
