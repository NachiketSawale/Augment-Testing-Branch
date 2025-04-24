/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupItemsDataService} from '@libs/ui/common';


/**
 * Interface for the BOQ report format.
 */
export interface IReportBoqFormat{
	/**
 	* ID for the BOQ report.
 	*/
	Id : number;
	/**
 	* Description for the BOQ report.
 	*/
	Description : string;
}

@Injectable({
	providedIn: 'root'
})
/**
 * Procurement Rfq Email Fax Report Boq Format Lookup Service.
 */
export class ProcurementRfqEmailFaxReportBoqFormatLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<IReportBoqFormat, TEntity> {

	public constructor() {
		const boqFormat = [
			{ Id: 1, Description: 'GAEB' },
			{ Id: 2, Description: 'XLSX' }
		];
		super(boqFormat, {
			uuid: '',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
		});
	}
}