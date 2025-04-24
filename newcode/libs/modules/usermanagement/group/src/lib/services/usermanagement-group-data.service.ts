/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';

import { UsermanagementGroupComplete } from '../model/usermanagement-group-complete.class';
import { IAccessGroupEntity } from '../model/entities/access-group-entity.interface';



@Injectable({
	providedIn: 'root'
})

export class UsermanagementGroupDataService extends DataServiceFlatRoot<IAccessGroupEntity, UsermanagementGroupComplete> {

	public constructor() {
		const options: IDataServiceOptions<IAccessGroupEntity> = {
			apiUrl: 'usermanagement/main/group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceRoleOptions<IAccessGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'Group',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IAccessGroupEntity | null): UsermanagementGroupComplete {
		const complete = new UsermanagementGroupComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Group = [modified];
		}

		return complete;
	}

}





