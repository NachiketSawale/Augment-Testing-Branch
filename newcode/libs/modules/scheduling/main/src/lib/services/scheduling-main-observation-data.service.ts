/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IActivityEntity ,IActivityObservationEntity} from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainDataService } from './scheduling-main-data.service';
@Injectable({
	providedIn: 'root'
})

export class SchedulingMainObservationDataService extends DataServiceFlatLeaf<IActivityObservationEntity,
	IActivityEntity, ActivityComplete> {

	public constructor(schedulingMainDataService : SchedulingMainDataService) {
		const options: IDataServiceOptions<IActivityObservationEntity> = {
			apiUrl: 'scheduling/main/observation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					const selection = schedulingMainDataService.getSelection()[0];
					return { PKey1: selection.Id };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IActivityObservationEntity,
				IActivityEntity, ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Observations',
				parent: schedulingMainDataService
			}
		};
		super(options);
	}

	public override registerModificationsToParentUpdate(complete: ActivityComplete, modified: IActivityObservationEntity[], deleted: IActivityObservationEntity[]) {
		if (modified && modified.length > 0) {
			complete.ObservationsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.ObservationsToDelete = deleted;
		}
	}

}
