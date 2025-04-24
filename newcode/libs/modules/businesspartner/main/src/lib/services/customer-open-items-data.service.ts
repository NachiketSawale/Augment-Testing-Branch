import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceEndPointOptions,
	IDataServiceOptions, IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import { BusinesspartnerMainCustomerDataService } from './customer-data.service';
import { CustomerEntityComplete } from '../model/entities/customer-entity-complete.class';
import { PlatformConfigurationService } from '@libs/platform/common';
import { ICustomerEntity, ICustomerOpenItemsEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerMainCustomerOpenItemsDataService extends DataServiceFlatLeaf<ICustomerOpenItemsEntity, ICustomerEntity, CustomerEntityComplete> {
	private readonly contextSrv = inject(PlatformConfigurationService );
	public constructor(bpMainCustomerDataService:BusinesspartnerMainCustomerDataService) {
		const options: IDataServiceOptions<ICustomerOpenItemsEntity> = {
			apiUrl: 'businesspartner/main/itwofinance',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'customeropenitems',
				usePost: false
			},
			roleInfo: <IDataServiceRoleOptions<ICustomerOpenItemsEntity>>{
				role: ServiceRole.Root,
				itemName: 'CustomerOpenItem',
				parent: bpMainCustomerDataService
			}
		};
		super(options);
	}

	public override canCreate(): boolean {
		return false;
	}

	public override canDelete(): boolean {
		return false;
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		const customerId = parentSelection?.Id;
		const companyId = this.contextSrv.clientId;
		if(customerId && companyId){
			return {
				companyId: companyId,
				customerId: customerId
			};
		}

		return {
			companyId: 0,
			customerId: 0
		};
	}

	protected override onLoadSucceeded(loaded: object): ICustomerOpenItemsEntity[] {
		if (loaded) {
			const ret = loaded as ICustomerOpenItemsEntity[];
			if(ret.length !== 0) {
				for (let i = 0; i < ret.length; i++) {
					ret[i].Id = i + 1;
				}
			}
			return ret;
		}
		return [];
	}
}