/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity, IDocumentProjectEntity } from '@libs/documents/shared';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageDocumentProjectDataService extends DocumentProjectDataRootService<IPrcPackageEntity> {
	protected readonly parentService: ProcurementPackageHeaderDataService;

	public constructor() {
		const parentDataService = inject(ProcurementPackageHeaderDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}

	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		const prcPackageSelected = this.parentService.getSelectedEntity();
		if (prcPackageSelected) {
			return {
				PrcPackageFk: prcPackageSelected.Id
			};
		}
		return {};
	}

	public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
		const prcPackageSelected = this.parentService.getSelectedEntity();
		if (prcPackageSelected) {
			created.PrcPackageFk = prcPackageSelected.Id;
		}
		return created;
	}

}
