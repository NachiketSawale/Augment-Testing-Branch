/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceHierarchicalLeaf, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { BasicsMaterialCatalogDataService } from '../material-catalog/basics-material-catalog-data.service';
import { set } from 'lodash';
import { BasicsSharedTreeDataHelperService, IMaterialCatalogEntity } from '@libs/basics/shared';
import { IMaterialDiscountGroupEntity } from '../model/entities/material-discount-group-entity.interface';
import { MaterialCatalogComplete } from '../model/material-catalog-complete.class';

export const BASICS_MATERIAL_CATALOG_DISCOUNT_GROUP_DATA_TOKEN = new InjectionToken<BasicsMaterialCatalogDiscountGroupDataService>('BasicsMaterialCatalogDiscountGroupDataService');

/**
 * Material catalog discount group data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialCatalogDiscountGroupDataService extends DataServiceHierarchicalLeaf<IMaterialDiscountGroupEntity, IMaterialCatalogEntity, MaterialCatalogComplete> {
	private treeDataHelper = inject(BasicsSharedTreeDataHelperService);

	public constructor(private catalogService: BasicsMaterialCatalogDataService) {
		super({
			apiUrl: 'basics/materialcatalog/discountgroup',
			roleInfo: <IDataServiceChildRoleOptions<IMaterialDiscountGroupEntity, IMaterialCatalogEntity, MaterialCatalogComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MaterialDiscountGroup',
				parent: catalogService,
			},
			createInfo: {
				prepareParam: (ident) => {
					const params = {};

					if (ident.id) {
						// todo - create sub data, id and pkey are reversed in this case
						set(params, 'MainItemId', ident.id);
						set(params, 'MaterialDiscountGroupFk', ident.pKey1!);
						set(params, 'parentId', ident.pKey1!);
					} else {
						set(params, 'MainItemId', ident.pKey1!);
					}

					return params;
				},
			},
			readInfo: {
				endPoint: 'tree',
			},
		});
	}

	protected override provideLoadPayload(): object {
		const catalog = this.catalogService.getSelection();
		return {
			mainItemId: catalog[0].Id,
		};
	}

	protected override onLoadSucceeded(loaded: object): IMaterialDiscountGroupEntity[] {
		return loaded as IMaterialDiscountGroupEntity[];
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: MaterialCatalogComplete, modified: IMaterialDiscountGroupEntity[], deleted: IMaterialDiscountGroupEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.MaterialDiscountGroupToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.MaterialDiscountGroupToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MaterialCatalogComplete): IMaterialDiscountGroupEntity[] {
		return complete?.MaterialDiscountGroupToSave ?? [];
	}

	public override childrenOf(element: IMaterialDiscountGroupEntity): IMaterialDiscountGroupEntity[] {
		return element.ChildItems ?? [];
	}

	public override parentOf(element: IMaterialDiscountGroupEntity): IMaterialDiscountGroupEntity | null {
		if (element.MaterialDiscountGroupFk == null) {
			return null;
		}

		const parentId = element.MaterialDiscountGroupFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public override isParentFn(parentKey: IMaterialCatalogEntity, entity: IMaterialDiscountGroupEntity): boolean {
		return entity.MaterialCatalogFk === parentKey.Id;
	}
}
