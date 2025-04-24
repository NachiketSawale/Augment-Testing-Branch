/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions } from '@libs/platform/data-access';
import { IResourceCatalogRecordEntity, ResourceCatalogComplete } from '@libs/resource/interfaces';
import { ResourceCatalogDataService } from './resource-catalog-data.service';
import { IResourceCatalogEntity } from '@libs/resource/interfaces';
import { ServiceRole } from '@libs/platform/data-access';


@Injectable({
	providedIn: 'root'
})
export class ResourceCatalogRecordDataService extends DataServiceFlatLeaf<IResourceCatalogRecordEntity,
	IResourceCatalogEntity, ResourceCatalogComplete> {

	public constructor(resourceCatalogDataService: ResourceCatalogDataService) {
		const options: IDataServiceOptions<IResourceCatalogRecordEntity> = {
			apiUrl: 'resource/catalog/record',
			readInfo: <IDataServiceEndPointOptions>{
				//endPoint not necessary, as listbyparent is default in load of http data provider
				//prepareParam not necessary, as working with identification data is the new standard
				usePost: true
			},
			createInfo:{},
			roleInfo: <IDataServiceChildRoleOptions<IResourceCatalogRecordEntity,IResourceCatalogEntity,ResourceCatalogComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Records',
				parent: resourceCatalogDataService
			},
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: ResourceCatalogComplete, modified: IResourceCatalogRecordEntity[], deleted: IResourceCatalogRecordEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.RecordsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.RecordsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: ResourceCatalogComplete): IResourceCatalogRecordEntity[] {
		if (complete && complete.RecordsToSave) {
			return complete.RecordsToSave;
		}

		return [];
	}
}
