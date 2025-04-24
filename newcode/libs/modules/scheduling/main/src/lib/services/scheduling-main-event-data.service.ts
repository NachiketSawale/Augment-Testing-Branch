/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IActivityEntity,IEventEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainDataService } from './scheduling-main-data.service';
import { IIdentificationData } from '@libs/platform/common';
@Injectable({
	providedIn: 'root'
})

export class SchedulingMainEventDataService extends DataServiceFlatLeaf<IEventEntity,
	IActivityEntity, ActivityComplete> {

	public constructor(schedulingMainDataService : SchedulingMainDataService) {
		const options: IDataServiceOptions<IEventEntity> = {
			apiUrl: 'scheduling/main/event',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					const selection = schedulingMainDataService.getSelection()[0];
					return { mainItemId: selection.Id };
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					const selection = schedulingMainDataService.getSelectedEntity();
					return {
						PKey1: selection?.Id,
						PKey2: selection?.ScheduleFk
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IEventEntity,
				IActivityEntity, ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Events',
				parent: schedulingMainDataService
			}
		};
		super(options);
	}

	public override registerModificationsToParentUpdate(complete: ActivityComplete, modified: IEventEntity[], deleted: IEventEntity[]) {
		if (modified && modified.length > 0) {
			complete.EventsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.EventsToDelete = deleted;
		}
	}

	public override isParentFn(parentKey: IActivityEntity, entity: IEventEntity): boolean {
		return entity.ActivityFk === parentKey.Id;
	}

}
