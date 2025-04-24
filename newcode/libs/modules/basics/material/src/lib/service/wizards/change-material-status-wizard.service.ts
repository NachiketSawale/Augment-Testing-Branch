/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { BasicsMaterialRecordDataService } from '../../material/basics-material-record-data.service';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { PlatformTranslateService } from '@libs/platform/common';
import { MaterialComplete } from '../../model/complete-class/material-complete.class';

@Injectable({
	providedIn: 'root',
})
export class ChangeMaterialStatusWizardService extends BasicsSharedChangeStatusService<IMaterialEntity, IMaterialEntity, MaterialComplete> {
	protected readonly dataService = inject(BasicsMaterialRecordDataService);
	private readonly translateService = inject(PlatformTranslateService);

	protected statusConfiguration: IStatusChangeOptions<IMaterialEntity, MaterialComplete> = {
		title: this.translateService.instant('basics.material.changeStatus').text,
		guid: 'a8c2353fca6b48a88c9b25901b0a7528',
		isSimpleStatus: false,
		statusName: 'material',
		checkAccessRight: true,
		statusField: 'MaterialStatusFk',
		updateUrl: 'basics/material/changestatus',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}
