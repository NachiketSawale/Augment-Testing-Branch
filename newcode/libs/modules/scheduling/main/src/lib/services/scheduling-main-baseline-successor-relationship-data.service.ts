/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IActivityEntity, IActivityRelationshipEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainActivityBaselineComparison } from './scheduling-main-activity-baseline-comparison-data.service';
import { SchedulingMainReadonlyProcessorService } from './scheduling-main-readonly-processor.service';
@Injectable({
	providedIn: 'root'
})

export class SchedulingMainBaselineSuccessorRelationshipDataService extends DataServiceFlatLeaf<IActivityRelationshipEntity,
	IActivityEntity, ActivityComplete> {

	public constructor(schedulingMainActivityBaselineComparison : SchedulingMainActivityBaselineComparison) {
		const options: IDataServiceOptions<IActivityRelationshipEntity> = {
			apiUrl: 'scheduling/main/relationship',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listparent',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId: ident.id };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IActivityRelationshipEntity,
				IActivityEntity, ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Relationships',
				parent: schedulingMainActivityBaselineComparison
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			}
		};
		super(options);
		this.processor.addProcessor(new SchedulingMainReadonlyProcessorService<IActivityRelationshipEntity>(this));
	}

}
