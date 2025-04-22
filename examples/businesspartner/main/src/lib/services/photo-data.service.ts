/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import {BusinessPartnerEntityComplete} from '../model/entities/businesspartner-entity-complete.class';
import {IBusinessPartnerEntity, IPhotoEntity} from '@libs/businesspartner/interfaces';
import {BusinesspartnerMainHeaderDataService} from './businesspartner-data.service';
// import {IPhotoEntityViewerOptionProvider, IPhotoEntityViewerOption} from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerMainPhotoDataService extends DataServiceFlatLeaf<IPhotoEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	public constructor(businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<IPhotoEntity> = {
			apiUrl: 'businesspartner/main/photo',
			readInfo: <IDataServiceEndPointOptions> {
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId: ident.pKey1??-1
					};
				}
			},
			createInfo: <IDataServiceEndPointOptions> {
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IPhotoEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'Photo',
				parent: businesspartnerMainHeaderDataService
			}
		};
		super(options);
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IPhotoEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}
}