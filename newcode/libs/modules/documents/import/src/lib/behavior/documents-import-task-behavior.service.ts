/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import {ItemType} from '@libs/ui/common';
import { IDocumentImportJob } from '../model/entities/document-import-job.interface';
import { DocumentsImportTaskDataService } from '../service/documents-import-task-data.service';
export const DOCUMENT_IMPORT_TASK_BEHAVIOR_TOKEN = new InjectionToken<DocumentsImportTaskBehavior>('documentsImportTaskBehavior');

@Injectable({
	providedIn: 'root',
})
export class DocumentsImportTaskBehavior implements IEntityContainerBehavior<IGridContainerLink<IDocumentImportJob>, IDocumentImportJob> {
	private readonly dataService = inject(DocumentsImportTaskDataService);
	
	public onCreate(containerLink: IGridContainerLink<IDocumentImportJob>): void {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'documents.import.documentImport' },
				iconClass: 'tlb-icons ico-active-directory-import',
				id: 't-import-task',
				fn: () => {
					//todo-its show dialog to import doc from xml-this wizard maybe to 1.5 days-https://rib-40.atlassian.net/browse/DEV-14480
				},
				type: ItemType.Item,
				sort : 10
			},
			{
				id: 't-delete-all',
				sort: 11,
				caption: 'documents.import.deleteAllReImportTask',
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-delete-all',
				fn:()=>{
					return this.dataService.deleteAllTask();
				}
			},
			{
				id: 't-delete-one',
				sort: 12,
				caption: 'documents.import.deleteOne',
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-delete',
				fn: ()=>{
					return this.dataService.deleteOneTask();
				}
			}
		]);
	}

}
