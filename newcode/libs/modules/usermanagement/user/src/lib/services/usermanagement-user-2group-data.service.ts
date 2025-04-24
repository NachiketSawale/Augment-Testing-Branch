import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	ServiceRole/*, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole*/
} from '@libs/platform/data-access';
import { IAccessUsersInGroupEntity} from '@libs/usermanagement/interfaces';
import { IUserEntity } from '@libs/usermanagement/interfaces';
import { UsermanagementUserComplete } from '../model/usermanagement-user-complete.class';
import { UsermanagementUserDataService } from './usermanagement-user-data.service';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})

export class UsermanagementUser2groupDataService extends DataServiceFlatLeaf<IAccessUsersInGroupEntity,IUserEntity, UsermanagementUserComplete> {

	public constructor(userDataService : UsermanagementUserDataService) {
		const options: IDataServiceOptions<IAccessUsersInGroupEntity> = {
			apiUrl: 'usermanagement/main/user2group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				prepareParam: ident => {
					return { mainItemId: ident.pKey1 };
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IAccessUsersInGroupEntity, IUserEntity, UsermanagementUserComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'User2Group',
				parent: userDataService
			},
		};

		super(options);
	}

	public override registerModificationsToParentUpdate(parentUpdate: UsermanagementUserComplete, modified: IAccessUsersInGroupEntity[], deleted: IAccessUsersInGroupEntity[]): void {
		this.setModified(modified);
	}
}