import { inject, Injectable } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { SalesCommonChangeCodeService } from '@libs/sales/common';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';

@Injectable({
	providedIn: 'root'
})
export class SalesContractChangeCodeWizardService {

	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	public headerDataService: SalesContractContractsDataService = inject(SalesContractContractsDataService);
	private salesCommonChangeCodeWizardService = inject(SalesCommonChangeCodeService);

	public changeContractCode() {
		const selectedEntity = this.headerDataService.getSelectedEntity();
		if(!selectedEntity) {
			this.messageBoxService.showMsgBox(this.translateService.instant('cloud.common.noCurrentSelection').text, this.translateService.instant('Change Code').text, 'ico-warning');
			return;
		}
		this.salesCommonChangeCodeWizardService.showChangeCodeDialog('contract', selectedEntity);
	}
}