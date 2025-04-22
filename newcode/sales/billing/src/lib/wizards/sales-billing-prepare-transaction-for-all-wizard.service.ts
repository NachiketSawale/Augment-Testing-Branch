import { inject, Injectable } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { SalesBillingBillsDataService } from '../services/sales-billing-bills-data.service';
import { HttpClient } from '@angular/common/http';
import { SalesBillingValidationDataService } from '../services/sales-billing-validation-data.service';
@Injectable({
    providedIn: 'root'
})
/**
 * Sales billing prepare transaction for all (Generate Transaction For All) wizard service
 */
export class SalesBillingPrepareTransactionForAllWizardService {
    protected readonly translateService = inject(PlatformTranslateService);
    protected readonly messageBoxService = inject(UiCommonMessageBoxService);
    private readonly configService = inject(PlatformConfigurationService);
    private readonly http = inject(HttpClient);
    private readonly salesBillingBillDataService = inject(SalesBillingBillsDataService);
    private readonly salesBillingValidationDataService = inject(SalesBillingValidationDataService);
    private readonly headerText = this.translateService.instant('procurement.invoice.transaction.generateTransaction',{status:'All'}).text;

    public prepareTransactionForAll() {
        const selectedList = this.salesBillingBillDataService.getList();
        if(!selectedList || selectedList.length <= 0) {
            this.messageBoxService.showMsgBox('Please search at least one record first.', this.headerText, 'ico-warning');
            return;
            //TODO - Currently, we haven't found a suitable translation in our own translations or common translations
        }

        //TODO: cloudDesktopSidebarService implementaion is pending searchFilter = cloudDesktopSidebarService.getFilterRequestParams()
        //Once cloudDesktopSidebarService.getFilterRequestParams() is ready please remove below searchFilter
        const searchFilter = {
            Pattern: null,
            PageSize: 700,
            PageNumber: 0,
            UseCurrentClient: true,
            UseCurrentProfitCenter: null,
            IncludeNonActiveItems: false,
            IncludeReferenceLineItems: null,
            ProjectContextId: null,
            PinningContext: [],
            ExecutionHints: false
        };

        this.salesBillingBillDataService.updateAndExecute(() => {
            this.http.post<string>(
                `${this.configService.webApiBaseUrl}sales/billing/transaction/prepareforall`,searchFilter).subscribe((response: string) => {
                if (response) {
                    this.messageBoxService.showMsgBox('Task to generate transactions already started. Its status can be checked in validation container.', this.headerText, 'ico-warning');
                    //TODO - Currently, we haven't found a suitable translation in our own translations or common translations
                    
                    this.salesBillingValidationDataService.addJob(response);
                    this.salesBillingValidationDataService.updateAll();
                } else {
                    this.messageBoxService.showMsgBox('Generate transaction task fail may be: '+ response, this.headerText, 'ico-warning');
                    //TODO - Currently, we haven't found a suitable translation in our own translations or common translations
                    
                }
            });
		});
    }
}