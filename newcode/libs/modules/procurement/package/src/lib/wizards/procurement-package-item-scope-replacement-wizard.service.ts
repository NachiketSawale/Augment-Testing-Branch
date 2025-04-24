import { inject, Injectable } from '@angular/core';
import { Package2HeaderDataService } from '../services/package-2header-data.service';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { ItemScopeReplacementDialogComponent } from '../components/item-scope-replacement-dialog/item-scope-replacement-dialog.component';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageItemScopeReplacementWizardService {
	private readonly msgService = inject(UiCommonMessageBoxService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly packageDdataService = inject(ProcurementPackageHeaderDataService);
	private readonly package2HeaderDataService = inject(Package2HeaderDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly dialog = inject(UiCommonDialogService);

	public async selectItemScopeReplacement() {
		const itemSeleted = this.package2HeaderDataService.getSelectedEntity();
		if (!itemSeleted) {
			this.msgService.showMsgBox(this.translate.instant('procurement.package.wizard.scopeReplacement.selectPrcItem').text, 'Info', 'warning');
			return;
		}
		const seletedHeader = this.packageDdataService.getSelectedEntity();
		const packageId = seletedHeader ? seletedHeader.Id : -1;
		const itemId = itemSeleted.Id;
		const resp = await this.http.get('procurement/package/wizard/checkBasePrcItem', {
			params: {
				packageId: packageId,
				prcItemId: itemId,
			},
		});
		if (resp) {
			const options: ICustomDialogOptions<StandardDialogButtonId, ItemScopeReplacementDialogComponent> = {
				headerText: this.translate.instant('procurement.requisition.variant.selectItemVariantTitle').text,
				bodyComponent: ItemScopeReplacementDialogComponent,
				resizeable: true,
				height: '810px',
				width: '1080px',
				buttons: [
					{
						id: StandardDialogButtonId.Ok,
						caption: { key: 'procurement.package.wizard.btn.ok' },
						fn: async (event, info) => {
							const component = info.dialog.body as ItemScopeReplacementDialogComponent;
							await component.ok();
							info.dialog.close(StandardDialogButtonId.Ok);
						},
					},
					{
						id: StandardDialogButtonId.Cancel,
						caption: { key: 'procurement.package.wizard.btn.cancelBtn' },
					},
				],
			};
			this.dialog.show(options);
		} else {
			this.msgService.showMsgBox(this.translate.instant('procurement.package.wizard.scopeReplacement.isInAssignmentMessage').text, 'Info', 'warning');
		}
	}
}
