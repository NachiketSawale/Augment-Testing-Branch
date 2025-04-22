/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {
	IContactEntityComplete,
} from '@libs/businesspartner/common';
import { IContactEntity, IContactPhotoEntity } from '@libs/businesspartner/interfaces';
import {BusinesspartnerContactDataService} from './businesspartner-contact-data.service';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerContactPhotoDataService extends DataServiceFlatLeaf<IContactPhotoEntity, IContactEntity, IContactEntityComplete> {
	public constructor(parentService: BusinesspartnerContactDataService) {
		const options: IDataServiceOptions<IContactPhotoEntity> = {
			apiUrl: 'businesspartner/contact/photo',
			readInfo: <IDataServiceEndPointOptions> {
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId: ident.pKey1??-1
					};
				}
			},
			createInfo: {
				endPoint: 'createnew',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IContactPhotoEntity, IContactEntity, IContactEntityComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'ContactPhoto',
				parent: parentService
			}
		};

		super(options);
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}
		return {
			mainItemId: -1
		};
	}
	public handleCreationDone(created:IContactPhotoEntity[]|IContactPhotoEntity) {
		if(this.processor !== undefined) {
			this.processor.process(created);
		}
		this.append(created);
		this.select(created);
		this.setModified(created);
	}

	protected override onCreateSucceeded(created: object): IContactPhotoEntity {
		return created as unknown as IContactPhotoEntity;
	}

	public override isParentFn(parentKey: IContactEntity, entity: IContactPhotoEntity): boolean {
		return entity.ContactFk === parentKey.Id;
	}
}