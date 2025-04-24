/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity, IDocumentProjectEntity } from '@libs/documents/shared';
import { IPesHeaderEntity } from '../model/entities';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPesDocumentProjectDataService extends DocumentProjectDataRootService<IPesHeaderEntity> {
	protected readonly parentService: ProcurementPesHeaderDataService;

	public constructor() {
		const parentDataService = inject(ProcurementPesHeaderDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}


	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		const pesSelected = this.parentService.getSelectedEntity();
		if (pesSelected) {
			return {
				PesHeaderFk: pesSelected.Id
			};
		}
		return {};
	}

	public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
		const pesSelected = this.parentService.getSelectedEntity();
		if (pesSelected) {
			created.PesHeaderFk = pesSelected.Id;
			created.BpdBusinessPartnerFk = pesSelected.BusinessPartnerFk;
			created.MdcControllingUnitFk = pesSelected.ControllingUnitFk;
			created.PrcPackageFk = pesSelected.PackageFk;
			created.PrjProjectFk = pesSelected.ProjectFk;
		}
		return created;
	}

}
