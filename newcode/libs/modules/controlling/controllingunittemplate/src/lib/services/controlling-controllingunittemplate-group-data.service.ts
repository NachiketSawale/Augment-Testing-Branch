
/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IControltemplateGroupEntity, IControltemplateUnitEntity } from '../model/models';
import { ControllingControllingunittemplateUnitDataService } from './controlling-controllingunittemplate-unit-data.service';
import { ControllingControllingunittemplateUnitComplete } from '../model/controlling-controllingunittemplate-unit-complete.class';

export const CONTROLLING_CONTROLLINGUNITTEMPLATE_GROUP_DATA_TOKEN = new InjectionToken<ControllingControllingunittemplateGroupDataService>('controllingControllingunittemplateGroupDataToken');

@Injectable({
	providedIn: 'root'
})

export class ControllingControllingunittemplateGroupDataService extends DataServiceFlatLeaf<IControltemplateGroupEntity, IControltemplateUnitEntity, ControllingControllingunittemplateUnitComplete> {

	public constructor(parentService: ControllingControllingunittemplateUnitDataService) {
		const options: IDataServiceOptions<IControltemplateGroupEntity> = {
			apiUrl: 'controlling/controllingunittemplate/unit/group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,

			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multiDelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IControltemplateGroupEntity, IControltemplateUnitEntity, ControllingControllingunittemplateUnitComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ControllingUnitTemplateGroups',
				parent: parentService,
			}
		};

		super(options);
	}


	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: ControllingControllingunittemplateUnitComplete, modified: IControltemplateGroupEntity[], deleted: IControltemplateGroupEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.ControllingUnitTemplateGroupsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.ControllingUnitTemplateGroupsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: ControllingControllingunittemplateUnitComplete): IControltemplateGroupEntity[] {
		if (complete && complete.ControllingUnitTemplateGroupsToSave) {
			return complete.ControllingUnitTemplateGroupsToSave;
		}
		return [];
	}
}
