/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IDocumentEntity } from '../model/entities/document-entity.interface';
import { DocumentDataLeafService } from '@libs/documents/shared';
import { SalesWipWipsDataService } from './sales-wip-wips-data.service';
import { SalesWipDocumentReadonlyProcessorService } from './sales-wip-document-readonly-processor.service';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { WipHeaderComplete } from '../model/wip-header-complete.class';

@Injectable({
	providedIn: 'root'
})

export class SalesWipDocumentDataService extends DocumentDataLeafService<IDocumentEntity, IWipHeaderEntity, WipHeaderComplete> {

	public constructor(dataService: SalesWipWipsDataService) {
		const options: IDataServiceOptions<IDocumentEntity> = {
			apiUrl: 'sales/wip/document',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			createInfo:{
				prepareParam: ident => {
					const selection = dataService.getSelection()[0];
					return { id: 0, pKey1 : selection.Id};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IDocumentEntity, IWipHeaderEntity, WipHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Document',
				parent: dataService
			}
		};

		super(options);
		this.processor.addProcessor(new SalesWipDocumentReadonlyProcessorService(this));
	}

	public override getSavedEntitiesFromUpdate(complete: WipHeaderComplete): IDocumentEntity[] {
		if (complete && complete.DocumentsToSave) {
			return complete.DocumentsToSave;
		}
		return [];
	}

}