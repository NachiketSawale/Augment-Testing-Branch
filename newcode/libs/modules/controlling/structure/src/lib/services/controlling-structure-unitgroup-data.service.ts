/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ControllingStructureGridDataService } from './controlling-structure-grid-data.service';
import { IControllingUnitEntity, IControllingUnitGroupEntity } from '../model/models';
import { ControllingStructureGridComplete } from '../model/controlling-structure-grid-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ControllingStructureUnitgroupDataService extends DataServiceFlatLeaf<IControllingUnitGroupEntity, IControllingUnitEntity, ControllingStructureGridComplete> {

	public constructor(parentService: ControllingStructureGridDataService) {
		const options: IDataServiceOptions<IControllingUnitGroupEntity> = {
			apiUrl: 'controlling/structure/unitgroup',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						MainItemId: ident.pKey1!
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IControllingUnitGroupEntity, IControllingUnitEntity, ControllingStructureGridComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ControllingUnitGroups',
				parent: parentService,
			},
		};
		super(options);
	}

	public override registerModificationsToParentUpdate(parentUpdate: ControllingStructureGridComplete, modified: IControllingUnitGroupEntity[], deleted: IControllingUnitGroupEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.ControllingUnitGroupsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.ControllingUnitGroupsToDelete = deleted;
		}
	}
	public override registerByMethod(): boolean {
		return true;
	}

	public override getSavedEntitiesFromUpdate(complete: ControllingStructureGridComplete): IControllingUnitGroupEntity[] {
		if (complete && complete.ControllingUnitGroupsToSave) {
			return complete.ControllingUnitGroupsToSave;
		}
		return [];
	}
}



