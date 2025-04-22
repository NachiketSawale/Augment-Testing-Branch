import { inject, Injectable } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { SalesBillingBillsDataService } from '../services/sales-billing-bills-data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
/**
 * Sales billing prepare transaction (Generate Transaction For Selected) wizard service
 */
export class SalesBillingPrepareTransactionWizardService {

    protected readonly translateService = inject(PlatformTranslateService);
    protected readonly messageBoxService = inject(UiCommonMessageBoxService);
    private readonly configService = inject(PlatformConfigurationService);
    private readonly http = inject(HttpClient);
    private readonly billingBillDataService = inject(SalesBillingBillsDataService);

    public prepareTransaction() {
        const selectedEntity = this.billingBillDataService.getSelectedEntity();
        if(!selectedEntity) {
            this.messageBoxService.showMsgBox('cloud.common.noCurrentSelection', this.translateService.instant('procurement.invoice.transaction.generateTransaction',{status:'selected'}).text, 'ico-warning');
            return;
            //TODO : procurement.invoice.transaction.selectedOne key is not present in translation
        }

        const headers = this.billingBillDataService.getSelection();
        const headerIds = headers.map((item) => item.Id);
        this.billingBillDataService.updateAndExecute(() => {
            this.http.post(
                `${this.configService.webApiBaseUrl}sales/billing/transaction/prepare`,
                {MainItemIds: headerIds}).subscribe(() => {
                if (headerIds.length === 1) {
                    this.billingBillDataService.refreshSelected();
                } else {
                    this.billingBillDataService.refreshAll();
                }
            });
		});
    }
}