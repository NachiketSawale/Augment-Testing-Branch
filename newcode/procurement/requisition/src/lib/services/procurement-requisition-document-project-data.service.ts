/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity, IDocumentProjectEntity } from '@libs/documents/shared';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionDocumentProjectDataService extends DocumentProjectDataRootService<IReqHeaderEntity> {
	protected readonly parentService: ProcurementRequisitionHeaderDataService;
	public constructor() {
		const parentDataService = inject(ProcurementRequisitionHeaderDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}
	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		const reqSelected = this.parentService.getSelectedEntity();
		if (reqSelected) {
			return {
				ReqHeaderFk: reqSelected.Id
			};
		}
		return {};
	}
	public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
		const reqSelected = this.parentService.getSelection()[0];
		if (reqSelected) {
			created.ReqHeaderFk = reqSelected.Id;
			created.BpdBusinessPartnerFk = reqSelected.BusinessPartnerFk;
			created.MdcControllingUnitFk = reqSelected.ControllingUnitFk;
			created.MdcMaterialCatalogFk = reqSelected.MaterialCatalogFk;
			created.PrcPackageFk = reqSelected.PackageFk;
			created.PrjProjectFk = reqSelected.ProjectFk;
		}
		return created;
	}
}