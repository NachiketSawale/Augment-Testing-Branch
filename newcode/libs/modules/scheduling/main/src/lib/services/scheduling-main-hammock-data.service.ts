/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions,} from '@libs/platform/data-access';
import { IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IActivityEntity,IHammockActivityEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainDataService } from './scheduling-main-data.service';
@Injectable({
	providedIn: 'root'
})

export class SchedulingMainHammockDataService extends DataServiceFlatLeaf<IHammockActivityEntity,
	IActivityEntity, ActivityComplete> {

	public constructor(schedulingMainDataService : SchedulingMainDataService) {
		const options: IDataServiceOptions<IHammockActivityEntity> = {
			apiUrl: 'scheduling/main/hammock',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					const selection = schedulingMainDataService.getSelection()[0];
					return { PKey1: selection.Id};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IHammockActivityEntity,
				IActivityEntity, ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'HammockActivity',
				parent: schedulingMainDataService
			}
		};
		super(options);
	}

	public override isParentFn(parentKey: IActivityEntity, entity: IHammockActivityEntity): boolean {
		return entity.ActivityFk === parentKey.Id;
	}

}
