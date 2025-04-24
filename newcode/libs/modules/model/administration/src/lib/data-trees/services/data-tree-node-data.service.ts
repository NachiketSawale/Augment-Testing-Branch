/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Injectable,
	inject
} from '@angular/core';
import {
	DataServiceHierarchicalLeaf,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {
	IDataTreeComplete,
	IDataTreeEntity, IDataTreeLevelEntity,
	IDataTreeNodeEntity
} from '../model/entities/entities';
import { ModelAdministrationDataTreeDataService } from './data-tree-data.service';
import { IDataTreeNodeListEntity } from '../model/entities/data-tree-node-list-entity.interface';

/**
 * The data service for the viewer settings entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationDataTreeNodeDataService
	extends DataServiceHierarchicalLeaf<IDataTreeNodeEntity, IDataTreeEntity, IDataTreeComplete> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super({
			apiUrl: 'model/administration/datatreenode',
			readInfo: {
				endPoint: 'list'
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IDataTreeNodeEntity, IDataTreeEntity, IDataTreeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'DataTreeNodes',
				parent: inject(ModelAdministrationDataTreeDataService)
			}
		});
	}

	protected override onLoadSucceeded(loaded: object): IDataTreeNodeEntity[] {
		const data = <IDataTreeNodeListEntity>loaded;

		const levelsById: {
			[id: number]: IDataTreeLevelEntity
		} = {};
		for (const level of data.Levels) {
			levelsById[level.Id] = level;
		}

		const nodesById: {
			[id: number]: IDataTreeNodeEntity
		} = {};
		for (const node of data.Nodes) {
			nodesById[node.Id] = node;
			if (!node.ChildDataTreeNodeEntities) {
				node.ChildDataTreeNodeEntities = [];
			}

			if (node.DataTreeLevelFk) {
				node.level = levelsById[node.DataTreeLevelFk];
			}
		}

		return data.Nodes;
	}

	public override parentOf(element: IDataTreeNodeEntity): IDataTreeNodeEntity | null {
		return element.ParentDataTreeNodeEntity ?? null;
	}

	public override childrenOf(element: IDataTreeNodeEntity): IDataTreeNodeEntity[] {
		return element.ChildDataTreeNodeEntities ?? [];
	}
}
