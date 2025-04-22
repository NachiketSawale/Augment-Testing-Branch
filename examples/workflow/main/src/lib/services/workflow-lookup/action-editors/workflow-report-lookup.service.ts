/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupConfig, ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { IReport } from '../../../model/interfaces/workflow-report.interface';

/**
 * Lookup to retrieve all reports.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowReportLookup extends UiCommonLookupEndpointDataService<IReport, IWorkflowAction> {

	public constructor() {
		const endpointConfig: ILookupEndpointConfig<IReport, IWorkflowAction> = {
			httpRead: {
				route: 'basics/reporting/report/',
				endPointRead: 'list'
			}
		};
		const lookupConfig: ILookupConfig<IReport, IWorkflowAction> = {
			uuid: '', displayMember: '', valueMember: 'Id', formatter: {
				format(dataItem, context) {
					return dataItem.Name.Translated;
				},
			}
		};
		super(endpointConfig, lookupConfig);
	}
}