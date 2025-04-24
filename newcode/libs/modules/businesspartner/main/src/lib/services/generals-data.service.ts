import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { IBusinessPartnerEntity, IGeneralsEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../model/entities/businesspartner-entity-complete.class';
import { BusinesspartnerMainHeaderDataService } from './businesspartner-data.service';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class GeneralsDataService extends DataServiceFlatLeaf<IGeneralsEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>{
	public constructor(bpMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<IGeneralsEntity> = {
			apiUrl: 'businesspartner/main/generals',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IGeneralsEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Generals',
				parent: bpMainHeaderDataService,
			}
		};
		super(options);
	}

	public override canCreate(): boolean {
		return super.canCreate();// super.canCreate() && !parentService.getItemStatus().IsReadonly;
	}

	public override canDelete(): boolean {
		return super.canDelete();// super.canDelete() && !parentService.getItemStatus().IsReadonly;
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

	protected override onLoadSucceeded(loaded: object): IGeneralsEntity[] {
		if (loaded) {
			return _.get(loaded, 'Main', []);
		}
		return [];
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IGeneralsEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}
}