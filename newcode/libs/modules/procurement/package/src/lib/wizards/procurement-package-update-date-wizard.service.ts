

import {inject, Injectable} from '@angular/core';

import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { ProcurementPackageUpdateDateDialogComponent } from '../components/package-update-date/package-update-date-dialog.component';


@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageUpdateDateWizardService  {
	private readonly dialogService = inject(UiCommonDialogService);
	private readonly translationService = ServiceLocator.injector.get(PlatformTranslateService);

	public  async packageUpdateDate(){
		const modalOptions: ICustomDialogOptions<{ isOk: boolean }, ProcurementPackageUpdateDateDialogComponent> = {
			headerText: this.translationService.instant({key: 'procurement.package.wizard.updateDate.caption'}).text,
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
					caption: {key: 'ui.common.dialog.cancelBtn'},
				}
			],
			resizeable: true,
			showCloseButton: true,
			bodyComponent: ProcurementPackageUpdateDateDialogComponent
		};
		 await this.dialogService.show(modalOptions);

	}
}