/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import {
	DataServiceFlatRoot,
	ServiceRole,IDataServiceOptions,
	IDataServiceEndPointOptions,
	IDataServiceRoleOptions
} from '@libs/platform/data-access';

import { UsermanagementUserComplete } from '../model/usermanagement-user-complete.class';
import { IUserEntity } from '@libs/usermanagement/interfaces';

@Injectable({
	providedIn: 'root'
})

export class UsermanagementUserDataService extends DataServiceFlatRoot<IUserEntity, UsermanagementUserComplete> {

	public constructor() {
		const options: IDataServiceOptions<IUserEntity> = {
			apiUrl: 'usermanagement/main/user',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listFiltered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deleteUser'
			},
			roleInfo: <IDataServiceRoleOptions<IUserEntity>>{
				role: ServiceRole.Root,
				itemName: 'User',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IUserEntity | null): UsermanagementUserComplete {
		const complete = new UsermanagementUserComplete();
		if (modified !== null && typeof modified.Id === 'number') {
			complete.MainItemId = modified.Id;
			complete.User = modified;
		}

		return complete;
	}

	/**
	 * Checks whether the delete function is currently enabled.
	 */
	public override canDelete(): boolean {
		const selItems = this.getSelection();
		return selItems.length > 0 ?
			(selItems.every(item => !item.IsProtected) && super.canDelete()) :
			super.canDelete();
	}
}





