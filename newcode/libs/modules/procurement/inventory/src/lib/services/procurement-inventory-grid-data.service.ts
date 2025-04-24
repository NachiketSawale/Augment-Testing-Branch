/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IPrcInventoryEntity } from '../model/entities/prc-inventory-entity.interface';
import { IPrcInventoryHeaderEntity } from '../model/entities/prc-inventory-header-entity.interface';
import { ProcurementInventoryHeaderGridComplete } from '../model/procurement-inventory-header-grid-complete.class';
import { ProcurementInventoryHeaderDataService } from './procurement-inventory-header-data.service';
import { MainDataDto } from '@libs/basics/shared';

/**
 * Procurement Inventory Grid Data Service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementInventoryGridDataService extends DataServiceFlatLeaf<IPrcInventoryEntity, IPrcInventoryHeaderEntity, ProcurementInventoryHeaderGridComplete> {
	public constructor(procurementInventoryHeaderDataService: ProcurementInventoryHeaderDataService) {
		const options: IDataServiceOptions<IPrcInventoryEntity> = {
			apiUrl: 'procurement/inventory',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrcInventoryEntity, IPrcInventoryHeaderEntity, ProcurementInventoryHeaderGridComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Inventory',
				parent: procurementInventoryHeaderDataService,
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
	
	protected override onLoadSucceeded(loaded: object): IPrcInventoryEntity[] {
		const dataDto = new MainDataDto<IPrcInventoryEntity>(loaded);
		return dataDto.main;
	}
}

		
			





