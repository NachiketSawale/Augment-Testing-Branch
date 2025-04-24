/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IActivity2ModelObjectEntity, IActivityEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainDataService } from './scheduling-main-data.service';
import { SchedulingMainReadonlyProcessorService } from './scheduling-main-readonly-processor.service';
@Injectable({
	providedIn: 'root'
})

export class SchedulingMainModelObjectDataService extends DataServiceFlatLeaf<IActivity2ModelObjectEntity,
	IActivityEntity, ActivityComplete> {

	public constructor(schedulingMainDataService : SchedulingMainDataService) {
		const options: IDataServiceOptions<IActivity2ModelObjectEntity> = {
			apiUrl: 'scheduling/main/ojectmodelsimulation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParents',
				usePost: true,
				prepareParam: ident => {
					const selection = schedulingMainDataService.getSelection();
					return { Ids: selection.map(entity => entity.Id) };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IActivity2ModelObjectEntity,
				IActivityEntity, ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ObjModelSimulation',
				parent: schedulingMainDataService
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			}
		};
		super(options);

		this.processor.addProcessor(new SchedulingMainReadonlyProcessorService<IActivity2ModelObjectEntity>(this));
	}
}
