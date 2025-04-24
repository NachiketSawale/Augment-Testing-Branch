/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IIdentificationData } from '@libs/platform/common';
import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { Observable } from 'rxjs';

export interface IPlaceholder {
	id: string | number;
	value: string;
	description: string;
}

/**
 * This Lookup is only a temporary Placeholder for demonstration purposes.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowPlaceholderLookup extends UiCommonLookupItemsDataService<IPlaceholder, object> {

	public constructor() {
		const items: IPlaceholder[] = [{
			id: -1,
			value: 'temporary',
			description: 'lookup needs to be implemented'
		}];
		super(items, {uuid: '', displayMember: 'description', valueMember: 'id'});
	}

	public override getItemByKey(id: IIdentificationData): Observable<IPlaceholder> {
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