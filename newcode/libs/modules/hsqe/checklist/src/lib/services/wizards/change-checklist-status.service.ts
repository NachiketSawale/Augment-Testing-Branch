/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { CheckListComplete, IHsqCheckListEntity } from '@libs/hsqe/interfaces';
import { HsqeChecklistDataService } from '../hsqe-checklist-data.service';
import { UiCommonMessageBoxService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ChangeCheckListStatusService extends BasicsSharedChangeStatusService<IHsqCheckListEntity, IHsqCheckListEntity, CheckListComplete> {
	protected readonly dataService = inject(HsqeChecklistDataService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly msgDialogService = inject(UiCommonMessageBoxService);

	protected statusConfiguration: IStatusChangeOptions<IHsqCheckListEntity, CheckListComplete> = {
		title: this.translateService.instant('hsqe.checklist.wizard.changeStatus.title').text,
		guid: '030b5bd293b844e5b4800d54b86af643',
		isSimpleStatus: false,
		statusName: 'checklist',
		checkAccessRight: true,
		statusField: 'HsqChlStatusFk',
		updateUrl: 'hsqe/checklist/wizard/changestatus',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		const selectedCheckList = this.dataService.getSelectedEntity();
		if (selectedCheckList?.IsSameContextProjectsByCompany) {
			this.msgDialogService.showMsgBox('hsqe.checklist.wizard.readOnlyRecord', 'hsqe.checklist.wizard.changeStatus.title', 'info')?.then();
		} else {
			this.startChangeStatusWizard();
		}
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected().then();
	}
}