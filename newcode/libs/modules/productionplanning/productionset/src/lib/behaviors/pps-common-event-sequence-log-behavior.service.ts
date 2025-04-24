/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { PpsCommonEventSequenceLogDataService } from '../services/pps-common-event-sequence-log-data.service';
import { IPpsLogReportVEntity } from '../model/models';

@Injectable({
	providedIn: 'root'
})
export class PpsCommonEventSequenceLogBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsLogReportVEntity>, IPpsLogReportVEntity> {

	private readonly dataService: PpsCommonEventSequenceLogDataService;
	

	public constructor() {
		this.dataService = inject(PpsCommonEventSequenceLogDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPpsLogReportVEntity>): void {
	}

}