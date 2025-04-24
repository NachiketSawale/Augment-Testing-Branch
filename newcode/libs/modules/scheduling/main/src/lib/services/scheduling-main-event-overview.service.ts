/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IActivityEntity,IEventEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainDataService } from './scheduling-main-data.service';
import { SchedulingMainReadonlyProcessorService } from './scheduling-main-readonly-processor.service';

@Injectable({
	providedIn: 'root'
})

export class SchedulingMainEventOverviewService extends DataServiceFlatLeaf<IEventEntity,
	IActivityEntity, ActivityComplete> {
	public constructor(private schedulingMainService: SchedulingMainDataService) {
		const options: IDataServiceOptions<IEventEntity> = {
			apiUrl: 'scheduling/main/event',
			roleInfo: <IDataServiceChildRoleOptions<IEventEntity, IActivityEntity, ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Events',
				parent: schedulingMainService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listall',
				usePost: true,
				prepareParam: ident => {
					const immediateresult = this.schedulingMainService.getList();
					const collectIds = (data: IActivityEntity | IActivityEntity[]): number[] => {
						let ids: number[] = [];
						if (Array.isArray(data)) {
							// If data is an array, recursively process each element
							data.forEach(item => {
								ids = ids.concat(collectIds(item));
							});
						} else if (typeof data === 'object' && data !== null) {
							// Collect the Id from the current object
							if ('Id' in data) {
								ids.push(data.Id);
							}
							// If the object has an Activities array, recursively process it
							if (data.Activities && Array.isArray(data.Activities)) {
								ids = ids.concat(collectIds(data.Activities));
							}
						}
						return ids;
					};

					const allIds = collectIds(immediateresult);
					return {
								filter: allIds
							};
				}
			},
			entityActions: {
				deleteSupported: false,
				createSupported: false
			},
		};
		super(options);

		this.processor.addProcessor(new SchedulingMainReadonlyProcessorService<IEventEntity>(this));
	}

	public override registerModificationsToParentUpdate(complete: ActivityComplete, modified: IEventEntity[], deleted: IEventEntity[]) {
		if (modified && modified.length > 0) {
			complete.EventsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.EventsToDelete = deleted;
		}
	}

}
