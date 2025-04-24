/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalNode,IDataServiceRoleOptions,ServiceRole,IDataServiceEndPointOptions,IDataServiceOptions} from '@libs/platform/data-access';
import { IWipAccrualEntity } from '../model/entities/wip-accrual-entity.interface';
import { WipAccrualCompleteClass } from '../model/wip-accrual-complete.class';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { WipHeaderComplete } from '../model/wip-header-complete.class';
import { SalesWipWipsDataService } from './sales-wip-wips-data.service';


@Injectable({
	providedIn: 'root'
})

/**
 * Procurement Invoice Accrual Grid Data Service.
 */
export class SalesInvoiceAccrualDataService extends DataServiceHierarchicalNode<IWipAccrualEntity,WipAccrualCompleteClass,IWipHeaderEntity, WipHeaderComplete>{
	public constructor(protected parentDataService : SalesWipWipsDataService) {
		const options: IDataServiceOptions<IWipAccrualEntity>  = {
			apiUrl: 'sales/wip/accrual',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceRoleOptions<IWipHeaderEntity>>{
				role: ServiceRole.Node,
				itemName: 'CompanyTransaction',
				parent: parentDataService,
			},
		};
		super(options);
	}
	protected override provideLoadPayload(): object {
		const selection = this.getSelectedParent();
		if (selection) {
			return { mainItemId: selection.Id };
		}
		return { mainItemId: 0 };
	}

	// protected override onLoadSucceeded(loaded: object): IWipHeaderEntity[] {
	// 	return loaded as IWipHeaderEntity[];
	// }

}

