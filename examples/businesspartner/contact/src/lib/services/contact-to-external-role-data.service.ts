import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import {
	IContactEntityComplete
} from '@libs/businesspartner/common';
import {ContactDataService} from './contact-data.service';
import {Injectable} from '@angular/core';
import { IContact2ExtRoleEntity, IContactEntity } from '@libs/businesspartner/interfaces';
@Injectable({
	providedIn: 'root'
})
export class ContactToExternalRoleDataService extends DataServiceFlatLeaf<IContact2ExtRoleEntity, IContactEntity, IContactEntityComplete> {
	public constructor(parentService: ContactDataService) {
		const options: IDataServiceOptions<IContact2ExtRoleEntity> = {
			apiUrl: 'businesspartner/contact/extrole',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId: ident.pKey1??-1
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IContact2ExtRoleEntity, IContactEntity, IContactEntityComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'ContactExtRole',
				parent: parentService
			}
		};
		super(options);
	}

	public override isParentFn(parentKey: IContactEntity, entity: IContact2ExtRoleEntity): boolean {
		return entity.ContactFk === parentKey.Id;
	}
}