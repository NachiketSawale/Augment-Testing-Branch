/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
	DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity,
	IDocumentProjectEntity
} from '@libs/documents/shared';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { SalesWipWipsDataService } from './sales-wip-wips-data.service';

@Injectable({
	providedIn: 'root',
})
export class SalesWipDocumentProjectDataService  extends DocumentProjectDataRootService<IWipHeaderEntity> {
	protected readonly parentService :SalesWipWipsDataService;

	public constructor() {
		const parentDataService = inject(SalesWipWipsDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}

	protected override getFilterCriteria():IDocumentFilterForeignKeyEntity {
		const selectedParent = this.parentService.getSelectedEntity();
		if (selectedParent) {
			return {
				WipHeaderFk:selectedParent.Id
			};
		}
		return {};
	}

	public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity{
		const selectedParent = this.parentService.getSelection().length > 0 ? this.parentService.getSelection()[0] : null;
		if (selectedParent) {
			created.WipHeaderFk = selectedParent.Id;

		}
		return created;
	}

}
