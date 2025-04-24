/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';

import { UiCommonMessageBoxService, IYesNoDialogOptions } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { get } from 'lodash';
import {firstValueFrom} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export abstract class UpdateFullTextIndexWizardService {

	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);

	public async onStartWizard() {
		const options: IYesNoDialogOptions = {
			defaultButtonId: 'yes',
			id: 'enableDisable',
			dontShowAgain: true,
			showCancelButton: false,
			headerText: this.translateService.instant('basics.material.syncFullText.title').text,
			bodyText: this.translateService.instant('basics.material.syncFullText.question').text
		};

		const result = await this.dialogService.showYesNoDialog(options);

		if (result?.closingButtonId === 'yes') {
			const resp = await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}basics/material/wizard/syncfulltext`));

			const success = get(resp, 'Success')! as boolean;
			const message = get(resp, 'Message')! as string;
			if (success) {
				await this.dialogService.showInfoBox(message, 'info', true);
			} else {
				await this.dialogService.showMsgBox(
					message,
					this.translateService.instant('basics.material.syncFullText.title').text,
					'ico-error' );
			}
		}
	}

}