/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ControllingControllingunittemplateUnitComplete } from '../model/controlling-controllingunittemplate-unit-complete.class';
import { IControltemplateEntity, IControltemplateUnitEntity } from '../model/models';
import { ControllingControllingunittemplateDataService } from './controlling-controllingunittemplate-data.service';
import { ControllingControllingunittemplateComplete } from '../model/controlling-controllingunittemplate-complete.class';


export const CONTROLLING_CONTROLLINGUNITTEMPLATE_UNIT_DATA_TOKEN = new InjectionToken<ControllingControllingunittemplateUnitDataService>('controllingControllingunittemplateUnitDataToken');

@Injectable({
	providedIn: 'root'
})

export class ControllingControllingunittemplateUnitDataService extends DataServiceFlatNode<IControltemplateUnitEntity, ControllingControllingunittemplateUnitComplete, IControltemplateEntity, ControllingControllingunittemplateComplete> {

	public constructor(parentService: ControllingControllingunittemplateDataService) {
		const options: IDataServiceOptions<IControltemplateUnitEntity> = {
			apiUrl: 'controlling/controllingunittemplate/unit',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'treebyparent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multiDelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IControltemplateUnitEntity, IControltemplateEntity, ControllingControllingunittemplateComplete>>{
				role: ServiceRole.Node,
				itemName: 'ControllingUnitTemplateUnits',
				parent: parentService
			}
		};

		super(options);
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: ControllingControllingunittemplateComplete, modified: ControllingControllingunittemplateUnitComplete[], deleted: IControltemplateUnitEntity[]): void {
		// if (modified && modified.some(() =>	true)) {
		// 	parentUpdate.ControllingUnitsToSave = modified;
		// }

		if (deleted && deleted.some(() =>	true)) {
			parentUpdate.ControllingUnitsToDelete	= deleted;
		}
	}


	public override createUpdateEntity(modified: IControltemplateUnitEntity | null): ControllingControllingunittemplateUnitComplete {
		const complete = new ControllingControllingunittemplateUnitComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.ControllingUnits = [modified];
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: ControllingControllingunittemplateUnitComplete): IControltemplateUnitEntity[] {
		if (complete.ControllingUnits === null) {
			complete.ControllingUnits = [];
		}
		return complete.ControllingUnits;
	}
}