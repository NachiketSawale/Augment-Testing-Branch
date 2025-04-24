/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, Injector } from '@angular/core';
import { IGridContainerLink } from '@libs/ui/business-base';
import { DocumentsSharedBehaviorService, IDocumentProjectEntity } from '@libs/documents/shared';
import { ItemType } from '@libs/ui/common';
import { DocumentsCentralQueryHeaderService } from '../document-header/documents-centralquery-header.service';

@Injectable({
	providedIn: 'root',
})
export class DocumentsCentralqueryHeaderBehaviorService extends DocumentsSharedBehaviorService<IDocumentProjectEntity> {
	private readonly centralService = this.injector.get(DocumentsCentralQueryHeaderService);

	public constructor(centralService: DocumentsCentralQueryHeaderService, injector: Injector) {
		super(centralService, injector);
	}

	public override onCreate(containerLink: IGridContainerLink<IDocumentProjectEntity>): void {
		super.onCreate(containerLink);

		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'basics.common.configContext' },
				iconClass: 'ype-icons ico-facilities-07',
				id: 'config',
				fn: () => {
					return this.centralService.contextConfig()!.then();
				},
				sort: 10,
				type: ItemType.Item,
			},
		]);
	}
}
