import { inject, Injectable, InjectionToken } from '@angular/core';

import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IPackageCreatePackageFromTemplate } from '../model/entities/dialog-wizard/package-create-package-from-template.interface';
import { ProcurementPackageCreatePackageFromTemplateDialogComponent } from '../components/package-crate-package-from-template/package-create-package-from-template.component';


export const CREATE_PACKAGE_FROM_TEMPLATE_DATA_TOKEN = new InjectionToken<IPackageCreatePackageFromTemplate>(' create_package_from_template_data_token');

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageCreatePackageFromTemplateWizardService {
	private readonly dialogService = inject(UiCommonDialogService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly http = inject(PlatformHttpService);

	public async createPackage() {
		const dataClerk: number | undefined | null = await this.http.get<number | undefined | null>('procurement/package/package/getloginclerk');
		if (dataClerk) {
			const dataShowAssetMaster = await this.http.get<boolean>('basics/common/systemoption/showassetmasterinprocurement');
			const modalOptions: ICustomDialogOptions<StandardDialogButtonId, ProcurementPackageCreatePackageFromTemplateDialogComponent> = {
				headerText: this.translationService.instant({ key: 'procurement.package.wizard.createPackageFromTemplate.caption' }).text,
				buttons: [
					{
						id: StandardDialogButtonId.Ok,
						isDisabled: (info) => {
							return info.dialog.body.isDisabled();
						},
						fn(evt, info) {
							info.dialog.body.onOk();
						},
					},
					{
						id: StandardDialogButtonId.Cancel,
					},
				],
				resizeable: true,
				showCloseButton: true,
				bodyComponent: ProcurementPackageCreatePackageFromTemplateDialogComponent,
				bodyProviders: [
					{
						provide: CREATE_PACKAGE_FROM_TEMPLATE_DATA_TOKEN,
						useValue: {
							ProjectFk: 0, // todo moduleContext.loginProject
							ClerkPrcFk: dataClerk,
							packageCreationShowAssetMaster: dataShowAssetMaster,
						},
					},
				],
			};
			await this.dialogService.show(modalOptions);
		}
	}
}
