/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceHierarchicalNode, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { BasicsMaterialCatalogDataService } from '../material-catalog/basics-material-catalog-data.service';
import { set } from 'lodash';
import { BasicsSharedTreeDataHelperService, IMaterialCatalogEntity, IMaterialGroupEntity, MainDataDto, skipNullMap } from '@libs/basics/shared';
import { MaterialCatalogComplete } from '../model/material-catalog-complete.class';
import { MaterialGroupComplete } from '../model/material-group-complete.class';

export const BASICS_MATERIAL_GROUP_DATA_TOKEN = new InjectionToken<BasicsMaterialGroupDataService>('basicsMaterialGroupDataService');

/**
 * Material group data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialGroupDataService extends DataServiceHierarchicalNode<IMaterialGroupEntity, MaterialGroupComplete, IMaterialCatalogEntity, MaterialCatalogComplete> {
	private treeDataHelper = inject(BasicsSharedTreeDataHelperService);

	public constructor(private catalogService: BasicsMaterialCatalogDataService) {
		super({
			apiUrl: 'basics/materialcatalog/group',
			roleInfo: <IDataServiceChildRoleOptions<IMaterialGroupEntity, IMaterialCatalogEntity, MaterialCatalogComplete>>{
				role: ServiceRole.Node,
				itemName: 'MaterialGroup',
				parent: catalogService,
			},
			createInfo: {
				prepareParam: (ident) => {
					const params = {};

					if (ident.id) {
						// todo - create sub data, id and pkey are reversed in this case
						set(params, 'MainItemId', ident.id);
						set(params, 'MaterialGroupFk', ident.pKey1!);
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

	protected override onLoadSucceeded(loaded: object): IMaterialGroupEntity[] {
		const dto = new MainDataDto<IMaterialGroupEntity>(loaded);
		return dto.Main;
	}

	public override childrenOf(element: IMaterialGroupEntity): IMaterialGroupEntity[] {
		if (!element.ChildItems) {
			element.ChildItems = [];
		}
		return element.ChildItems;
	}

	public override parentOf(element: IMaterialGroupEntity): IMaterialGroupEntity | null {
		if (element.MaterialGroupFk == null) {
			return null;
		}

		const parentId = element.MaterialGroupFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public override createUpdateEntity(modified: IMaterialGroupEntity | null): MaterialGroupComplete {
		return new MaterialGroupComplete(modified);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: MaterialCatalogComplete, modified: MaterialGroupComplete[], deleted: IMaterialGroupEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.MaterialGroupToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.MaterialGroupToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MaterialCatalogComplete): IMaterialGroupEntity[] {
		return skipNullMap(complete.MaterialGroupToSave, (e) => e.MaterialGroup);
	}

	public override isParentFn(parentKey: IMaterialCatalogEntity, entity: IMaterialGroupEntity): boolean {
		return entity.MaterialCatalogFk === parentKey.Id;
	}
}
