/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ICustomDialog, IDialogButtonEventInfo, MultistepDialog, MultistepTitleFormat, UiCommonMultistepDialogService } from '@libs/ui/common';
import { IEstMainCreateBidContext } from './create-bid-context.interface';
import { EstimateMainBasicSettingService } from './1-basic-setting/basic-setting.service';
import { EstimateMainStructureSettingService } from './2-structure-setting/structure-setting.service';
import { EstimateMainUrbSettingService } from './3-urb-setting/urb-setting.service';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainCreateBidWizardService {
	private readonly multistepService = inject(UiCommonMultistepDialogService);
	private readonly basicSettingService = inject(EstimateMainBasicSettingService);
	private readonly structureSettingService = inject(EstimateMainStructureSettingService);
	private readonly urbSettingService = inject(EstimateMainUrbSettingService);

	public async openDialog(){

		const dataItem: IEstMainCreateBidContext = {
			BasicSetting: this.basicSettingService.getEmptySetting(),
			StructureSetting: this.structureSettingService.getEmptySetting(),
			UrbSetting: this.urbSettingService.getEmptySetting()
		};

		this.basicSettingService.loadDefaultSetting(dataItem.BasicSetting);

		const multistepDialog = new MultistepDialog(dataItem, [
			this.basicSettingService.getBasicSetting(),
			this.structureSettingService.getStructureSetting(),
			this.urbSettingService.getUrbSetting()
		]);

		multistepDialog.titleFormat = MultistepTitleFormat.StepTitle;
		multistepDialog.hideIndicators = false;
		multistepDialog.dialogOptions.buttons = [
			{
				id: 'previousStep', caption: {key: 'basics.common.button.previousStep'},
				isVisible: (info)=> {
					const value = info.dialog.value;
					return value?.stepIndex !== 0;
				},
				isDisabled: (info) => {
					return false;
				},
				fn: (event, info) => {
					info.dialog.value?.goToPrevious();
				}
			},
			{
				id: 'nextBtn', caption: {key: 'basics.common.button.nextStep'},
				isDisabled: (info) => {
					return false;
				},
				fn: (event, info) => {
					this.clickNext(info);
				}
			},
			{
				id: 'closeWin',
				caption: {key: 'basics.common.button.cancel'},
				fn: () => {
					// this.close();
				},
				autoClose: true
			},
			{
				id: 'execute', caption: {key: 'basics.common.button.execute'},
				isDisabled: (info) => {
					return false;
				},
				fn: (event, info) => {

				},
				autoClose: true
			}
		];

		const result = await this.multistepService.showDialog(multistepDialog);
		return result?.value;
	}

	private clickNext(info: IDialogButtonEventInfo<ICustomDialog<MultistepDialog<IEstMainCreateBidContext>, object>, void>){
		const dialog = info.dialog.value;
		if(dialog){
			if(dialog.stepIndex === 1){
				dialog.dataItem.UrbSetting.ProjectId = -1;
				dialog.dataItem.UrbSetting.EntityChange.emit();
			}

			dialog.goToNext();
		}
	}
}