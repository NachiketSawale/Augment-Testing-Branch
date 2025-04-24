/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';


import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IRequisitionEntity, IRequisitionitemEntity } from '@libs/resource/interfaces';
import { RequisitionComplete } from '../model/requisition-complete.class';
import { RequisitionItemComplete } from '../model/requisition-item-complete.class';
import { ResourceRequisitionDataService } from './resource-requisition-data.service';


@Injectable({
	providedIn: 'root'
})



export class ResourceRequisitionItemDataService extends DataServiceFlatNode<IRequisitionitemEntity, RequisitionItemComplete,IRequisitionEntity, RequisitionComplete >{

	public constructor( resourceRequisitionDataService:ResourceRequisitionDataService) {
		const options: IDataServiceOptions<IRequisitionitemEntity>  = {
			apiUrl: 'resource/requisition/requisitionitem',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},createInfo:{
				prepareParam: () => {
					const selection = resourceRequisitionDataService.getSelection()[0];
					return { Id: selection.Id};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IRequisitionitemEntity,IRequisitionEntity, RequisitionComplete>>{
				role: ServiceRole.Node,
				itemName: 'RequisitionItems',
				parent: resourceRequisitionDataService,
			},
		};

		super(options);
	}
	public override registerByMethod(): boolean {
		return true;
	}
	public override createUpdateEntity(modified: IRequisitionitemEntity | null): RequisitionItemComplete {
		const complete = new RequisitionItemComplete();
		if (modified !== null) {
			complete.RequisitionItemId = modified.Id;
			complete.RequisitionItems = [modified];
		}

		return complete;
	}

	public override registerNodeModificationsToParentUpdate(complete: RequisitionComplete, modified: RequisitionItemComplete[], deleted: IRequisitionitemEntity[]) {
		if (modified && modified.length > 0) {
			complete.RequisitionItemsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.RequisitionItemsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: RequisitionComplete): IRequisitionitemEntity[] {
		return (complete && complete.RequisitionItemsToSave)
			? complete.RequisitionItemsToSave.map(e => e.RequisitionItems!).flat()
			: [];
	}

	public override isParentFn(parentKey: IRequisitionEntity, entity: IRequisitionitemEntity): boolean {
		return entity.RequisitionFk === parentKey.Id;
	}
}










