/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { SalesContractContractsDataService } from './sales-contract-contracts-data.service';
import { DocumentDataLeafService } from '@libs/documents/shared';
import { SalesContractDocumentReadonlyProcessorService } from './sales-contract-document-readonly-processor.service';
import { SalesContractContractsComplete } from '../model/complete-class/sales-contract-contracts-complete.class';
import { IDocumentEntity, IOrdHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})

export class SalesContractDocumentDataService extends DocumentDataLeafService<IDocumentEntity, IOrdHeaderEntity, SalesContractContractsComplete> {

	public constructor(salesContractDocumentDataService: SalesContractContractsDataService) {
		const options: IDataServiceOptions<IDocumentEntity> = {
			apiUrl: 'sales/contract/document',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			createInfo:{
				prepareParam: ident => {
					const selection = salesContractDocumentDataService.getSelection()[0];
					return { id: 0, pKey1 : selection.Id};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IDocumentEntity, IOrdHeaderEntity, SalesContractContractsComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Document',
				parent: salesContractDocumentDataService
			}
		};

		super(options);
		this.processor.addProcessor(new SalesContractDocumentReadonlyProcessorService(this));
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: SalesContractContractsComplete, modified: IDocumentEntity[], deleted: IDocumentEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.DocumentsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.DocumentsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: SalesContractContractsComplete): IDocumentEntity[] {
		if (complete && complete.DocumentsToSave) {
			return complete.DocumentsToSave;
		}
		return [];
	}

}