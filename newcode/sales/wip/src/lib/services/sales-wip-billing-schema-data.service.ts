/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { SalesWipWipsDataService } from './sales-wip-wips-data.service';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { WipHeaderComplete } from '../model/wip-header-complete.class';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IWipBillingschemaEntity } from '../model/entities/wip-billingschema-entity.interface';
import { SalesWipBillingschemaModel } from '../model/entities/sales-wip-billing-schema.model';

/**
 * Price Comparison billing schema data service
 */
@Injectable({
	providedIn: 'root'
})
export class SalesWipBillingSchemaDataService extends DataServiceFlatLeaf<IWipBillingschemaEntity, IWipHeaderEntity, WipHeaderComplete> {

	public constructor(dataService: SalesWipWipsDataService) {
		const options: IDataServiceOptions<IWipBillingschemaEntity> = {
			apiUrl: 'sales/wip/schema',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId : ident.pKey1
					};
				}
			},
			createInfo:{
				prepareParam: ident => {
					const selection = dataService.getSelection()[0];
					return { pKey1 : selection.Id};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IWipBillingschemaEntity, IWipHeaderEntity, WipHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'WipBillingSchemas',
				parent: dataService
			}
		};

		super(options);
	}
	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				mainItemId:parent.Id
			};
		}
		return {
			wipfk: -1,
		};
	}
	public override canCreate() {
		return false;
	}

	public override canDelete() {
		return false;
	}
	protected override onLoadSucceeded(loaded: SalesWipBillingschemaModel): IWipBillingschemaEntity[] {
		return loaded.WipBillingSchemas;
	}
}
