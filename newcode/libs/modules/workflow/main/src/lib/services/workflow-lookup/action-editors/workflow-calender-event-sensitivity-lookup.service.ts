/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IIdentificationData } from '@libs/platform/common';
import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { Observable } from 'rxjs';
import { ISensitivityDisplayType } from '../../../model/types/workflow-calender-event-sensitivity-type.type';

/**
 * Lookup for calender event sensitivity display types.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowCalenderEventSensitivityLookup extends UiCommonLookupItemsDataService<ISensitivityDisplayType, IWorkflowAction> {

	public constructor() {
		const items: ISensitivityDisplayType[] = [{
			id: 0,
			value: 'Normal',
			description: 'Normal'
		},{
			id: 1,
			value: 'Personal',
			description: 'Personal'
		},{
			id: 2,
			value: 'Private',
			description: 'Private'
		},{
			id: 3,
			value: 'Confidentials',
			description: 'Confidentials'
		},];
		super(items, {uuid: '', displayMember: 'description', valueMember: 'id'});
	}

	public override getItemByKey(id: IIdentificationData): Observable<ISensitivityDisplayType> {
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