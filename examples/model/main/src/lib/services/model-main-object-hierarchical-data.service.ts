/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IModelObjectEntity } from '../model/models';
import { ModelObjectComplete } from '../model/model-main-object-complete.class';
import { ModelMainObjectDataService } from './model-main-object-data.service';
import { CompleteIdentification } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})

export class ModelMainObjectHierarchicalDataService extends DataServiceFlatNode<IModelObjectEntity, CompleteIdentification<IModelObjectEntity>,IModelObjectEntity, ModelObjectComplete >{

	public constructor(private objectDataService: ModelMainObjectDataService ) {
		const options: IDataServiceOptions<IModelObjectEntity>  = {
			apiUrl: 'model/main/object',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'objectstructure',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IModelObjectEntity,IModelObjectEntity, ModelObjectComplete >>{
				role: ServiceRole.Node,
				itemName: '',
				parent: objectDataService,
			},
		};

		super(options);
	}
	
	protected override provideLoadPayload(): object {
		if (this.objectDataService.hasSelection()) {
			const item = this.objectDataService.getSelection()[0];
		return {modelId : item.ModelFk};
		}
		return {};
	}

	public childrenOf(element: IModelObjectEntity): IModelObjectEntity[] {
			return element.Children ?? [];
	}

	public parentOf(element: IModelObjectEntity): IModelObjectEntity | null{
		if(element.ModelObjectEntities_ModelFk_MdlObjectFk == null) {
			return null;
		}
		const parentId = element.ModelObjectEntity_ModelFk_MdlObjectFk;
		return parentId == undefined ? null : parentId;
	}

	//TODO pinningcontext
	// function getPinningContext(pinnedContext) {
	// 	if (pinnedContext) {
	// 		var found = _.find(pinnedContext, {token: 'model.main'});
	// 		if (found && selectedModel && selectedModel.Id !== found.id || !selectedModel && found) {
	// 			var exist = _.find(serviceContainer.data.itemList, {ModelFk: found.id});
	// 			selectedModel = {Id: found.id};
	// 			if (_.isNil(exist)) {
	// 				serviceContainer.service.load();
	// 			}
	// 		} else if (_.isNil(found)) {
	// 			if (selectedModel && selectedModel.Id) {
	// 				serviceContainer.service.load();
	// 			} else {
	// 				selectedModel = null;
	// 				serviceContainer.data.itemTree.length = 0;
	// 				serviceContainer.data.itemList.length = 0;
	// 				serviceContainer.data.listLoaded.fire();
	// 			}
	// 		}
	// 	}
	// }

	
	//TODO modelmainfilterservice
	// public markersChanged(itemList:IModelObjectEntity[]) {
	// 	if(Array.isArray(itemList) && itemList.length > 0) {

	// 	}
	// }
}



		
			





