/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';
import { PrcPackageCompleteEntity } from '../entities/package-complete-entity.class';

@Injectable({
	providedIn: 'root',
})

/**
 * Procurement Change Package Status Wizard Service.
 */
export class ProcurementChangePackageStatusWizardService extends BasicsSharedChangeStatusService<IPrcPackageEntity, IPrcPackageEntity, PrcPackageCompleteEntity> {
	protected readonly dataService = inject(ProcurementPackageHeaderDataService);
	private readonly translateService = inject(PlatformTranslateService);

	protected statusConfiguration: IStatusChangeOptions<IPrcPackageEntity, PrcPackageCompleteEntity> = {
		title: this.translateService.instant('procurement.package.wizard.change.status.headerText').text,
		guid: '4402c87f9a4241668790348e622efe0a',
		isSimpleStatus: false,
		statusName: 'package',
		checkAccessRight: true,
		statusField: 'PackageStatusFk',
		updateUrl: 'procurement/package/wizard/changestatus',
		rootDataService: this.dataService
	};

	public startChangePackageStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
		//todo: afterstatuschange
	}
}
