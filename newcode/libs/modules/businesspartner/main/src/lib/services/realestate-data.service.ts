import { Injectable } from '@angular/core';
import { BusinessPartnerEntityComplete } from '../model/entities/businesspartner-entity-complete.class';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { BusinesspartnerMainHeaderDataService } from './businesspartner-data.service';
import * as _ from 'lodash';
import { IBusinessPartnerEntity, IRealEstateEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerMainRealestateDataService extends DataServiceFlatLeaf<IRealEstateEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	private bpMainHeaderDataService : BusinesspartnerMainHeaderDataService;
	public constructor(businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<IRealEstateEntity> = {
			apiUrl: 'businesspartner/main/realestate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IRealEstateEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'RealEstate',
				parent: businesspartnerMainHeaderDataService
			}
		};
		super(options);
		this.bpMainHeaderDataService = businesspartnerMainHeaderDataService;
	}

	public override canCreate(): boolean {
		return super.canCreate() && !this.bpMainHeaderDataService.getItemStatus()?.IsReadonly;
	}

	public override canDelete(): boolean {
		return super.canDelete() && !this.bpMainHeaderDataService.getItemStatus()?.IsReadonly;
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

	protected override onLoadSucceeded(loaded: object): IRealEstateEntity[] {
		if (loaded) {
			return _.get(loaded, 'Main', loaded as IRealEstateEntity[]);
		}
		return [];
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IRealEstateEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}

}