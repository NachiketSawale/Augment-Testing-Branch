/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupSimpleDataService } from '@libs/ui/common';

/**
 * Dependent Data Chart Type Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsDependentDataChartTypeLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('basics.dependentdata.charttype', {
			uuid: '425e05c5f9494f8fbd19086054caca91',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}