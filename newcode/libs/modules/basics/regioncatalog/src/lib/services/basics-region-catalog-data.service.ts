/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceHierarchicalLeaf } from '@libs/platform/data-access';

import { BasicsRegionCatalogEntity } from '../model/basics-region-catalog-entity.class';
import { BasicsRegionTypeComplete } from "../model/basics-region-type-complete.class";
import { BasicsRegionTypeEntity } from "../model/basics-region-type-entity.class";
import { BasicsRegionTypeDataService } from "./basics-region-type-data.service";

@Injectable({
	providedIn: 'root',
})
export class BasicsRegionCatalogDataService extends DataServiceHierarchicalLeaf<BasicsRegionCatalogEntity,BasicsRegionTypeEntity,BasicsRegionTypeComplete> {
	public constructor() {
		const options: IDataServiceOptions<BasicsRegionCatalogEntity> = {
			apiUrl: 'basics/regionCatalog',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false,
				prepareParam: ident => {
					return { RegionTypeId: ident.pKey1 };
				}
			},
			createInfo: {
				endPoint: 'create',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<BasicsRegionCatalogEntity,BasicsRegionTypeEntity,BasicsRegionTypeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'RegionCatalog',
				parent: inject(BasicsRegionTypeDataService)
			},
		};

		super(options);
	}

	protected override provideCreateChildPayload(): object {
		let creationData : object;
		const parentRegionType = this.getSelectedParent();
		let parentRegionCat = this.getSelection().length > 0 ? this.getSelection()[0] : null;
		let allItem : BasicsRegionCatalogEntity[];
		let sorting = 0;

		if(parentRegionCat === null){
			allItem = this.getList();
		}else{
			allItem = this.childrenOf(parentRegionCat);
		}

		if (allItem.length > 0) {
			allItem.sort(this.sortId);
			sorting = allItem[allItem.length - 1].Sorting + 1;
		}

		creationData = {
				MainItemId:  parentRegionType?.Id,
				RegionCatalogFk: parentRegionCat?.Id,
				RegionTypeFk : parentRegionType?.Id,
				Sorting: sorting,
				parent: parentRegionCat
			};

			return creationData;
	}

	protected override onCreateSucceeded(created: object): BasicsRegionCatalogEntity {
		return created as BasicsRegionCatalogEntity;
	}

	public override parentOf(element: BasicsRegionCatalogEntity): BasicsRegionCatalogEntity | null {
		if(element.RegionCatalogFk === undefined){
			return null;
		}

		const parentId = element.RegionCatalogFk;
		const foundParent = this.flatList().find(candidate => candidate.Id === parentId);

		if(foundParent === undefined){
			return null;
		}

		return foundParent;
	}

	public override childrenOf(element: BasicsRegionCatalogEntity): BasicsRegionCatalogEntity[] {
		return element.ChildItems ?? [];
	}

	private sortId = function(a: BasicsRegionCatalogEntity, b: BasicsRegionCatalogEntity){
		return a.Sorting - b.Sorting;
	}

	public override isParentFn(parentKey: BasicsRegionTypeEntity, entity: BasicsRegionCatalogEntity): boolean {
		return entity.RegionTypeFk === parentKey.Id;
	}
}
