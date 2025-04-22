/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, OnInit } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { ICompletePackageEvaluateEventsDialogOption, PACKAGE_EVALUATE_EVENTS_DIALOG_OPTION } from '../../model/entities/package-evaluate-events-dialog.interface';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { firstValueFrom } from 'rxjs';
import { IPackageEvaluateEventsCreateRequest } from '../../model/requests/package-evaluate-events-create-request.interface';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageEventDataService } from '../../services/procurement-package-event-data.service';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';

@Component({
	selector: 'procurement-package-evaluate-events',
	templateUrl: './package-evaluate-events-dialog.component.html',
	styleUrls: ['package-evaluate-events-dialog.component.scss'],
})
export class ProcurementPackageEvaluateEventsDialogComponent implements OnInit {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly dataPackageEvaluateEventsDialogOption = inject(PACKAGE_EVALUATE_EVENTS_DIALOG_OPTION);
	private readonly http = inject(PlatformHttpService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly projectSharedLookupService = inject(ProjectSharedLookupService);
	private readonly procurementPackageEventDataService = inject(ProcurementPackageEventDataService);
	private readonly packageDataService = inject(ProcurementPackageHeaderDataService);
	public dialogOption: ICompletePackageEvaluateEventsDialogOption = {
		BodyText: this.translateService.instant('procurement.package.wizard.evaluationEvents.bodyOptions').text,
		selectCurrentItem: '',
		selectAllItems: '',
		RadioSelect: 'CurrentItem',
	};

	public async ngOnInit(): Promise<void> {
		let extraInfo: string = '';
		if (!this.dataPackageEvaluateEventsDialogOption.StructureFk) {
			extraInfo = ': (current package structure not exist)';
		}
		this.dialogOption.selectCurrentItem = this.translateService.instant('procurement.package.wizard.evaluationEvents.selectCurrentItem', { code: extraInfo }).text;
		let projectInfo: string = '';
		if (this.dataPackageEvaluateEventsDialogOption.ProjectFk) {
			const projectItem = await firstValueFrom(this.projectSharedLookupService.getItemByKey({ id: this.dataPackageEvaluateEventsDialogOption.ProjectFk }));
			if (projectItem) {
				projectInfo = projectItem.ProjectNo + '-' + projectItem.ProjectName;
			}
		}
		this.dialogOption.selectAllItems = this.translateService.instant('procurement.package.wizard.evaluationEvents.selectAllItems', { code: projectInfo }).text;
		if (!this.dataPackageEvaluateEventsDialogOption.StructureFk) {
			this.dialogOption.RadioSelect = 'AllItems';
		}
	}

	public async oK() {
		let dataProjectFk: number | undefined = 0;
		switch (this.dialogOption.RadioSelect) {
			case 'CurrentItem': {
				dataProjectFk = -1;
				break;
			}
			case 'AllItems': {
				dataProjectFk = this.dataPackageEvaluateEventsDialogOption.ProjectFk;
				break;
			}
		}
		const postData: IPackageEvaluateEventsCreateRequest = {
			MainItemId: this.dataPackageEvaluateEventsDialogOption.PackageFk,
			StructureFk: this.dataPackageEvaluateEventsDialogOption.StructureFk,
			ProjectFk: dataProjectFk,
		};
		const respond = await this.http.post<IPrcPackageEntity[]>('procurement/package/wizard/evaluateevent', postData);
		if (respond) {
			await this.messageBoxService.showMsgBox('procurement.package.wizard.evaluationEvents.loadSuccessedMessage', 'procurement.package.wizard.evaluationEvents.caption', 'info');
			await this.procurementPackageEventDataService.loadSubEntities({ id: 0, pKey1: this.dataPackageEvaluateEventsDialogOption.PackageFk });
			this.packageDataService.mergeMainEvent(respond);
		}
	}
}
