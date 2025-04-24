import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { IBp2controllinggroupEntity, IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../model/entities/businesspartner-entity-complete.class';
import { Injectable } from '@angular/core';
import { BusinesspartnerMainHeaderDataService } from './businesspartner-data.service';
import * as _ from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class Bp2controllingGroupDataService extends DataServiceFlatLeaf<IBp2controllinggroupEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>{
	public constructor(businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<IBp2controllinggroupEntity> = {
			apiUrl: 'businesspartner/main/unitgroup',
			readInfo: <IDataServiceEndPointOptions> {
				endPoint: 'list',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions> {
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IBp2controllinggroupEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'Bp2controllinggroup',
				parent: businesspartnerMainHeaderDataService
			}
		};
		super(options);
	}

	public override canCreate(): boolean {
		return true;// super.canCreate() && !parentService.getItemStatus().IsReadonly;
	}

	public override canDelete(): boolean {
		return true;// super.canDelete() && !parentService.getItemStatus().IsReadonly;
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

	protected override onLoadSucceeded(loaded: object): IBp2controllinggroupEntity[] {
		if (loaded) {
			return _.get(loaded, 'Main', loaded as IBp2controllinggroupEntity[]);
		}
		return [];
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IBp2controllinggroupEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}
}