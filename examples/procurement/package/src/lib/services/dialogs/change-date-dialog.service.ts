import { inject, Injectable } from '@angular/core';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { IChangeDateDialogData, PACKAGE_CHANGE_DATE_DIALOG_DATA_TOKEN, ProcurementPackageChangeDateDialogComponent } from '../../components/change-date-dialog/change-date-dialog.component';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageChangeDateDialogService {
	private dialogService = inject(UiCommonDialogService);

	public async show(data: IChangeDateDialogData) {
		const modalOptions: ICustomDialogOptions<StandardDialogButtonId, ProcurementPackageChangeDateDialogComponent> = {
			headerText: 'procurement.package.UpdateDateFormActivity',
			buttons: [
				{
					id: 'accept',
					caption: 'procurement.package.changeDateAccept',
					fn: (event, info) => {
						info.dialog.close(StandardDialogButtonId.Yes);
					},
				},
				{
					id: 'reject',
					caption: 'procurement.package.changeDateReject',
					fn: (event, info) => {
						info.dialog.close(StandardDialogButtonId.No);
					},
				},
			],
			resizeable: true,
			showCloseButton: true,
			bodyComponent: ProcurementPackageChangeDateDialogComponent,
			bodyProviders: [
				{
					provide: PACKAGE_CHANGE_DATE_DIALOG_DATA_TOKEN,
					useValue: data,
				},
			],
		};

		return await this.dialogService.show(modalOptions);
	}
}