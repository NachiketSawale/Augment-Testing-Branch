/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, IEntityProcessor } from '@libs/platform/data-access';
import { IResourceCatalogPriceIndexEntity, ResourceCatalogComplete } from '@libs/resource/interfaces';
import { IResourceCatalogEntity } from '@libs/resource/interfaces';
import { ServiceRole } from '@libs/platform/data-access';
import { ResourceCatalogDataService } from './resource-catalog-data.service';

export const RESOURCE_CATALOG_PRICEINDEX_DATA_TOKEN = new InjectionToken<ResourceCatalogPriceIndexDataService>('resourceCatalogPriceIndexDataService');

@Injectable({
	providedIn: 'root'
})
export class ResourceCatalogPriceIndexDataService extends DataServiceFlatLeaf<IResourceCatalogPriceIndexEntity,
	IResourceCatalogEntity, ResourceCatalogComplete> {

	public constructor(resourceCatalogDataService: ResourceCatalogDataService) {
		const options: IDataServiceOptions<IResourceCatalogPriceIndexEntity> = {
			apiUrl: 'resource/catalog/priceindex',
			readInfo: <IDataServiceEndPointOptions>{
				//endPoint not necessary, as listbyparent is default in load of http data provider
				//prepareParam not necessary, as working with identification data is the new standard
				usePost: true
			},
			createInfo:{},
			roleInfo: <IDataServiceChildRoleOptions<IResourceCatalogPriceIndexEntity,IResourceCatalogEntity,ResourceCatalogComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PriceIndices',
				parent: resourceCatalogDataService
			},
		};

		super(options);
	}

	protected override provideAllProcessor(options: IDataServiceOptions<IResourceCatalogPriceIndexEntity>): IEntityProcessor<IResourceCatalogPriceIndexEntity>[] {
		return [
			...super.provideAllProcessor(options)//,
			// inject(RESOURCE_CATALOG_PRICEINDEN_NEWENTITYVALIDATION_TOKEN)
		];
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: ResourceCatalogComplete, modified: IResourceCatalogPriceIndexEntity[], deleted: IResourceCatalogPriceIndexEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.PriceIndicesToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.PriceIndicesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: ResourceCatalogComplete): IResourceCatalogPriceIndexEntity[] {
		if (complete && complete.PriceIndicesToSave) {
			return complete.PriceIndicesToSave;
		}

		return [];
	}
}
