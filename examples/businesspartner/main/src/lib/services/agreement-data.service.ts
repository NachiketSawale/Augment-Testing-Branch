import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { IAgreementEntity, IBusinessPartnerEntity } from  '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../model/entities/businesspartner-entity-complete.class';
import { Injectable } from '@angular/core';
import { BusinesspartnerMainHeaderDataService } from './businesspartner-data.service';
import * as _ from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class AgreementDataService extends DataServiceFlatLeaf<IAgreementEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	public constructor(businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<IAgreementEntity> = {
			apiUrl: 'businesspartner/main/agreement',
			readInfo: <IDataServiceEndPointOptions> {
				endPoint: 'listByParent',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions> {
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IAgreementEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'Agreement',
				parent: businesspartnerMainHeaderDataService
			}
		};
		super(options);
	}

	protected override onLoadSucceeded(loaded: object): IAgreementEntity[] {
		if (loaded) {
			return _.get(loaded, 'Main', []);
		}
		return [];
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IAgreementEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}
}