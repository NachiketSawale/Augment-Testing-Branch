/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IModelObjectInfo, IViewerLegendItemEntity } from '../model/models';
@Injectable({
	providedIn: 'root'
})

export class ModelMainObjectInfoDataService extends DataServiceHierarchicalLeaf<IModelObjectInfo, IViewerLegendItemEntity, '//TODO:PU complete entity of the parent data service'> {

	public constructor() {
		const options: IDataServiceOptions<IModelObjectInfo> = {
			apiUrl: 'model/main/objectinfo',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getattributes',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IModelObjectInfo, IViewerLegendItemEntity, '//TODO:PU complete entity of the parent data service'>>{
				role: ServiceRole.Leaf,
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			}
		};
		super(options);
	}


	// TODO modelViewerCompositeModelObjectSelectionService from viewer module
	// TODO modelViewerModelSelectionService from viewer module
	// protected override provideLoadPayload(): object {
	// 	idGeneratorProcessor.nextId = 1;

	// 	let modelTreeInfo = null;
	// 	let nodeSubModelId = null;
	// 	let node = null;

	// 	const selObjects = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();
	// 	Object.keys(selObjects).some(function (subModelId) {
	// 		if (selObjects[subModelId].length > 0) {
	// 			modelTreeInfo = modelViewerObjectTreeService.getTree()[subModelId];
	// 			nodeSubModelId = parseInt(subModelId);
	// 			node = modelTreeInfo.byId[selObjects[subModelId][0]];
	// 			return true;
	// 		}
	// 		return false;
	// 	});

	// 	const selModel = modelViewerModelSelectionService.getSelectedModel();
	// 	if (modelTreeInfo && modelTreeInfo.tree) {
	// 		object.filter = '?parentModelId=' + selModel.info.modelId + '&modelId=' + selModel.subModelIdToGlobalModelId(modelTreeInfo.subModelId) + '&objectIds=' + (node.getAncestorIds().join(':'));
	// 	} else {
	// 		object.filter = '?parentModelId=' + selModel.info.modelId + '&modelId=' + selModel.subModelIdToGlobalModelId(nodeSubModelId) + '&objectIds=' + node.id;
	// 	}

	// }

	// protected override onLoadByFilterSucceeded(loaded: IModelObjectInfo){

	// return ;
	// }

	protected override onLoadSucceeded(loaded: IModelObjectInfo[]): IModelObjectInfo[] {
		let originalIndex = 1;
		loaded.forEach((item) => {
			item.index = originalIndex++;
		});
		loaded = loaded.sort((a, b) => {
			return a.Name.toLowerCase().localeCompare(b.Name.toLowerCase());
		});
		let index = 1;
		const groupNames :string[]= [];
		const parentId = index;
		type TreeItem = {
			index: number;
			Id: number;
			Name: string;
			parentId: number;
			image: string; // Optional property, only exists in items
			children?: TreeItem[]; // Optional property, exists only for groups
		  };
		let treeItemList:TreeItem[] = [];
		let groupObj: {
			children: []; index: number;Id: number; Name: string; parentId: number;image: string;
		};
		let groupChildren :object[]= [];

		loaded.forEach((item) => {
			item.image = 'tlb-icons ico-preview-form';
			const itemParts = item.Name.split('/');
			const n = itemParts.length;
			if (n > 1) {
				const groupName = itemParts[0];
				if (!groupNames.includes(groupName)) {
					// new group
					groupNames.push(groupName);
					groupObj.Id = index++;
					groupObj.Name = groupName;
					groupObj.parentId = parentId;
					treeItemList.push(groupObj);
					groupChildren = [];
				}
				item.Id = index++;
				item.parentId = groupObj.Id;
				item.Name = item.Name.replace(itemParts[0] + '/', '');
				groupChildren.push(item);
				groupObj.children = JSON.parse(JSON.stringify(groupChildren));
			} else {

				// no slash
				item.Id = index++;
				item.parentId = parentId;

				// we need no root, so directly pass the children
				treeItemList.push(item);
			}


		});
		treeItemList = treeItemList.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

		return treeItemList;
	}

}






