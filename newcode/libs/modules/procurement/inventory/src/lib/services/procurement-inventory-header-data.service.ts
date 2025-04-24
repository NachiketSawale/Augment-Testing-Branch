/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';

import { ProcurementInventoryHeaderGridComplete } from '../model/procurement-inventory-header-grid-complete.class';
import { IPrcInventoryHeaderEntity } from '../model/entities/prc-inventory-header-entity.interface';

/**
 * Procurement Inventory Header Grid Data Service.
 */
@Injectable({
	providedIn: 'root'
})

export class ProcurementInventoryHeaderDataService extends DataServiceFlatRoot<IPrcInventoryHeaderEntity, ProcurementInventoryHeaderGridComplete> {

	public constructor() {
		const options: IDataServiceOptions<IPrcInventoryHeaderEntity> = {
			apiUrl: 'procurement/inventory/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete' 
			},
			roleInfo: <IDataServiceRoleOptions<IPrcInventoryHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'InventoryHeader',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IPrcInventoryHeaderEntity | null): ProcurementInventoryHeaderGridComplete {
		const complete = new ProcurementInventoryHeaderGridComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.InventoryHeader = [modified];
		}

		return complete;
	}
}







