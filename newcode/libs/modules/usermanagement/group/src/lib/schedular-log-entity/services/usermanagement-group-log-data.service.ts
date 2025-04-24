/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';

import { UsermanagementGroupLogComplete } from '../model/usermanagement-group-log-complete.class';
import { IJobEntity } from '../model/entities/job-entity.interface';

/**
 * Usermanagement Group Log Data service  
 */

@Injectable({
	providedIn: 'root'
})

export class UsermanagementGroupLogDataService extends DataServiceFlatRoot<IJobEntity, UsermanagementGroupLogComplete> {

	public constructor() {
		const options: IDataServiceOptions<IJobEntity> = {
			apiUrl: 'usermanagement/main/log/',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false 
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete' 
			},
			roleInfo: <IDataServiceRoleOptions<IJobEntity>>{
				role: ServiceRole.Root,
				itemName: 'Job', 
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IJobEntity | null): UsermanagementGroupLogComplete {
		const complete = new UsermanagementGroupLogComplete();
		if (modified !== null && modified.Id !== undefined) {
			complete.Id = modified.Id;
			complete.Datas = [modified];
		}

		return complete;
	}

}





