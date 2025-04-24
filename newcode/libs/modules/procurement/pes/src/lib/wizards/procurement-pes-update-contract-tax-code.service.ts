/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPesHeaderEntity } from '../model/entities';
import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';
import { ProcurementPesHeaderDataService } from '../services/procurement-pes-header-data.service';
import { IEditorDialogResult } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPesUpdateContractTaxCodeWizardService extends ProcurementCommonWizardBaseService<IPesHeaderEntity, PesCompleteNew, object> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementPesHeaderDataService),
		});
	}

	protected override async startWizardValidate() {
		if (!(await super.startWizardValidate(false))) {
			return false;
		}

		const selectedPes = this.config.rootDataService.getSelectedEntity();
		if (!selectedPes?.ConHeaderFk) {
			await this.messageBoxService.showMsgBox('procurement.common.noContractItemFound', 'procurement.common.updateTaxCodeOfContractItemTitle', 'ico-info');
			return false;
		}

		const resp = await this.checkItemsBeforeUpdateTaxCode(selectedPes);
		if (!resp) {
			await this.messageBoxService.showMsgBox('procurement.common.noContractItemFound', 'procurement.common.updateTaxCodeOfContractItemTitle', 'ico-info');
			return false;
		}

		return true;
	}

	protected override async showWizardDialog(): Promise<IEditorDialogResult<object> | undefined> {
		return await this.messageBoxService.showYesNoDialog({
			id: '9445c246375647e0a812216cfe2d661f',
			bodyText: 'procurement.common.confirmUpdateContractItemTaxCode',
			headerText: 'procurement.common.updateTaxCodeOfContractItemTitle',
			dontShowAgain: true,
		});
	}

	protected override async doExecuteWizard() {
		const selectedPes = this.config.rootDataService.getSelectedEntity();
		if (selectedPes && (await this.updateTaxCodeOfContractItem(selectedPes))) {
			await this.messageBoxService.showMsgBox('procurement.common.updateContractTaxCodeSuccessfully', 'procurement.common.updateTaxCodeOfContractItemTitle', 'ico-info');
		}

		return true;
	}

	private async checkItemsBeforeUpdateTaxCode(pesEntity: IPesHeaderEntity): Promise<boolean> {
		return this.http.get<boolean>('procurement/pes/header/checkitemsbeforeupdatetaxcode', { params: { mainId: pesEntity.Id } });
	}

	private async updateTaxCodeOfContractItem(pesEntity: IPesHeaderEntity): Promise<boolean> {
		return this.http.get<boolean>('procurement/pes/header/updatetaxcodeofcontractitem', { params: { mainId: pesEntity.Id } });
	}
}
