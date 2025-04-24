/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';

import { BasicsMaterialGroupCharDataService } from '../attribute/basics-material-group-char-data.service';
import { IMaterialGroupCharvalEntity } from '../model/entities/material-group-charval-entity.interface';
import { IMaterialGroupCharEntity } from '../model/entities/material-group-char-entity.interface';
import { MaterialGroupCharComplete } from '../model/material-group-char-complete.class';

/**
 * The material group attribute value data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialGroupCharValDataService extends DataServiceFlatLeaf<IMaterialGroupCharvalEntity, IMaterialGroupCharEntity, MaterialGroupCharComplete> {
	public constructor(private parentService: BasicsMaterialGroupCharDataService) {
		super({
			apiUrl: 'basics/materialcatalog/groupcharval',
			roleInfo: <IDataServiceChildRoleOptions<IMaterialGroupCharvalEntity, IMaterialGroupCharEntity, MaterialGroupCharComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MaterialGroupCharval',
				parent: parentService,
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

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: MaterialGroupCharComplete, modified: IMaterialGroupCharvalEntity[], deleted: IMaterialGroupCharvalEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.MaterialGroupCharvalToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.MaterialGroupCharvalToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MaterialGroupCharComplete): IMaterialGroupCharvalEntity[] {
		return complete?.MaterialGroupCharvalToSave ?? [];
	}

	public override isParentFn(parentKey: IMaterialGroupCharEntity, entity: IMaterialGroupCharvalEntity): boolean {
		return entity.MaterialGroupCharFk === parentKey.Id;
	}
}
