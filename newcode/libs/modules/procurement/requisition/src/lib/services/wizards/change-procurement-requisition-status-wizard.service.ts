/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { ProcurementRequisitionHeaderDataService } from '../requisition-header-data.service';
import { IReqHeaderEntity } from '../../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../../model/entities/requisition-complete-entity.class';

/**
 * Change Procurement Requisition Status Wizard Service
 */
@Injectable({
	providedIn: 'root',
})
export class ChangeProcurementRequisitionStatusWizardService extends BasicsSharedChangeStatusService<IReqHeaderEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	protected readonly dataService = inject(ProcurementRequisitionHeaderDataService);
	private readonly translateService = inject(PlatformTranslateService);

	protected statusConfiguration: IStatusChangeOptions<IReqHeaderEntity, ReqHeaderCompleteEntity> = {
		title: this.translateService.instant('procurement.requisition.wizard.change.status.headerText').text,
		guid: '73183DADB1CC42DE86E5096FCAA104D9',
		isSimpleStatus: false,
		statusName: 'requisition',
		checkAccessRight: true,
		statusField: 'ReqStatusFk',
		updateUrl: 'requisition/requisition/wizard/changestatus',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}
