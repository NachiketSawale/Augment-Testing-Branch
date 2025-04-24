/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { WipHeaderComplete } from '../model/wip-header-complete.class';
import { SalesWipWipsDataService } from './sales-wip-wips-data.service';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { ISalesLineItemQuantityEntity } from '../model/entities/sales-line-item-quantity-entity.interface';
import { SalesWipLineItemModel } from '../model/sales-wip-line-item.model';

@Injectable({
	providedIn: 'root'
})
export class SalesWipLineItemDataService extends DataServiceFlatLeaf<ISalesLineItemQuantityEntity, IWipHeaderEntity, WipHeaderComplete> {

	public constructor(salesWipWipsDataService: SalesWipWipsDataService) {
		const options: IDataServiceOptions<ISalesLineItemQuantityEntity> = {
			apiUrl: 'estimate/main/lineitem',
			readInfo: <IDataServiceEndPointOptions> {
				endPoint: 'filterlineitems4sales',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions> {
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<ISalesLineItemQuantityEntity, IWipHeaderEntity, WipHeaderComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'EstLineItem',
				parent: salesWipWipsDataService
			}
		};
		super(options);
	}
	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				date: '2024-11-27T00:00:00.000Z',
				filter: '',
				isGeneral: true,
				projectFk: parent.ProjectFk,
				salesHeaderFk: parent.OrdHeaderFk,
				salesModule: 'wip',
			};
		}
		return {
			wipfk: -1,
		};
	}
	protected override onLoadSucceeded(loaded: SalesWipLineItemModel): ISalesLineItemQuantityEntity[] {
		return loaded.Main;
	}
}
