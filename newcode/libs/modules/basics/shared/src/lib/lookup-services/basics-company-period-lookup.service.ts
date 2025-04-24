/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { ICompanyPeriodEntity } from '@libs/basics/interfaces';

@Injectable(
	{providedIn: 'root'}
)
export class BasicsCompanyPeriodLookupService <TEntity extends object> extends UiCommonLookupTypeLegacyDataService<ICompanyPeriodEntity, TEntity> {

	public constructor() {
		super('companyperiod', {
			uuid: 'EEF6FE6563BF4FEC8246682C85F4B411',
			valueMember: 'Id',
			displayMember: 'TradingPeriod',
			gridConfig: {
				columns: [
					{
						id: 'TradingPeriod',
						model: 'TradingPeriod',
						type: FieldType.Translation,
						label: {text: 'Trading Period', key: 'basics.company.entityTradingPeriod'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'StartDate',
						model: 'StartDate',
						type: FieldType.Date,
						label: {text: 'Start Date', key: 'basics.company.entityStartDate'},
						width: 80,
						sortable: true,
						visible: true
					},
					{
						id: 'EndDate',
						model: 'EndDate',
						type: FieldType.Date,
						label: {text: 'End Date', key: 'basics.company.entityEndDate'},
						width: 80,
						sortable: true,
						visible: true
					}
				]
			}
		});
	}
}