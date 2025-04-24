/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { ICompanyYearEntity } from '@libs/basics/interfaces';


/**
 * Company Year Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsShareCompanyYearLookupService<TEntity extends object = object> extends UiCommonLookupTypeLegacyDataService<ICompanyYearEntity, TEntity> {
	public constructor() {
		super('companyyear', {
			uuid: 'da794b30be1548aebb157f8965f87071',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'TradingYear',
			gridConfig: {
				columns: [
					{
						id: 'TradingYear',
						model: 'TradingYear',
						type: FieldType.Integer,
						label: {key: 'basics.company.entityTradingYear'},
						sortable: true,
						visible: true
					},
					{
						id: 'StartDate',
						model: 'StartDate',
						type: FieldType.Date,
						label: {key: 'basics.company.entityStartDate'},
						width: 80,
						sortable: true,
						visible: true
					},
					{
						id: 'EndDate',
						model: 'EndDate',
						type: FieldType.Date,
						label: {key: 'basics.company.entityEndDate'},
						width: 80,
						sortable: true,
						visible: true
					}
				]
			}
		},);
	}
}
