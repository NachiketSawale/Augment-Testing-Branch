/*
 * Copyright(c) RIB Software GmbH
 */

import { FormStep} from '@libs/ui/common';
import { EventEmitter, inject, Injectable } from '@angular/core';
import { EstimateShareUrbConfigDialogService } from '@libs/estimate/shared';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainUrbSettingService {
	private readonly urbConfigDialogService = inject(EstimateShareUrbConfigDialogService);
	private readonly translateService = inject(PlatformTranslateService);

	public getUrbSetting(){
		const config = this.urbConfigDialogService.getUrbConfig4CreateBid();
		return new FormStep('urbSettingStep', this.translateService.instant('estimate.main.bidCreationWizard.uppConfig').text, config, 'UrbSetting');
	}

	public getEmptySetting(){
		return {
			IsEditUppType: false,
			UppConfigDesc: '',
			OpenFromEstBoq: false,
			OpenFromCreateBid: true,
			IsForCustomization: false,
			EntityChange: new EventEmitter<null>
		};
	}
}