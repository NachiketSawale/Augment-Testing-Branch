/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedChangeStatusService, IStatusChangeOptions, StatusIdentificationData } from '@libs/basics/shared';
import { IQtoMainDetailGridEntity } from '../../model/qto-main-detail-grid-entity.class';
import { inject, Injectable } from '@angular/core';
import { QtoMainDetailGridDataService } from '../../services/qto-main-detail-grid-data.service';
import { QtoMainHeaderGridDataService } from '../../header/qto-main-header-grid-data.service';
import { IQtoMainHeaderGridEntity } from '../../model/qto-main-header-grid-entity.class';
import { QtoMainHeaderGridComplete } from '../../model/qto-main-header-grid-complete.class';

@Injectable({
	providedIn: 'root',
})
export class QtoMainDetailChangeStatusWizardService extends BasicsSharedChangeStatusService<IQtoMainDetailGridEntity, IQtoMainHeaderGridEntity, QtoMainHeaderGridComplete> {
	protected readonly dataService = inject(QtoMainDetailGridDataService);
	protected readonly qtoHeaderService = inject(QtoMainHeaderGridDataService);
	protected statusConfiguration: IStatusChangeOptions<IQtoMainHeaderGridEntity, QtoMainHeaderGridComplete> = {
		title: 'qto.main.wizard.ChangeQTODetailStatus.title',
		guid: 'EF9D526175D0474EA980E93BD3048F05',
		isSimpleStatus: false,
		statusName: 'qtodetail',
		checkAccessRight: true,
		statusField: 'QtoDetailStatusFk',
		projectId: this.qtoHeaderService.getSelectedEntity()?.ProjectFk,
		updateUrl: 'qto/main/detail/changestatus',
		rootDataService: this.qtoHeaderService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override convertToStatusIdentification(selection: IQtoMainDetailGridEntity[]): StatusIdentificationData[] {
		return selection.map((item) => {
			return {
				id: item.Id,
				projectId: this.qtoHeaderService.getSelectedProjectId(),
			};
		});
	}

	public override afterStatusChanged() {
		//TODD : Wait support refersh function
	}
}
