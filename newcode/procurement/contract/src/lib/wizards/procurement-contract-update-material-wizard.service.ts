/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService, PlatformModuleNavigationService, PlatformTranslateService } from '@libs/platform/common';

import { UiCommonMessageBoxService, IYesNoDialogOptions, StandardDialogButtonId } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { ProcurementContractItemDataService } from '../services/procurement-contract-item-data.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractUpdateMaterialWizard {

	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);
	protected readonly dataService = inject(ProcurementContractHeaderDataService);
	private readonly prcitemDataService = inject(ProcurementContractItemDataService);
	private readonly platformModuleNavigationService = inject(PlatformModuleNavigationService);
	public isNavigate: boolean = false;
	public materialFks: number[] = [];

	public async onStartWizard() {
		this.initData();

		const options: IYesNoDialogOptions = {
			defaultButtonId: StandardDialogButtonId.Yes,
			id: 'updateMaterial',
			dontShowAgain: true,
			showCancelButton: false,
			headerText: this.translateService.instant('procurement.common.wizard.updateMaterial.updateMaterialTitle').text,
			bodyText: this.translateService.instant('procurement.common.wizard.updateMaterial.identicalMaterial').text,
			customButtons: [
				{
					caption: {key: 'cloud.common.Navigator.goTo'},
					id: 'Navigation',
					iconClass: 'ico-goto',
					fn: () => {
						this.platformModuleNavigationService.navigate({
							internalModuleName: 'basics.material',
							entityIdentifications: this.materialFks.map(id => {
								return {id};
							})
						});
					},
					isDisabled: !this.isNavigate,
					isVisible: true,
					autoClose: true
				}
			]
		};

		const callResult = await this.dialogService.showYesNoDialog(options);
		if (callResult?.closingButtonId === StandardDialogButtonId.Yes) {
			if (!this.dataService.getSelectedEntity()) {
				throw new Error('please select record first');
			}
			const prcHeaderFk = this.dataService.getHeaderEntity().Id;
			await firstValueFrom(this.http.post(`${this.configService.webApiBaseUrl}procurement/contract/wizard/updateMaterial`, {PrcHeaderFK: prcHeaderFk}));
			this.dialogService.showInfoBox(this.translateService.instant('procurement.common.wizard.updateMaterial.executeSuccessedMessage').text, 'info', true);
		}
	}

	public initData() {
		if (!this.dataService.getSelectedEntity()) {
			throw new Error('please select record first');
		}
		//todo-when item container doesn't exist, the getlist() function won't be able to fetch the data, which seems to be a framework issue
		const itemList = this.prcitemDataService.getList();
		const materialFks = itemList.filter(x => x.MdcMaterialFk !== undefined).map(e => e.MdcMaterialFk!);
		if (materialFks.length > 0) {
			this.isNavigate = true;
			this.materialFks = [...new Set(materialFks)];
		}
	}
}