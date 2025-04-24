/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {
	DataServiceFlatLeaf, IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions, IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {IBusinessPartnerEntity, ICommunityEntity} from '@libs/businesspartner/interfaces';
import {BusinessPartnerEntityComplete} from '../model/entities/businesspartner-entity-complete.class';
import {BusinesspartnerMainHeaderDataService} from './businesspartner-data.service';
import * as _ from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class CommunityDataService extends DataServiceFlatLeaf<ICommunityEntity,
	IBusinessPartnerEntity, BusinessPartnerEntityComplete> {

	public constructor(businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<ICommunityEntity> = {
			apiUrl: 'businesspartner/main/community',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getbyparentid',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<ICommunityEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Community',
				parent: businesspartnerMainHeaderDataService
			}
		};
		super(options);
	}
//region basic override
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
	protected override onLoadSucceeded(loaded: ICommunityEntity[]): ICommunityEntity[] {
		if (loaded) {
			return _.get(loaded, 'Main', []);
		}
		return [];
	}

	// endregion
	//region other
	public getParentData(): IBusinessPartnerEntity | undefined {
		return this.getSelectedParent();
	}
	// endregion

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: ICommunityEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}
}