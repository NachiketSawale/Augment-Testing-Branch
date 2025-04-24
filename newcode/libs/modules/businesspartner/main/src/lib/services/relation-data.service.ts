import { Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { IBusinessPartnerEntity, IBusinessPartnerRelationEntity, IRelationCreateResponseEntityInterface } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../model/entities/businesspartner-entity-complete.class';
import { BusinesspartnerMainHeaderDataService } from './businesspartner-data.service';
import * as _ from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerMainRelationDataService extends DataServiceFlatLeaf<IBusinessPartnerRelationEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {

	public constructor(businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<IBusinessPartnerRelationEntity> = {
			apiUrl: 'businesspartner/main/relation',
			readInfo: <IDataServiceEndPointOptions> {
				endPoint: 'list',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions> {
				endPoint: 'createrelation',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IBusinessPartnerRelationEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'BusinessPartnerRelation',
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

	protected override onLoadSucceeded(loaded: object): IBusinessPartnerRelationEntity[] {
		if (loaded) {
			return _.get(loaded, 'Main', []);
		}
		return [];
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}
		throw new Error('Please select a business partner first');
	}

	protected override onCreateSucceeded(created: object): IBusinessPartnerRelationEntity {
		const result = created as IRelationCreateResponseEntityInterface;
		return result.Dto;
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IBusinessPartnerRelationEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}
}