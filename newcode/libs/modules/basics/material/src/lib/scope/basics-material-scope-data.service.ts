/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';

import { IMaterialEntity, IMaterialScopeEntity } from '@libs/basics/interfaces';
import { BasicsMaterialRecordDataService } from '../material/basics-material-record-data.service';
import { max } from 'mathjs';
import { MaterialComplete } from '../model/complete-class/material-complete.class';
import { MaterialScopeComplete } from '../model/complete-class/material-scope-complete.class';

export const BASICS_MATERIAL_SCOPE_DATA_TOKEN = new InjectionToken<BasicsMaterialScopeDataService>('basicsMaterialScopeDataToken');

/**
 * Material scope with container name "Variant" data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialScopeDataService extends DataServiceFlatNode<IMaterialScopeEntity, MaterialScopeComplete, IMaterialEntity, MaterialComplete> {

	public constructor(private materialRecordDataService: BasicsMaterialRecordDataService) {
		super({
			apiUrl: 'basics/material/scope',
			roleInfo: <IDataServiceChildRoleOptions<IMaterialScopeEntity, IMaterialEntity, MaterialComplete>>{
				role: ServiceRole.Node,
				itemName: 'Scope',
				parent: materialRecordDataService
			},
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			createInfo:{
				endPoint: 'createnew',
				usePost: true
			}
		});

	}

	protected override provideLoadPayload(): object {
		const selected = this.getSelectedParent();
		if (selected){
			return {
				mainItemId: selected.Id
			};
		} else {
			throw new Error('There should be a selected parent material to load the scope data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IMaterialScopeEntity[] {

		return loaded as IMaterialScopeEntity[];
	}

	protected override provideCreatePayload(): object {
		const selected = this.getSelectedParent();
		if (selected){
			return {
				Id: { Id: selected.Id },
				MaxNo:  max([...this.getList().map(e=> e.MatScope),0])
			};
		} else {
			throw new Error('There should be a selected parent material to load the scope data');
		}
	}

	protected override onCreateSucceeded(loaded: object): IMaterialScopeEntity {

		const createdEntity = loaded as IMaterialScopeEntity;
		createdEntity.IsSelected = true;
		this.getList().forEach(e => e.IsSelected = false);

		return createdEntity;
	}

	public override createUpdateEntity(modified: IMaterialScopeEntity | null): MaterialScopeComplete {
		return new MaterialScopeComplete(modified);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: MaterialComplete, modified: MaterialComplete[], deleted: IMaterialScopeEntity[]): void {
		if (modified && modified.some(() =>	true)) {
			parentUpdate.MaterialScopeToSave = modified;
		}

		if (deleted && deleted.some(() =>	true)) {
			parentUpdate.MaterialScopeToDelete	= deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MaterialComplete): IMaterialScopeEntity[] {
		if	(complete && complete.MaterialScopeToSave) {
			return complete.MaterialScopeToSave.map(e => e.MaterialScope!);
		}

		return [];
	}

	public override isParentFn(parentKey: IMaterialEntity, entity: IMaterialScopeEntity): boolean {
		return entity.MaterialFk === parentKey.Id;
	}
}
