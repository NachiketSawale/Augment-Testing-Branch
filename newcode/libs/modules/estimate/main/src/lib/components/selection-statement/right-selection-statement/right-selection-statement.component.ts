/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { EstimateLineItemSelStatementFilterLookupService } from '../../../containers/selection-statement/estimate-line-item-sel-statement-filter-lookup.service';
import { LookupEvent, LookupSimpleEntity } from '@libs/ui/common';

@Component({
	selector: 'estimate-main-right-selection-statement',
	templateUrl: './right-selection-statement.component.html',
	styleUrls: ['./right-selection-statement.component.scss'],
})
export class RightSelectionStatementComponent {
	protected currentSelFk = 1;
	protected filterLookupService = inject(EstimateLineItemSelStatementFilterLookupService);

	public constructor() {}

	public onSelectedItemChanged(event: LookupEvent<LookupSimpleEntity, object>) {
		console.log(event);
		/*if (changes.currentSelFk) {
			console.log(changes);
			console.log('data changed:', changes.currentSelFk.currentValue);
		}*/
	}
}
