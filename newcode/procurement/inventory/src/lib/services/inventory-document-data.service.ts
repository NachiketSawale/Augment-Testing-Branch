/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IPrcInventoryDocumentEntity } from '../model/models';
import { IPrcInventoryHeaderEntity } from '../model/entities/prc-inventory-header-entity.interface';
import { ProcurementInventoryHeaderGridComplete } from '../model/procurement-inventory-header-grid-complete.class';
import { ProcurementInventoryHeaderDataService } from './procurement-inventory-header-data.service';
import { DocumentDataLeafService } from '@libs/documents/shared';

@Injectable({
	providedIn: 'root'
})

export class InventoryDocumentDataService extends DocumentDataLeafService<IPrcInventoryDocumentEntity,IPrcInventoryHeaderEntity, ProcurementInventoryHeaderGridComplete >{

	public constructor(parentService:ProcurementInventoryHeaderDataService) {
		const options: IDataServiceOptions<IPrcInventoryDocumentEntity>  = {
			apiUrl: 'procurement/inventory/header/document',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrcInventoryDocumentEntity,IPrcInventoryHeaderEntity, ProcurementInventoryHeaderGridComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'InventoryDocuments',
				parent: parentService,
			},
			

		};

		super(options);
	}
	
}

		
			





