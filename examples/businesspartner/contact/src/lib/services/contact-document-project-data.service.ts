/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import {
	DocumentComplete,
	DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity,
	IDocumentProjectEntity
} from '@libs/documents/shared';
import { ContactDataService } from './contact-data.service';
import { IContactEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ContactDocumentProjectDataService extends DocumentProjectDataRootService<IContactEntity> {
	protected readonly parentService: ContactDataService;

	public constructor() {
		const parentDataService = inject(ContactDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}

	public override createUpdateEntity(modified: IDocumentProjectEntity | null): DocumentComplete {
		const complete = new DocumentComplete();
		if (modified !== null) {
			complete.Document = [modified];
		}
		return complete;
	}

	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		const contactSelected = this.parentService.getSelectedEntity();
		if (contactSelected) {
			return {
				BpdContactFk:contactSelected.Id
			};
		}
		return {};
	}

	public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
		const contactSelected = this.parentService.getSelection().length > 0 ? this.parentService.getSelection()[0] : null;
		if (contactSelected) {
			created.BpdContactFk = contactSelected.Id;
		}
		return created;
	}
	public override isParentFn(parentKey: IContactEntity, entity: IDocumentProjectEntity): boolean {
		return parentKey.Id === entity.BpdContactFk;
	}
}
