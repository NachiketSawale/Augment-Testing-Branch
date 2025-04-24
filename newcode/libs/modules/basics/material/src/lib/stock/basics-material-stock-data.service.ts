/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatNode, ServiceRole,
	IDataServiceChildRoleOptions
} from '@libs/platform/data-access';
import { BasicsMaterialRecordDataService } from '../material/basics-material-record-data.service';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { IMaterial2ProjectStockEntity } from '../model/entities/material-2-project-stock-entity.interface';
import { MaterialComplete } from '../model/complete-class/material-complete.class';
import { BasicsSharedNewEntityValidationProcessorFactory } from '@libs/basics/shared';
import { BasicsMaterialStockValidationService } from './basics-material-stock-validation.service';

/**
 * The Basics Material Stock data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialStockDataService extends DataServiceFlatNode<IMaterial2ProjectStockEntity, MaterialComplete, IMaterialEntity, MaterialComplete> {
	private readonly validationProcessor = inject(BasicsSharedNewEntityValidationProcessorFactory);
	public constructor(public parentService: BasicsMaterialRecordDataService) {
		super({
			apiUrl: 'basics/material/material2projectstock',
			roleInfo: <IDataServiceChildRoleOptions<IMaterial2ProjectStockEntity, IMaterialEntity, MaterialComplete>>{
				role: ServiceRole.Node,
				itemName: 'Material2ProjectStock',
				parent: parentService
			},
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			createInfo:{
				endPoint: 'create',
				usePost: true
			}
		});
		this.processor.addProcessor([this.provideNewEntityValidationProcessor()]);
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				mainItemId: parent.Id
			};
		} else {
			throw new Error('There should be a selected parent Material record to load the Stock data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IMaterial2ProjectStockEntity[] {
		return loaded as IMaterial2ProjectStockEntity[];
	}

	protected override provideCreatePayload(): object {
		const selected = this.getSelectedParent();
		if (selected){
			return {
				mainItemId: selected.Id
			};
		} else {
			throw new Error('There should be a selected parent material to create the stock data');
		}
	}

	protected override onCreateSucceeded(loaded: object): IMaterial2ProjectStockEntity {
		const parent = this.getSelectedParent();
		const entity = loaded as IMaterial2ProjectStockEntity;
		if (entity && parent) {
			entity.MaterialFk = parent.Id;
		}
		return entity;
	}

	public override createUpdateEntity(modified: IMaterial2ProjectStockEntity | null): MaterialComplete {
		const complete = new MaterialComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Material2ProjectStock = modified;
		}

		return complete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: MaterialComplete, modified: MaterialComplete[], deleted: IMaterial2ProjectStockEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.Material2ProjectStockToSave = modified;
		}
		if (deleted && deleted.some(() => true)) {
			parentUpdate.Material2ProjectStockToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MaterialComplete): IMaterial2ProjectStockEntity[] {
		return (complete && complete.Material2ProjectStockToSave)
			? complete.Material2ProjectStockToSave.map(e => e.Material2ProjectStock).filter((e): e is IMaterial2ProjectStockEntity => e !== null && e !== undefined)
			: [];
	}

	public override isParentFn(parentKey: IMaterialEntity, entity: IMaterial2ProjectStockEntity): boolean {
		return entity.MaterialFk === parentKey.Id;
	}

	private provideNewEntityValidationProcessor() {
		return this.validationProcessor.createProcessor(BasicsMaterialStockValidationService, {
			moduleSubModule: 'Basics.Material',
			typeName: 'Material2ProjectStockDto'
		});
	}
}