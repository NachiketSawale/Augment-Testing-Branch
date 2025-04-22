import { inject, Injectable } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { SalesCommonChangeCodeService } from '@libs/sales/common';
import { SalesBidBidsDataService } from '../services/sales-bid-bids-data.service';

@Injectable({
	providedIn: 'root'
})
/**
 * Sales Bid change code wizard service
 */
export class SalesBidChangeCodeWizardService {

	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	public headerDataService: SalesBidBidsDataService = inject(SalesBidBidsDataService);
	private salesCommonChangeCodeWizardService = inject(SalesCommonChangeCodeService);

	public changeCode() {
		const selectedEntity = this.headerDataService.getSelectedEntity();
		if(!selectedEntity) {
			this.messageBoxService.showMsgBox('cloud.common.noCurrentSelection', 'sales.common.codeChangeWizardTitle', 'ico-warning');
			return;
		}
		this.salesCommonChangeCodeWizardService.showChangeCodeDialog('bid', selectedEntity);
	}
}