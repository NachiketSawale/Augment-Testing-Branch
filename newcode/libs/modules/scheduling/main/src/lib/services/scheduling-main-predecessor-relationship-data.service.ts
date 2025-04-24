/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IActivityEntity, IActivityRelationshipEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainDataService } from './scheduling-main-data.service';
@Injectable({
	providedIn: 'root'
})

export class SchedulingMainPredecessorRelationshipDataService extends DataServiceFlatLeaf<IActivityRelationshipEntity,
	IActivityEntity, ActivityComplete> {

	public constructor(protected schedulingMainDataService : SchedulingMainDataService) {
		const options: IDataServiceOptions<IActivityRelationshipEntity> = {
			apiUrl: 'scheduling/main/relationship',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listchild',
				usePost: false,
				prepareParam: ident => {
					const selection = schedulingMainDataService.getSelection()[0];
					return { mainItemId: selection.Id };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IActivityRelationshipEntity,
				IActivityEntity, ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Relationships',
				parent: schedulingMainDataService
			}
		};
		super(options);
	}

	/**
	 * create update entity
	 * @param created
	 */
	protected override onCreateSucceeded(created: object): IActivityRelationshipEntity {
		const complete = created as ActivityComplete;
		if (complete && complete.RelationshipsToSave) {
			return complete.RelationshipsToSave[0];
		}
		return created as IActivityRelationshipEntity;
	}

	protected override provideCreatePayload(): object {
		const selection = this.schedulingMainDataService.getSelection()[0];
		return { ChildItemId: selection.Id, ScheduleId: selection.ScheduleFk };
	}

	public override isParentFn(parentKey: IActivityEntity, entity: IActivityRelationshipEntity): boolean {
		return entity.ChildActivityFk === parentKey.Id;
	}
}
