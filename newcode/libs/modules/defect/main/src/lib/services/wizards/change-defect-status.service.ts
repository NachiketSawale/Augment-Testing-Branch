/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { DefectMainHeaderDataService } from '../defect-main-header-data.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { DefectMainComplete } from '../../model/defect-main-complete.class';

@Injectable({
	providedIn: 'root',
})
export class ChangeDefectStatusService extends BasicsSharedChangeStatusService<IDfmDefectEntity, IDfmDefectEntity, DefectMainComplete> {
	protected readonly dataService = inject(DefectMainHeaderDataService);
	private readonly translateService = inject(PlatformTranslateService);

	protected statusConfiguration: IStatusChangeOptions<IDfmDefectEntity, DefectMainComplete> = {
		title: this.translateService.instant('defect.main.wizard.change.status.headerText').text,
		guid: '2E593341E96C41079F9A8EC357B0F04E',
		isSimpleStatus: false,
		statusName: 'defect',
		checkAccessRight: true,
		statusField: 'DfmStatusFk',
		updateUrl: 'defect/main/wizard/changestatus',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}
