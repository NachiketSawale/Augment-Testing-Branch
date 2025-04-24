/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData, IReportParameterValues } from '@libs/platform/common';
import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { Observable } from 'rxjs';

/**
 * Service to prepare lookup field for report parameter having "report parameter value" configuration.
 */
export class ReportParametersBaseLookupService extends UiCommonLookupItemsDataService<IReportParameterValues> {

	public constructor(items: IReportParameterValues[] = []) {
		super(items, { uuid: '', displayMember: 'name', valueMember: 'value' });
	}

	public override getItemByKey(id: IIdentificationData): Observable<IReportParameterValues> {
		return new Observable((observer) => {
			const item = this.items.find(item=> item.value === id.id);
			if(item) {
				observer.next(item);
			}
			observer.complete();
		});
	}
}