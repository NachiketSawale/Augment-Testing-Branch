/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { GenericWizardReportBase } from '../../services/base/generic-wizard-report-base';
import { IGenericWizardReportEntity } from '../../configuration/rfq-bidder/types/generic-wizard-report-entity.interface';

@Component({
	selector: 'workflow-common-rfq-bidder-report',
	templateUrl: './rfq-bidder-report.component.html',
	styleUrls: ['./rfq-bidder-report.component.scss']
})
export class RfqBidderReportComponent extends GenericWizardReportBase<IGenericWizardReportEntity> {

	/*
	List of selection reports
	 */
	public reportSelectionList: IGenericWizardReportEntity[] = [];

	/*
	List of mandatory reports
	 */
	public reportMandatoryList: IGenericWizardReportEntity[] = [];


	public constructor() {
		super();
		this.list.forEach(report => {
			report.IsMandatory ? this.reportMandatoryList.push(report) : this.reportSelectionList.push(report);
		});
	}

}
