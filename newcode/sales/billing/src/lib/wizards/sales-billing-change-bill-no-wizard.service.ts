import { inject, Injectable } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { SalesBillingBillsDataService } from '../services/sales-billing-bills-data.service';
import { SalesCommonChangeCodeService } from '@libs/sales/common';

@Injectable({
	providedIn: 'root'
})
/**
 * Sales Billing change Bill No wizard service
 */
export class SalesBillingChangeBillNoWizardService {

	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	public headerDataService: SalesBillingBillsDataService = inject(SalesBillingBillsDataService);
	private salesCommonChangeCodeWizardService = inject(SalesCommonChangeCodeService);

	public changeBillNo() {
		const selectedEntity = this.headerDataService.getSelectedEntity();
		if(!selectedEntity) {
			this.messageBoxService.showMsgBox('cloud.common.noCurrentSelection', 'sales.billing.billNoChangeWizardTitle', 'ico-warning');
			return;
		}
		this.salesCommonChangeCodeWizardService.showChangeCodeDialog('billing', selectedEntity);
	}
}