/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf, ServiceRole,
	IDataServiceChildRoleOptions, IDataServiceEndPointOptions,
	IDataServiceOptions
} from '@libs/platform/data-access';
import { BasicsMaterialStockDataService } from '../stock/basics-material-stock-data.service';
import { IStock2matPriceverEntity } from '../model/entities/stock-2-mat-pricever-entity.interface';
import { IMaterial2ProjectStockEntity } from '../model/entities/material-2-project-stock-entity.interface';
import { MaterialComplete } from '../model/complete-class/material-complete.class';
import { BasicsSharedNewEntityValidationProcessorFactory, MainDataDto } from '@libs/basics/shared';
import { BasicsMaterialPriceVersionToStockListValidationService } from './basics-material-price-version-to-stock-list-validation.service';

/**
 * The Basics Material Price Version To Stock List data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialPriceVersionToStockListDataService extends DataServiceFlatLeaf<IStock2matPriceverEntity, IMaterial2ProjectStockEntity, MaterialComplete> {
	private readonly validationProcessor = inject(BasicsSharedNewEntityValidationProcessorFactory);
	public constructor(public materialStockDataService: BasicsMaterialStockDataService) {
		const options: IDataServiceOptions<IStock2matPriceverEntity> = {
			apiUrl: 'basics/material/stock2matpricever',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IStock2matPriceverEntity, IMaterial2ProjectStockEntity, MaterialComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Stock2matPriceverDto',
				parent: materialStockDataService
			}
		};

		super(options);
		this.processor.addProcessor([this.provideNewEntityValidationProcessor()]);
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				mainItemId: parent.Id
			};
		} else {
			throw new Error('There should be a selected parent Material record to load the Material Stock List data');
		}
	}

	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				prjStockId: parent.ProjectStockFk,
				mdcMaterialCatalogFk: parent.MaterialCatalogFk
			};
		}
		throw new Error('please select a Material Stock List record first');
	}

	protected override onLoadSucceeded(loaded: object): IStock2matPriceverEntity[] {
		const dto = new MainDataDto<IStock2matPriceverEntity>(loaded);
		return dto.Main;
	}

	protected override onCreateSucceeded(loaded: object): IStock2matPriceverEntity {
		const parent = this.getSelectedParent();
		const entity = loaded as IStock2matPriceverEntity;
		if (entity && parent) {
			entity.PrjStockFk = parent.ProjectStockFk;
			entity.MdcMaterialCatalogFk = parent.MaterialCatalogFk;
		}
		return entity;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: MaterialComplete, modified: IStock2matPriceverEntity[], deleted: IStock2matPriceverEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.Stock2matPriceverToSave = modified;
		}
		if (deleted && deleted.some(() => true)) {
			parentUpdate.Stock2matPriceverToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MaterialComplete): IStock2matPriceverEntity[] {
		return (complete && complete.Stock2matPriceverToSave) ? complete.Stock2matPriceverToSave : [];
	}

	public override isParentFn(parentKey: IMaterial2ProjectStockEntity, entity: IStock2matPriceverEntity): boolean {
		return entity.PrjStockFk === parentKey.ProjectStockFk;
	}

	private provideNewEntityValidationProcessor() {
		return this.validationProcessor.createProcessor(BasicsMaterialPriceVersionToStockListValidationService, {
			moduleSubModule: 'Basics.Material',
			typeName: 'Stock2matPriceverDto',
		});
	}
}