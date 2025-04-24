/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';

import { UiCommonMessageBoxService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { BasicsMaterialRecordDataService } from '../../material/basics-material-record-data.service';

@Injectable({
	providedIn: 'root'
})
export abstract class Delete3dModelWizardService {

	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly dataService = inject(BasicsMaterialRecordDataService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);

	public async onStartWizard() {

		const currentMaterial = this.dataService.getSelectedEntity();

		if (!currentMaterial) {
			await this.dialogService.showMsgBox(
				this.translateService.instant('basics.material.warning.import3dModelWarningMsg').text,
				this.translateService.instant('basics.material.warning.warningTitle').text,
				'ico-error');
			return;
		}

		if (currentMaterial && (!currentMaterial.Uuid || (currentMaterial.Uuid && currentMaterial.Uuid.trim().length == 0))) {
			await this.dialogService.showMsgBox(
				this.translateService.instant('basics.material.warning.delete3dModelWarningMsg').text,
				this.translateService.instant('basics.material.warning.warningTitle').text,
				'ico-error');
			return;
		}

		currentMaterial.ObsoleteUuid = currentMaterial.Uuid;
		currentMaterial.Uuid = '';
		this.dataService.setModified(currentMaterial);

		//In the angularjs implement it will trigger save here. But seems not correct. It should implement as enable\disable wizard.
		//The 3d model should be deleted when the save button is pressed.
		await this.dialogService.showMsgBox(
			this.translateService.instant('basics.material.record.delete3dDoneMessage', {code: currentMaterial.Code}).text,
			this.translateService.instant('basics.material.wizard.delete3dMode').text,
			'ico-info');

	}
}
