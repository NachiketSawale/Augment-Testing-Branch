import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceEndPointOptions,
	IDataServiceOptions, IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import { PlatformConfigurationService } from '@libs/platform/common';
import { SupplierEntityComplete } from '../model/entities/supplier-entity-complete.class';
import { SupplierDataService } from './suppiler-data.service';
import { ISupplierEntity, ISupplierOpenItemsEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerMainSupplierOpenItemsDataService extends DataServiceFlatLeaf<ISupplierOpenItemsEntity, ISupplierEntity, SupplierEntityComplete> {
	private readonly contextSrv = inject(PlatformConfigurationService );
	public constructor(supplierDataService:SupplierDataService) {
		const options: IDataServiceOptions<ISupplierOpenItemsEntity> = {
			apiUrl: 'businesspartner/main/itwofinance',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'supplieropenitems',
				usePost: false
			},
			roleInfo: <IDataServiceRoleOptions<ISupplierOpenItemsEntity>>{
				role: ServiceRole.Root,
				itemName: 'SupplierOpenItem',
				parent: supplierDataService
			}
		};
		super(options);
	}
	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		const supplierId = parentSelection?.Id;
		const companyId = this.contextSrv.clientId;
		if(supplierId && companyId){
			return {
				companyId: companyId,
				supplierId: supplierId
			};
		}

		return {
			companyId: 0,
			supplierId: 0
		};
	}

	protected override onLoadSucceeded(loaded: object): ISupplierOpenItemsEntity[] {
		if (loaded) {
			const ret = loaded as ISupplierOpenItemsEntity[];
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