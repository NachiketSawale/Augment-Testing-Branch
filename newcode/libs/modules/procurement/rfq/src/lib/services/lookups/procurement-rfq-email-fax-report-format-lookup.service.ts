/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupItemsDataService,} from '@libs/ui/common';

/**
 * RFQ Email fax Report Format interface .
 */
export interface IReportFormat{
	/**
 	* ID of Report.
 	*/
	Id : number;
	/**
 	* Description of Report.
 	*/
	Description : string;
}

@Injectable({
	providedIn: 'root'
})

/**
 * Procurement Rfq Email Fax Report Format Lookup Service.
 */
export class ProcurementRfqEmailFaxReportFormatLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<IReportFormat, TEntity> {

	public constructor() {
		const items = [
			{ Id: 1, Description: 'PDF' },
			{ Id: 2, Description: 'XLSX' }
		];
		super(items, {
			uuid: '',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
		});
	}
}
