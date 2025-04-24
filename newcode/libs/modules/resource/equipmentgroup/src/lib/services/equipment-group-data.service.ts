/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceHierarchicalRoot } from '@libs/platform/data-access';
import { EquipmentGroupUpdate } from '../model/equipment-group-update.class';
import { IEquipmentGroupEntity } from '@libs/resource/interfaces';

export const EQUIPMENT_GROUP_DATA_TOKEN = new InjectionToken<EquipmentGroupDataService>('equipmentGroupDataToken');
@Injectable({
	providedIn: 'root'
})
export class EquipmentGroupDataService extends DataServiceHierarchicalRoot<IEquipmentGroupEntity,EquipmentGroupUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IEquipmentGroupEntity> = {
			apiUrl: 'resource/equipmentgroup',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IEquipmentGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'EquipmentGroup'
			},
			processors: [new EntityArrayProcessor<IEquipmentGroupEntity>(['SubResources'])]
		};
		super(options);
	}
	public override createUpdateEntity(modified: IEquipmentGroupEntity | null): EquipmentGroupUpdate {
		const complete = new EquipmentGroupUpdate();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.EquipmentGroups = [modified];
		}
		
		return complete;
	}
	public override getModificationsFromUpdate(complete: EquipmentGroupUpdate): IEquipmentGroupEntity[] {
		if (complete.EquipmentGroups === null){
			return complete.EquipmentGroups = [];
		}
		else{
			return complete.EquipmentGroups;
		}
	}
	public override parentOf(element: IEquipmentGroupEntity): IEquipmentGroupEntity | null {
		if (element.EquipmentGroupFk === undefined)
		{
			return null;
		}
		
		const parentId = element.EquipmentGroupFk;
		const foundParent = this.flatList().find(candidate => candidate.Id === parentId);
		
		if (foundParent === undefined)
		{
			return null;
		}
		
		return foundParent;
		
	}
	public override childrenOf(element: IEquipmentGroupEntity): IEquipmentGroupEntity[] {
		return element.SubGroups ?? [];
	}
}