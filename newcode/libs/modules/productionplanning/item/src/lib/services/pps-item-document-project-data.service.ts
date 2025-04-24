import {inject, Injectable} from '@angular/core';
import {
	DocumentProjectDataRootService,
	IDocumentFilterForeignKeyEntity,
	IDocumentProjectEntity
} from '@libs/documents/shared';
import {IPPSItemEntity} from '../model/entities/pps-item-entity.interface';
import {PpsItemDataService} from './pps-item-data.service';
import {isNull} from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class PpsItemDocumentProjectDataService extends DocumentProjectDataRootService<IPPSItemEntity> {
	public constructor() {
		super(inject(PpsItemDataService));
	}

	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		const selected = this.parentDataService!.getSelectedEntity();
		return isNull(selected) ? {} : {PpsItemFk: selected.Id};
	}

	public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
		const selected = this.parentDataService!.getSelectedEntity();
		if (selected) {
			created.PpsItemFk = selected.Id;
			created.PrjProjectFk = selected.ProjectFk;
			created.LgmJobFk = selected.LgmJobFk;
		}
		return created;
	}
}