/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Quote Status lookup service
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateLineItemSelStatementFilterLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<LookupSimpleEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor(private translateService: PlatformTranslateService) {
		const items: LookupSimpleEntity[] = [
			new LookupSimpleEntity(1, translateService.instant('estimate.main.lineItemSelStatement.selStatementScript').text),
			new LookupSimpleEntity(2, translateService.instant('estimate.main.lineItemSelStatement.selStatementObjectScript').text),
		];
		super(items, {
			uuid: '3b3f76ebda80d7dbe5ce085b91efce43',
			displayMember: 'description',
			valueMember: 'id',
			idProperty: 'id'
		});
	}
}
