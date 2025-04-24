/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';

import { BasicsSharedNewEntityValidationProcessorFactory, IMaterialCatalogEntity, skipNullMap } from '@libs/basics/shared';
import { BasicsMaterialCatalogDataService } from '../material-catalog/basics-material-catalog-data.service';
import { IMaterialPriceVersionEntity } from '../model/entities/material-price-version-entity.interface';
import { MaterialPriceVersionComplete } from '../model/material-price-version-complete.class';
import { MaterialCatalogComplete } from '../model/material-catalog-complete.class';
import { BasicsMaterialPriceVersionValidationService } from './basics-material-price-version-validation.service';

export const BASICS_MATERIAL_PRICE_VERSION_DATA_TOKEN = new InjectionToken<BasicsMaterialPriceVersionDataService>('basicsMaterialPriceVersionDataToken');

/**
 * Material price version entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialPriceVersionDataService extends DataServiceFlatNode<IMaterialPriceVersionEntity, MaterialPriceVersionComplete, IMaterialCatalogEntity, MaterialCatalogComplete> {
	private readonly newValidationProcessorFactory = inject(BasicsSharedNewEntityValidationProcessorFactory);

	public constructor(private catalogService: BasicsMaterialCatalogDataService) {
		super({
			apiUrl: 'basics/materialcatalog/priceversion',
			roleInfo: <IDataServiceChildRoleOptions<IMaterialPriceVersionEntity, IMaterialCatalogEntity, MaterialCatalogComplete>>{
				role: ServiceRole.Node,
				itemName: 'PriceVersion',
				parent: catalogService,
			},
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
		});

		this.processor.addProcessor(this.newValidationProcessorFactory.createProcessor(BasicsMaterialPriceVersionValidationService, { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MaterialPriceVersionDto' }));
	}

	protected override provideLoadPayload(): object {
		const catalog = this.getSelectedParent();
		if (catalog) {
			return {
				mainItemId: catalog.Id,
			};
		} else {
			throw new Error('There should be a selected parent catalog to load the price version data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IMaterialPriceVersionEntity[] {
		return loaded as IMaterialPriceVersionEntity[];
	}

	protected override provideCreatePayload(): object {
		const catalog = this.getSelectedParent();
		if (catalog) {
			return {
				mainItemId: catalog.Id,
			};
		} else {
			throw new Error('There should be a selected parent catalog to load the price version data');
		}
	}

	protected override onCreateSucceeded(loaded: object): IMaterialPriceVersionEntity {
		//TODO: When creat the price version, the price version to companies should be created.
		return loaded as IMaterialPriceVersionEntity;
	}

	public override createUpdateEntity(modified: IMaterialPriceVersionEntity | null): MaterialCatalogComplete {
		return new MaterialPriceVersionComplete(modified);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: MaterialCatalogComplete, modified: MaterialPriceVersionComplete[], deleted: IMaterialPriceVersionEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.MaterialPriceVersionToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.MaterialPriceVersionToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MaterialCatalogComplete): IMaterialPriceVersionEntity[] {
		return skipNullMap(complete.MaterialPriceVersionToSave, (e) => e.MaterialPriceVersion);
	}

	public override isParentFn(parentKey: IMaterialCatalogEntity, entity: IMaterialPriceVersionEntity): boolean {
		return entity.MaterialCatalogFk === parentKey.Id;
	}
}
