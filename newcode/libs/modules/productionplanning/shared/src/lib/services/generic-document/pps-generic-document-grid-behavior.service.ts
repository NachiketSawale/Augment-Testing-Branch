/*
 * Copyright(c) RIB Software GmbH
 */

import { IGridContainerLink } from '@libs/ui/business-base';
import { IPpsGenericDocumentEntity } from '../../model/generic-document/pps-generic-document-entity.interface';
import { DocumentsSharedBehaviorService, IDocumentService } from '@libs/documents/shared';
import { Injector } from '@angular/core';

export class PpsGenericDocumentGridBehavior extends DocumentsSharedBehaviorService<IPpsGenericDocumentEntity> {

	public constructor(
		documentDataService: IDocumentService<IPpsGenericDocumentEntity>,
		injector: Injector,
		private readonly canCreate: boolean = true,
		private readonly canDelete: boolean = true,
	) {
		super(documentDataService, injector);
	}

	public override onCreate(containerLink: IGridContainerLink<IPpsGenericDocumentEntity>): void {
		super.onCreate(containerLink);

		const itemIdsToDelete = [];
		if (!this.canCreate) {
			itemIdsToDelete.push('create');
		}
		if (!this.canDelete) {
			itemIdsToDelete.push('delete');
		}
		containerLink.uiAddOns.toolbar.deleteItems(itemIdsToDelete);
	}
}
