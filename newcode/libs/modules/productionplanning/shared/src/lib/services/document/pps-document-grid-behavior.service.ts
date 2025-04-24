/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { IGridContainerLink } from '@libs/ui/business-base';
import { IPpsDocumentEntity } from '../../model/document/pps-document-entity.interface';
import { DocumentsSharedBehaviorService, IDocumentService } from '@libs/documents/shared';

export class PpsDocumentGridBehavior extends DocumentsSharedBehaviorService<IPpsDocumentEntity> {

	public constructor(
		documentDataService: IDocumentService<IPpsDocumentEntity>,
		injector: Injector,
		private readonly canCreate: boolean = true,
		private readonly canDelete: boolean = true,
	) {
		super(documentDataService, injector);
	}

	public override onCreate(containerLink: IGridContainerLink<IPpsDocumentEntity>): void {
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