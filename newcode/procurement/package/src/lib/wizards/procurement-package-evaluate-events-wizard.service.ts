/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';

import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { ProcurementPackageEvaluateEventsDialogComponent } from '../components/package-evaluate-events/package-evaluate-events-dialog.component';
import { IPackageEvaluateEventsDialogOption, PACKAGE_EVALUATE_EVENTS_DIALOG_OPTION } from '../model/entities/package-evaluate-events-dialog.interface';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageEvaluateEventsWizardService {
	private readonly dialogService = inject(UiCommonDialogService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly packageDataService = inject(ProcurementPackageHeaderDataService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	public async packageEvaluateEvents() {
		const dataPackage = this.packageDataService.getSelectedEntity();
		if (!dataPackage) {
			await this.messageBoxService.showMsgBox('procurement.package.wizard.evaluationEvents.warningMsg', 'procurement.package.wizard.evaluationEvents.updateFailedTitle', 'ico-warning');
			return;
		}
		const dataPackageEvaluateEventsDialogOption: IPackageEvaluateEventsDialogOption = {
			PackageFk: dataPackage.Id,
			StructureFk: dataPackage.StructureFk,
			ProjectFk: dataPackage.ProjectFk,
		};
		dataPackageEvaluateEventsDialogOption.PackageFk = dataPackage.Id;
		const modalOptions: ICustomDialogOptions<{ isOk: boolean }, ProcurementPackageEvaluateEventsDialogComponent> = {
			headerText: this.translationService.instant({ key: 'procurement.package.wizard.evaluationEvents.caption' }).text,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					fn(evt, info) {
						info.dialog.body.oK();
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
				},
			],
			bodyProviders: [
				{
					provide: PACKAGE_EVALUATE_EVENTS_DIALOG_OPTION,
					useValue: dataPackageEvaluateEventsDialogOption,
				},
			],
			resizeable: true,
			showCloseButton: true,
			bodyComponent: ProcurementPackageEvaluateEventsDialogComponent,
		};
		await this.dialogService.show(modalOptions);
	}
}
