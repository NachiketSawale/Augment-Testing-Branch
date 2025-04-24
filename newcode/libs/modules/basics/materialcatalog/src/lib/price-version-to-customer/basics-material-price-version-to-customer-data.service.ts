/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';

import { BasicsMaterialPriceVersionDataService } from '../price-version/basics-material-price-version-data.service';
import { IMdcMatPricever2custEntity } from '../model/entities/mdc-mat-pricever-2-cust-entity.interface';
import { IMaterialPriceVersionEntity } from '../model/entities/material-price-version-entity.interface';
import { MaterialPriceVersionComplete } from '../model/material-price-version-complete.class';
import { BasicsSharedNewEntityValidationProcessorFactory } from '@libs/basics/shared';
import { BasicsMaterialPriceVersionToCustomerValidationService } from './basics-material-price-version-to-customer-validation.service';

export const BASICS_MATERIAL_PRICE_VERSION_TO_CUSTOMER_DATA_TOKEN = new InjectionToken<BasicsMaterialPriceVersionToCustomerDataService>('basicsMaterialPriceVersionToCustomerDataToken');

/**
 * Material price version to customer entity data service
 * This container seems only for YTWO project, maybe it is not needed anymore.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialPriceVersionToCustomerDataService extends DataServiceFlatLeaf<IMdcMatPricever2custEntity, IMaterialPriceVersionEntity, MaterialPriceVersionComplete> {
	private readonly newValidationProcessorFactory = inject(BasicsSharedNewEntityValidationProcessorFactory);

	public constructor(private priceVersionDataService: BasicsMaterialPriceVersionDataService) {
		super({
			apiUrl: 'basics/materialcatalog/priceversion2customer',
			roleInfo: <IDataServiceChildRoleOptions<IMdcMatPricever2custEntity, IMaterialPriceVersionEntity, MaterialPriceVersionComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PriceVersionToCustomer',
				parent: priceVersionDataService,
			},
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
		});

		this.processor.addProcessor(this.newValidationProcessorFactory.createProcessor(BasicsMaterialPriceVersionToCustomerValidationService, { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MdcMatPricever2custDto' }));
	}

	protected override provideLoadPayload(): object {
		const priceVersion = this.getSelectedParent();
		if (priceVersion) {
			return {
				mainItemId: priceVersion.Id,
			};
		} else {
			throw new Error('There should be a selected parent price version to load the price version to customer data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IMdcMatPricever2custEntity[] {
		return loaded as IMdcMatPricever2custEntity[];
	}

	protected override provideCreatePayload(): object {
		const catalog = this.getSelectedParent();
		if (catalog) {
			return {
				mainItemId: catalog.Id,
			};
		} else {
			throw new Error('There should be a selected parent price version to create the price version to customer data');
		}
	}

	protected override onCreateSucceeded(loaded: object): IMdcMatPricever2custEntity {
		return loaded as IMdcMatPricever2custEntity;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: MaterialPriceVersionComplete, modified: IMdcMatPricever2custEntity[], deleted: IMdcMatPricever2custEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.MaterialPriceVersion2CustomerToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.MaterialPriceVersion2CustomerToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MaterialPriceVersionComplete): IMdcMatPricever2custEntity[] {
		return complete?.MaterialPriceVersion2CustomerToSave ?? [];
	}

	public override isParentFn(parentKey: IMaterialPriceVersionEntity, entity: IMdcMatPricever2custEntity): boolean {
		return entity.MdcMatPriceverFk === parentKey.Id;
	}
}
