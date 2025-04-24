/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { IMessageBoxOptions, UiCommonMessageBoxService } from '@libs/ui/common';
import { QtoMainHeaderGridDataService } from '../header/qto-main-header-grid-data.service';
import { QtoShareTargetType } from '@libs/qto/shared';

@Injectable({
	providedIn: 'root',
})
export class QtoMainUpdateAqWqToBoqWizardService {
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly qtoHeaderService = inject(QtoMainHeaderGridDataService);

	public UpdateBoqWqAq() {
		const qtoHeaderSelected = this.qtoHeaderService.getSelectedEntity();
		if (qtoHeaderSelected) {
			if (qtoHeaderSelected.QtoTargetType === QtoShareTargetType.prcWqAq || qtoHeaderSelected.QtoTargetType === QtoShareTargetType.SalesWqAq) {
				this.http.post(this.configService.webApiBaseUrl + 'qto/main/detail/updateqtoresult2boqqty', { qtoHeaderId: qtoHeaderSelected.Id }).subscribe(() => {
					this.qtoHeaderService.refreshAllLoaded();
				});
			} else {
				this.showInfoDialog(this.translateService.instant('qto.main.selectWqAqType').text);
			}
		} else {
			this.showNoSelectedQtoDialog();
		}
	}

	private showInfoDialog(bodyText: string) {
		const modalOptions:IMessageBoxOptions = {
			headerText: this.translateService.instant('cloud.common.informationDialogHeader').text,
			bodyText: bodyText,
			iconClass: 'ico-info',
		};
		this.messageBoxService.showMsgBox(modalOptions);
	}

	private showNoSelectedQtoDialog() {
		this.showInfoDialog(this.translateService.instant('qto.main.wizard.create.wip.NoSelectedQto').text);
	}
}
