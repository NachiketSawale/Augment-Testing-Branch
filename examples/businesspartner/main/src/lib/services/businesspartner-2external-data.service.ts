/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {
	DataServiceFlatLeaf, IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions, IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {IBp2externalEntity, IBusinessPartnerEntity} from '@libs/businesspartner/interfaces';
import {BusinessPartnerEntityComplete} from '../model/entities/businesspartner-entity-complete.class';
import {BusinesspartnerMainHeaderDataService} from './businesspartner-data.service';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartner2ExternalDataService extends DataServiceFlatLeaf<IBp2externalEntity,
	IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	public constructor(businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<IBp2externalEntity> = {
			apiUrl: 'businesspartner/main/businesspartner2external',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IBp2externalEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BusinessPartner2External',
				parent: businesspartnerMainHeaderDataService
			}
		};
		super(options);
	}
//region basic override

	protected override onLoadSucceeded(loaded: IBp2externalEntity[]): IBp2externalEntity[] {
		//todo  incorporateDataRead
		// if (readData) {
		// 	var status = businesspartnerMainHeaderDataService.getItemStatus();
		// 	if (status.IsReadonly === true) {
		// 		businesspartnerStatusRightService.setListDataReadonly(readData, true);
		// 	}
		// 	basicsLookupdataLookupDescriptorService.attachData(readData);
		// 	return serviceContainer.data.handleReadSucceeded(readData, data);
		// }
		// return serviceContainer.data.handleReadSucceeded(readData, data);
		return loaded;
	}
	protected override provideLoadPayload(): object {
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
	// endregion

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IBp2externalEntity): boolean {
		return entity.BpdBusinesspartnerFk === parentKey.Id;
	}
}