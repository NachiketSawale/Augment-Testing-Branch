/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {
	DataServiceFlatLeaf, IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions, IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {IBusinessPartner2ExtRoleEntity, IBusinessPartnerEntity} from '@libs/businesspartner/interfaces';
import {BusinessPartnerEntityComplete} from '../model/entities/businesspartner-entity-complete.class';
import {BusinesspartnerMainHeaderDataService} from './businesspartner-data.service';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartner2ExtRoleDataService extends DataServiceFlatLeaf<IBusinessPartner2ExtRoleEntity,
	IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	private platformConfigurationService = ServiceLocator.injector.get(PlatformConfigurationService);

	public constructor(businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<IBusinessPartner2ExtRoleEntity> = {
			apiUrl: 'businesspartner/main/extrole',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IBusinessPartner2ExtRoleEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BusinessPartnerExtRole',
				parent: businesspartnerMainHeaderDataService
			}
		};
		super(options);
	}
//region basic override

	protected override onLoadSucceeded(loaded: IBusinessPartner2ExtRoleEntity[]): IBusinessPartner2ExtRoleEntity[] {
		//todo  incorporateDataRead
		// let status = businesspartnerMainHeaderDataService.getItemStatus();
		// if (status.IsReadonly === true) {
		// 	businesspartnerStatusRightService.setListDataReadonly(readData, true);
		// }
		// return data.handleReadSucceeded(readData, data);
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

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IBusinessPartner2ExtRoleEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}
}