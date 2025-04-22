/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { StandardDialogButtonId } from '@libs/ui/common';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { ICustomDialogOptions, UiCommonDialogService } from '@libs/ui/common';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { ProcurementPackageImportD93DialogComponent } from '../components/package-import-d93-dialog/package-import-d93-dialog.component';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackagePackageImportWizardService {
	private readonly dialog = inject(UiCommonDialogService);
	private readonly translationService = ServiceLocator.injector.get(PlatformTranslateService);
	private readonly packageDataService = inject(ProcurementPackageHeaderDataService);

	public onStartWizard(): void {
		this.packageDataService.updateAndExecute(() => {
			this.execute();
		});
	}

	private execute(): void {
		const modalOption: ICustomDialogOptions<StandardDialogButtonId, ProcurementPackageImportD93DialogComponent> = {
			headerText: this.translationService.instant('procurement.package.import.header').text,
			resizeable: true,
			width: '600px',
			buttons: [
				{
					id: 'apply',
					caption: { key: 'cloud.common.ok' },
					isDisabled: (info) => {
						const component = info.dialog.body as ProcurementPackageImportD93DialogComponent;
						if (component.packageImportRequest.PackageImportEntity && component.packageImportRequest.PackageImportEntity.ErrorMessage) {
							component.modalOptions.oKBtnRequirement = component.packageImportRequest.PackageImportEntity.ErrorMessage.length > 0;
						} else {
							if (component.packageImportRequest.FileName !== '' && component.formEntity.PrjProjectFk > 0 && component.formEntity.StructureFk > 0 && component.formEntity.ConfigurationFk > 0) {
								component.modalOptions.oKBtnRequirement = false;
							}
						}
						return component.modalOptions.oKBtnRequirement;
					},
					fn: async (event, info) => {
						const component = info.dialog.body as ProcurementPackageImportD93DialogComponent;
						component.modalOptions.dialogLoading = true;
						await component.importPackage();
						component.modalOptions.dialogLoading = false;
						info.dialog.close(StandardDialogButtonId.Ok);
						component.showImportResult();
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'cloud.common.cancel' },
				},
			],
			bodyComponent: ProcurementPackageImportD93DialogComponent,
		};
		this.dialog.show(modalOption);
	}
}
