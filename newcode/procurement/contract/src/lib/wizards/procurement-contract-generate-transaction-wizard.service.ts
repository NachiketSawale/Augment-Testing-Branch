/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractGenerateTransactionWizardService {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly contractHeaderDataService = inject(ProcurementContractHeaderDataService);

	public async onStartWizard() {
		const headerEntity = this.contractHeaderDataService.getSelectedEntity();
		if (!headerEntity) {
			await this.messageBoxService.showMsgBox('procurement.common.wizard.errorNoSelectOneContract', 'cloud.common.informationDialogHeader',
				'ico-info');
		} else if (headerEntity && headerEntity.IsFramework) {
			await this.messageBoxService.showMsgBox('procurement.contract.wizard.infoFrameworkConNotSupported', 'cloud.common.informationDialogHeader',
				'ico-info');
		} else {
				const resp = await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}procurement/contract/transaction/generate`,{params:{mainItemId:headerEntity.Id}}));
			if (resp) {
				const response = (resp as { data: number });
				if (response.data === 0) {
					await this.messageBoxService.showMsgBox('procurement.contract.noNewConTransactionGenerated', 'cloud.common.informationDialogHeader', 'ico-info');
				}
			}
		}
	}
}