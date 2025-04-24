/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { IWorkflowExportType } from '../../../model/types/workflow-export-type.interface';
import { IIdentificationData } from '@libs/platform/common';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WorkflowReportExportTypeLookup extends UiCommonLookupItemsDataService<IWorkflowExportType, IWorkflowAction> {
	public constructor() {
		const items: IWorkflowExportType[] = [
			{
				description: 'CSV',
				id: 'csv'
			},
			{
				description: 'DOCX',
				id: 'docx'
			},
			{
				description: 'HTML',
				id: 'html'
			},
			{
				description: 'PDF',
				id: 'pdf'
			},
			{
				description: 'RTF',
				id: 'rtf'
			},
			{
				description: 'TXT',
				id: 'txt'
			},
			{
				description: 'XLSX',
				id: 'xlsx'
			}
		];
		super(items, {uuid: '', displayMember: 'description', valueMember: 'id'});
	}

	public override getItemByKey(id: IIdentificationData): Observable<IWorkflowExportType> {
		return new Observable((observer) => {
			this.items.forEach(item => {
				const i = this.identify(item);
				if (i.id as unknown as string === id as unknown as string) {
					observer.next(item);
				}
			});
			observer.complete();
		});
	}
}