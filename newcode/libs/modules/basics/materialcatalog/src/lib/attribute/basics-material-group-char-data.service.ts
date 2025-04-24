/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IMaterialGroupEntity, skipNullMap } from '@libs/basics/shared';

import { BasicsMaterialGroupDataService } from '../material-group/basics-material-group-data.service';
import { IMaterialGroupCharEntity } from '../model/entities/material-group-char-entity.interface';
import { MaterialGroupCharComplete } from '../model/material-group-char-complete.class';
import { MaterialGroupComplete } from '../model/material-group-complete.class';

/**
 * Material group attribute data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialGroupCharDataService extends DataServiceFlatNode<IMaterialGroupCharEntity, MaterialGroupCharComplete, IMaterialGroupCharEntity, MaterialGroupComplete> {
	public constructor(private groupService: BasicsMaterialGroupDataService) {
		super({
			apiUrl: 'basics/materialcatalog/groupchar',
			roleInfo: <IDataServiceChildRoleOptions<IMaterialGroupCharEntity, IMaterialGroupEntity, MaterialGroupComplete>>{
				role: ServiceRole.Node,
				itemName: 'MaterialGroupChar',
				parent: groupService,
			},
			createInfo: {
				prepareParam: (ident) => {
					return {
						MainItemId: ident.pKey1!,
					};
				},
			},
			readInfo: {
				endPoint: 'list',
				prepareParam: (ident) => {
					return {
						MainItemId: ident.pKey1!,
					};
				},
			},
		});
	}

	public override createUpdateEntity(modified: IMaterialGroupCharEntity | null): MaterialGroupCharComplete {
		return new MaterialGroupCharComplete(modified);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: MaterialGroupComplete, modified: MaterialGroupCharComplete[], deleted: IMaterialGroupCharEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.MaterialGroupCharToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.MaterialGroupCharToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MaterialGroupComplete): IMaterialGroupCharEntity[] {
		return skipNullMap(complete.MaterialGroupCharToSave, (e) => e.MaterialGroupChar);
	}

	public override isParentFn(parentKey: IMaterialGroupEntity, entity: IMaterialGroupCharEntity): boolean {
		return entity.MaterialGroupFk === parentKey.Id;
	}
}
