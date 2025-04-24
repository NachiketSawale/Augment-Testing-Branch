/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';
import { IVariableTimePeriod } from '../../model/representation/variable-time-period.interface';
import { FieldType } from '../../../model/fields/field-type.enum';
import { IAdditionalSelectOptions } from '../../../model/fields/additional/additional-select-options.interface';

/***
 * Variable Time Period component
 */
@Component({
  selector: 'ui-common-variable-time-period',
  templateUrl: './variable-time-period.component.html',
  styleUrls: ['./variable-time-period.component.css']
})
export class VariableTimePeriodComponent {
	@Input()
	public data?: IVariableTimePeriod;

	/**
	 * Get time period select options
	 */
	public transformationList : IAdditionalSelectOptions<number> = {
		itemsSource: {
			items: [
				{id: 1, displayName: 'Hour'},
				{id: 2, displayName: 'Days'},
				{id: 3, displayName: 'Weeks'},
				{id: 4, displayName: 'Months'},
				{id: 5, displayName: 'Year'}
			]
		}
	};

	/***
	 * Lower bound change handler. Ensures the lower bound to always be negative
	 */
	public onLowerBoundChange() {
		if(this.data && this.data.lowerBound > 0) {
			this.data.lowerBound *= -1;
		}
	}

    protected readonly FieldType = FieldType;
}
