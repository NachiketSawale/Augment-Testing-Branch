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
import { IContact2ExternalEntity, IContactEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ContactToExternalDataService extends DataServiceFlatLeaf<IContact2ExternalEntity, IContactEntity, IContactEntityComplete> {
	public constructor(parentService: ContactDataService) {
		const options: IDataServiceOptions<IContact2ExternalEntity> = {
			apiUrl: 'businesspartner/contact/contact2external',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId: ident.pKey1??-1
					};
				}
			},
			createInfo: <IDataServiceEndPointOptions> {
				endPoint: 'createnew'
			},
			roleInfo: <IDataServiceChildRoleOptions<IContact2ExternalEntity, IContactEntity, IContactEntityComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'Contact2External',
				parent: parentService
			}
		};
		super(options);
	}

	protected override provideCreatePayload(): object {
		const parentSelected = this.getSelectedParent();

		return {
			mainItemId: parentSelected ? parentSelected.Id : -1
		};
	}

	protected override onCreateSucceeded(created: IContact2ExternalEntity): IContact2ExternalEntity {
		return created;
	}

	public override isParentFn(parentKey: IContactEntity, entity: IContact2ExternalEntity): boolean {
		return entity.ContactFk === parentKey.Id;
	}
}