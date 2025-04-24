/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IIdentificationData, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { Observable } from 'rxjs';
import { IReportDisplayType } from '../../../model/types/workflow-report-type.type';

/**
 * Lookup for report display types.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowReportTypeLookup extends UiCommonLookupItemsDataService<IReportDisplayType, IWorkflowAction> {

	public constructor(translateService: PlatformTranslateService) {
		const items: IReportDisplayType[] = [{
			id: 'pdf',
			value: 'pdf',
			description: translateService.instant('basics.reporting.sidebar.submenuItemList.pdfPrint').text
		},
		{
			id:'preview',
			value: 'preview',
			description: translateService.instant('basics.reporting.sidebar.submenuItemList.preview').text
		}];
		super(items, {uuid: '', displayMember: 'description', valueMember: 'id'});
	}

	public override getItemByKey(id: IIdentificationData): Observable<IReportDisplayType> {
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