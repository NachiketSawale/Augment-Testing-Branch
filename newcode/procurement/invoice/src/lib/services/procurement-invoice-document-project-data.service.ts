/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity } from '@libs/documents/shared';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { IInvHeaderEntity } from '../model/entities';
@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceDocumentProjectDataService extends DocumentProjectDataRootService<IInvHeaderEntity> {
	protected readonly parentService: ProcurementInvoiceHeaderDataService;
	public constructor() {
		const parentDataService = inject(ProcurementInvoiceHeaderDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}
	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		const invHeaderSelected = this.parentService.getSelectedEntity();
		if (invHeaderSelected) {
			return {
				InvHeaderFk: invHeaderSelected.Id
			};
		}
		return {};
	}
}