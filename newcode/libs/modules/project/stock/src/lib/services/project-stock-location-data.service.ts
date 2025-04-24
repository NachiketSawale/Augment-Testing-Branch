/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceHierarchicalLeaf, EntityArrayProcessor, IDataServiceChildRoleOptions, IDataServiceOptions } from '@libs/platform/data-access';
import { IProjectStockLocationEntity, IProjectStockComplete, IProjectStockEntity } from '@libs/project/interfaces';
import { IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { BasicsSharedTreeDataHelperService } from '@libs/basics/shared';
import { set } from 'lodash';
import { ProjectStockDataService } from './project-stock-data.service';


@Injectable({
	providedIn: 'root'
})

export class ProjectStockLocationDataService extends DataServiceHierarchicalLeaf<IProjectStockLocationEntity,
	IProjectStockEntity, IProjectStockComplete> {

	private treeDataHelper = inject(BasicsSharedTreeDataHelperService);

	public constructor() {
		const options: IDataServiceOptions<IProjectStockLocationEntity> = {
			apiUrl: 'project/stock/location',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'instances',
				usePost: true
			},
			createInfo:{
				prepareParam: ident => {
					const param = {
						Id: ident.id
					};
					if (ident.id === 0 && ident.pKey1 !== undefined){
						set(param, 'Id', ident.pKey1);
					}
					if(ident.pKey1 !== undefined && ident.pKey1 !== param.Id) {
						set(param, 'PKey1', ident.pKey1);
					}

					return param;
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectStockLocationEntity, IProjectStockEntity, IProjectStockComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'StockLocations',
				parent: inject(ProjectStockDataService)
			},
			processors: [new EntityArrayProcessor<IProjectStockLocationEntity>(['SubLocations'])]
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const stock = this.getSelectedParent();
		return {
			PKey1: stock?.Id,
			filter: ''
		};
	}

	protected override onLoadSucceeded(loaded: object): IProjectStockLocationEntity[] {
		let entities = loaded as IProjectStockLocationEntity[];

		entities = this.treeDataHelper.flatTreeArray(entities, e => e.SubLocations);

		return entities;
	}

	public override childrenOf(element: IProjectStockLocationEntity): IProjectStockLocationEntity[] {
		return element.SubLocations ?? [];
	}

	public override parentOf(element: IProjectStockLocationEntity): IProjectStockLocationEntity | null {
		if (element.StockFk == null) {
			return null;
		}

		const parentId = element.StockFk;
		const parent = this.flatList().find(candidate => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}
}
