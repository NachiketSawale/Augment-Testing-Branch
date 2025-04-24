/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable } from '@angular/core';
import { ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, DataServiceHierarchicalNode } from '@libs/platform/data-access';
import { ControllingStructureComplete, IControllingUnitEntity } from '../model/models';
import { ProjectMainForCOStructureDataService } from './project-main-for-costructure-data.service';
import { ControllingStructureGridComplete } from '../model/controlling-structure-grid-complete.class';
import { ControllingCommonProjectComplete, IControllingCommonProjectEntity } from '@libs/controlling/common';


@Injectable({
	providedIn: 'root'
})

export class ControllingStructureGridDataService extends DataServiceHierarchicalNode<IControllingUnitEntity, ControllingStructureGridComplete,IControllingCommonProjectEntity, ControllingCommonProjectComplete >{

	public constructor( parentService: ProjectMainForCOStructureDataService) {
		const options: IDataServiceOptions<IControllingUnitEntity>  = {
			apiUrl: 'controlling/structure',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false,
				prepareParam: ident => {
					return {
						MainItemId: ident.pKey1!
					};
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: ident => {
					const params = {
						mainItemId: ident.pKey1,
						projectId: parentService.getSelectedEntity() ?  parentService.getSelectedEntity()?.Id: 0,
						//parent: this.getSelectedEntity().
					};
					return params;
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IControllingUnitEntity,IControllingCommonProjectEntity, ControllingCommonProjectComplete>>{
				role: ServiceRole.Node,
				itemName: 'ControllingUnits',
				parent: parentService,
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: IControllingUnitEntity | null): ControllingStructureGridComplete {
		const complete = new ControllingStructureGridComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.ControllingUnits = [modified];
		}

		return complete;
	}

	public override registerNodeModificationsToParentUpdate(complete: ControllingStructureComplete, modified: ControllingStructureGridComplete[], deleted: IControllingUnitEntity[]) {
		// if (modified && modified.some(() => true)) {
		// 	complete.ControllingUnitsToSave = modified;
		// }
		if (modified && modified.some(() => true)) {
			complete.ControllingUnitsToDelete = deleted;
		}
	}

	public override getModificationsFromUpdate(complete: ControllingStructureGridComplete): IControllingUnitEntity[] {
		if (complete.ControllingUnits === null) {
			complete.ControllingUnits = [];
		}
		return complete.ControllingUnits;
	}

}





