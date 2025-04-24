/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity, IDocumentProjectEntity } from '@libs/documents/shared';
import { IPpsHeaderEntity } from '@libs/productionplanning/shared';
import { PpsHeaderDataService } from './pps-header-data.service';
import { isNull } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class PpsHeaderDocumentProjectDataService extends DocumentProjectDataRootService<IPpsHeaderEntity> {
	protected readonly parentService: PpsHeaderDataService;

	public constructor() {
		const parentDataService = inject(PpsHeaderDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}

	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		const selectedPpsHeader = this.parentService.getSelectedEntity();
		return isNull(selectedPpsHeader) ? {} : { PpsHeaderFk: selectedPpsHeader.Id };
	}

	public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
		const selectedPpsHeader = this.parentService.getSelectedEntity();
		if (selectedPpsHeader) {
			created.PpsHeaderFk = selectedPpsHeader.Id;
			created.PrjProjectFk = selectedPpsHeader.PrjProjectFk;
		}
		return created;
	}

}
