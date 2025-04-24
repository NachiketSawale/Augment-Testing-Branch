/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity, IDocumentProjectEntity } from '@libs/documents/shared';
import { IMaterialCatalogEntity } from '@libs/basics/shared';
import { BasicsMaterialCatalogDataService } from '../material-catalog/basics-material-catalog-data.service';

@Injectable({
	providedIn: 'root',
})
export class MaterialCatalogDocumentProjectDataService extends DocumentProjectDataRootService<IMaterialCatalogEntity> {
	protected readonly parentService: BasicsMaterialCatalogDataService;

	public constructor() {
		const parentDataService = inject(BasicsMaterialCatalogDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}

	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		const selCatalog = this.parentService.getSelectedEntity();
		if (selCatalog) {
			return {
				MdcMaterialCatalogFk: selCatalog.Id,
			};
		}
		return {};
	}

	public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
		const selCatalog = this.parentService.getSelection().length > 0 ? this.parentService.getSelection()[0] : null;
		if (selCatalog) {
			created.MdcMaterialCatalogFk = selCatalog.Id;

			//TODO: need to check with PM whether we still need to set the BP FK. To make logic simple disable the code below.
			//created.BpdBusinessPartnerFk = selCatalog.BusinessPartnerFk;
		}
		return created;
	}
}
