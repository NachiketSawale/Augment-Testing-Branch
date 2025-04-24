/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity, IDocumentParentEntity, IDocumentProjectEntity } from '@libs/documents/shared';
import { IConHeaderEntity } from '../model/entities';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractDocumentProjectDataService extends DocumentProjectDataRootService<IConHeaderEntity> {
	protected readonly parentService: ProcurementContractHeaderDataService;

	public constructor() {
		const parentDataService = inject(ProcurementContractHeaderDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}

	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		const conSelected = this.parentService.getSelectedEntity();
		if (conSelected) {
			return {
				ConHeaderFk: conSelected.Id,
			};
		}
		return {};
	}

	public override getColumnConfig() {
		return [
			{ documentField: 'ConHeaderFk', dataField: 'Id', readOnly: false },
			{ documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false },
			{ documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false },
			{ documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false },
			{ documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false },
			{ documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false },
			{ documentField: 'PrcStructureFk', readOnly: false, dataField: 'PrcHeaderEntity.StructureFk' },
			{ documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false },
			{ documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false },
			{ documentField: 'BpdSubsidiaryFk', dataField: 'SubsidiaryFk', readOnly: false },
			{ documentField: 'BpdContactFk', dataField: 'ContactFk', readOnly: false },
		];
	}

	protected override getDocumentParentInfo(): IDocumentParentEntity {
		const documentParent: IDocumentParentEntity = {};
		const conSelected = this.parentService.getSelectedEntity();
		if (conSelected) {
			documentParent.Id = conSelected.Id;
			documentParent.BusinessPartnerFk = conSelected.BusinessPartnerFk;
			documentParent.ControllingUnitFk = conSelected.ControllingUnitFk;
			documentParent.MaterialCatalogFk = conSelected.MaterialCatalogFk;
			documentParent.PackageFk = conSelected.PackageFk;
			documentParent.ProjectFk = conSelected.ProjectFk;
		}
		return documentParent;
	}

	public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
		const conSelected = this.parentService.getSelectedEntity();
		if (conSelected) {
			created.ConHeaderFk = conSelected.Id;
			created.BpdBusinessPartnerFk = conSelected.BusinessPartnerFk;
			created.MdcControllingUnitFk = conSelected.ControllingUnitFk;
			created.MdcMaterialCatalogFk = conSelected.MaterialCatalogFk;
			created.PrcPackageFk = conSelected.PackageFk;
			created.PrjProjectFk = conSelected.ProjectFk;
		}
		return created;
	}
}
