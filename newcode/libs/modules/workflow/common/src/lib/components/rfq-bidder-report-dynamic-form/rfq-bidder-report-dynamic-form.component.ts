/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GenericWizardReportParamEditorBaseService } from '../../services/base/generic-wizard-report-param-editor-base.service';
import { GenericWizardReportParameter } from '../../configuration/rfq-bidder/types/generic-wizard-report-parameter-entity.interface';

@Component({
	selector: 'workflow-common-rfq-bidder-report-dynamic-form',
	templateUrl: './rfq-bidder-report-dynamic-form.component.html',
	styleUrl: './rfq-bidder-report-dynamic-form.component.scss',
})
export class RfqBidderReportDynamicFormComponent extends GenericWizardReportParamEditorBaseService implements OnChanges {

	@Input()
	public reportParameter: GenericWizardReportParameter[] = [];

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['reportParameter'].currentValue != changes['reportParameter'].previousValue) {
			this.reportParameter.forEach((param, index) => {
				this.createField(param, index);
			});
		}
	}
}
