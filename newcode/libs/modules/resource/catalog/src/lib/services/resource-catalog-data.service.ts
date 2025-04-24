/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceRoleOptions, IEntityProcessor, ServiceRole } from '@libs/platform/data-access';
import { IResourceCatalogEntity, ResourceCatalogComplete } from '@libs/resource/interfaces';
import { IDataServiceEndPointOptions, IEntityList } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root'
})

export class ResourceCatalogDataService extends DataServiceFlatRoot<IResourceCatalogEntity, ResourceCatalogComplete> {

	public constructor() {
		const options: IDataServiceOptions<IResourceCatalogEntity> = {
			apiUrl: 'resource/catalog/catalog',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IResourceCatalogEntity>>{
				role: ServiceRole.Root,
				itemName: 'Catalog'
			},
			entityActions: {createSupported: true, deleteSupported: true},
		};

		super(options);
	}

	protected override provideAllProcessor(options: IDataServiceOptions<IResourceCatalogEntity>): IEntityProcessor<IResourceCatalogEntity>[] {
		return [
			...super.provideAllProcessor(options)// ,
			// inject(RESOURCE_CATALOG_NEWENTITYVALIDATION_TOKEN)
		];
	}

	public override getModificationsFromUpdate(complete: ResourceCatalogComplete) {
		if (complete.Catalogs === null) {
			complete.Catalogs = [];
		}

		return complete.Catalogs;
	}

	protected takeOverUpdatedFromComplete(complete: ResourceCatalogComplete, entityList: IEntityList<IResourceCatalogEntity>) {
		if (complete && complete.Catalogs && complete.Catalogs.length > 0) {
			entityList.updateEntities(complete.Catalogs);
		}
	}

	public override createUpdateEntity(modified: IResourceCatalogEntity | null): ResourceCatalogComplete {
		return {
			CatalogId: modified ? modified.Id : null,
			Catalogs: modified ? [modified] : [],
		} as ResourceCatalogComplete;
	}
}
