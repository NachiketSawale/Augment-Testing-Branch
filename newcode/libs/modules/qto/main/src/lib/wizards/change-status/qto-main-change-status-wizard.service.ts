/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions, StatusIdentificationData } from '@libs/basics/shared';
import { IQtoMainHeaderGridEntity } from '../../model/qto-main-header-grid-entity.class';
import { QtoMainHeaderGridDataService } from '../../header/qto-main-header-grid-data.service';
import { QtoMainHeaderGridComplete } from '../../model/qto-main-header-grid-complete.class';

/**
 * wizard: change qto status
 */
@Injectable({
	providedIn: 'root',
})
export class QtoMainChangeStatusWizardService extends BasicsSharedChangeStatusService<IQtoMainHeaderGridEntity, IQtoMainHeaderGridEntity, QtoMainHeaderGridComplete> {
	protected readonly dataService = inject(QtoMainHeaderGridDataService);

	protected statusConfiguration: IStatusChangeOptions<IQtoMainHeaderGridEntity, QtoMainHeaderGridComplete> = {
		guid: 'D8247B7259AB49DAA9FB2DE6534251D3',
		title: 'qto.main.wizard.create.ChangeQTOStatus.title',
		statusField: 'QTOStatusFk',
		statusName: 'qto',
		projectId: this.dataService.getSelectedEntity()?.ProjectFk,
		checkAccessRight: true,
		updateUrl: 'qto/main/header/changestatus',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override convertToStatusIdentification(selection: IQtoMainHeaderGridEntity[]): StatusIdentificationData[] {
		return selection.map((item) => {
			return {
				id: item.Id,
				projectId: item.ProjectFk,
			};
		});
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}
