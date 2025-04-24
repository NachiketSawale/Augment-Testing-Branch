/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IIdentificationData } from '@libs/platform/common';
import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { Observable } from 'rxjs';
import { IImportanceDisplayType } from '../../../model/types/workflow-calender-event-importence-type.type';

/**
 * Lookup for calender event importance display types.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowCalenderEventImportanceLookup extends UiCommonLookupItemsDataService<IImportanceDisplayType, IWorkflowAction> {

	public constructor() {
		const items: IImportanceDisplayType[] = [{
			id: 0,
			value: 'Low',
			description: 'Low'
		},
			{
				id: 1,
				value: 'Normal',
				description: 'Normal'
			}, {
				id: 2,
				value: 'High',
				description: 'High'
			},];
		super(items, {uuid: '', displayMember: 'description', valueMember: 'id'});
	}

	public override getItemByKey(id: IIdentificationData): Observable<IImportanceDisplayType> {
		return new Observable((observer) => {
			this.items.forEach(item => {
				const i = this.identify(item);
				if (i.id as unknown as string === id.id as unknown as string) {
					observer.next(item);
				}
			});
			observer.complete();
		});
	}
}