/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { QtoMainHeaderGridDataService } from '../../header/qto-main-header-grid-data.service';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { QtoShareTargetType } from '@libs/qto/shared';
import { QtoWizardCreatePesService } from './qto-wizard-create-pes.service';

@Injectable({
	providedIn: 'root',
})
export class QToMainCreateUpdateUpdatePesWizardService {
	private readonly qtoMainHeaderGridDataService = inject(QtoMainHeaderGridDataService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly qtoWizardCreatePesService = inject(QtoWizardCreatePesService);

	/**
	 * create/update pes
	 */
	public createPes() {
		const selectedHeader = this.qtoMainHeaderGridDataService.getSelectedEntity();
		if (selectedHeader) {
			if (selectedHeader.QtoTargetType === QtoShareTargetType.SalesWipBill || selectedHeader.QtoTargetType === QtoShareTargetType.SalesWqAq) {
				this.showNoSelectedPesDialog();
			} else if (selectedHeader.QtoTargetType === QtoShareTargetType.prcWqAq) {
				this.showNotCreatedPesDialog();
			} else {
				const qtoHeaderId = selectedHeader.Id;
				this.qtoWizardCreatePesService.QtoHeaderId = qtoHeaderId;
				this.qtoWizardCreatePesService.getContractId(qtoHeaderId).then((response) => {
					if (response) {
						this.qtoWizardCreatePesService.execute(selectedHeader);
					} else {
						this.showNoContractDialog();
					}
				});
			}
		} else {
			this.disableProgressDialog();
		}
	}

	private showInfoDialog(bodyText: string) {
		const modalOptions = {
			headerText: this.translateService.instant('cloud.common.informationDialogHeader').text,
			bodyText: bodyText,
			showOkButton: true,
			iconClass: 'ico-info',
		};
		this.messageBoxService.showMsgBox(modalOptions);
	}

	private disableProgressDialog() {
		this.showInfoDialog(this.translateService.instant('qto.main.wizard.disableProgressError').text);
	}

	private showNoContractDialog() {
		this.showInfoDialog(this.translateService.instant('qto.main.wizard.create.pes.NoContract').text);
	}

	private showNoSelectedPesDialog() {
		this.showInfoDialog(this.translateService.instant('qto.main.wizard.create.pes.noPes').text);
	}

	private showNotCreatedPesDialog() {
		this.showInfoDialog(this.translateService.instant('qto.main.wizard.create.pes.NotCreatedPes').text);
	}

}
