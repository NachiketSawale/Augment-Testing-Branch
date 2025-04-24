/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementPesHeaderDataService } from '../services/procurement-pes-header-data.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { firstValueFrom } from 'rxjs';
import { ProcurementPesTransactionDataService } from '../services/procurement-pes-transaction-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPesGenerateTransactionWizardService {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly pesHeaderDataService = inject(ProcurementPesHeaderDataService);
	private readonly pesTransactionDataService = inject(ProcurementPesTransactionDataService);

	public async onStartWizard() {
		const headerEntity = this.pesHeaderDataService.getSelectedEntity();
		if (!headerEntity) {
			await this.messageBoxService.showMsgBox('procurement.common.noSelectedPesHeader', 'procurement.common.updateTaxCodeOfContractItemTitle', 'ico-info');
		} else {
			const resp = await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}procurement/pes/pestransaction/generate`, {params: {mainItemId: headerEntity.Id}}));
			if (resp) {
				const response = (resp as { data: number });
				if (response.data === 0) {
					await this.messageBoxService.showMsgBox('procurement.pes.noNewPesTransactionGenerated', 'cloud.common.informationDialogHeader', 'ico-info');
				}
				await this.pesTransactionDataService.load({id: headerEntity.Id});
			}
		}
	}
}