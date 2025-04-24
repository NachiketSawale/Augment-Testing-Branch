/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import {ItemType} from '@libs/ui/common';
import { IDocumentImportedLogInfo } from '../model/entities/document-info.interface';
import { DocumentsImportLoggingDataService } from '../service/documents-import-logging-data.service';
export const DOCUMENT_IMPORT_LOGGING_BEHAVIOR_TOKEN = new InjectionToken<DocumentsImportLoggingBehavior>('documentsImportLoggingBehavior');

@Injectable({
	providedIn: 'root',
})
export class DocumentsImportLoggingBehavior implements IEntityContainerBehavior<IGridContainerLink<IDocumentImportedLogInfo>, IDocumentImportedLogInfo> {
	private readonly dataService = inject(DocumentsImportLoggingDataService);
	
	public onCreate(containerLink: IGridContainerLink<IDocumentImportedLogInfo>): void {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 't-import-previous',
				caption:'documents.import.pre',
				iconClass: 'tlb-icons ico-rec-previous',
				type: ItemType.Item,
				disabled:(e)=>{
					return this.dataService.canPrevious();
				},
				fn: () => {
					return this.dataService.prePage();
				},
				sort:0
			},
			{
				id: 't-import-next',
				sort: 1,
				caption: 'documents.import.deleteAllReImportTask',
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-rec-next',
				fn:()=>{
					return this.dataService.nextPage();
				},
				disabled:(e)=>{
					return this.dataService.canNext();
				},
			}
		]);
	}

}
