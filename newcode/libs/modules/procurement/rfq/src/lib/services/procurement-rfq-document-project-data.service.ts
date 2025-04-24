/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity } from '@libs/documents/shared';
import { ProcurementRfqHeaderMainDataService } from './procurement-rfq-header-main-data.service';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';


@Injectable({
	providedIn: 'root',
})
export class ProcurementRfqDocumentProjectDataService extends DocumentProjectDataRootService<IRfqHeaderEntity> {
	protected readonly parentService: ProcurementRfqHeaderMainDataService;

	public constructor() {
		const parentDataService = inject(ProcurementRfqHeaderMainDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}

	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		const rfkSelected = this.parentService.getSelectedEntity();
		if (rfkSelected) {
			return {
				RfqHeaderFk: rfkSelected.Id
			};
		}
		return {};
	}
}
