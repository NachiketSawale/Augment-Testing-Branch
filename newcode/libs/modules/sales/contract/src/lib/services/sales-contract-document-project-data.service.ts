/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
	DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity,
	IDocumentProjectEntity
} from '@libs/documents/shared';
import { SalesContractContractsDataService } from './sales-contract-contracts-data.service';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root',
})
export class SalesContractDocumentProjectDataService extends DocumentProjectDataRootService<IOrdHeaderEntity> {
	protected readonly parentService :SalesContractContractsDataService;

	public constructor() {
		const parentDataService = inject(SalesContractContractsDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}

	protected override getFilterCriteria():IDocumentFilterForeignKeyEntity {
		const selectedParent = this.parentService.getSelectedEntity();
		if (selectedParent) {
			return {
				OrdHeaderFk:selectedParent.Id
			};
		}
		return {};
	}

	public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity{
		const selectedParent = this.parentService.getSelection().length > 0 ? this.parentService.getSelection()[0] : null;
		if (selectedParent) {
			created.OrdHeaderFk = selectedParent.Id;

		}
		return created;
	}

}
