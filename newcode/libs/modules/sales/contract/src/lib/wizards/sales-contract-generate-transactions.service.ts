import { inject, Injectable } from '@angular/core';
import {PlatformConfigurationService, PlatformTranslateService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import {UiCommonMessageBoxService} from '@libs/ui/common';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';

@Injectable({
    providedIn: 'root'
})
export class SalesContractGenerateTransactionsWizardService {
    protected readonly translateService = inject(PlatformTranslateService);
    public headerDataService: SalesContractContractsDataService = inject(SalesContractContractsDataService);
    protected http = inject(HttpClient);
    protected configService = inject(PlatformConfigurationService);
    protected readonly messageBoxService = inject(UiCommonMessageBoxService);

    public generateTransaction() {
        const selectedEntity = this.headerDataService.getSelectedEntity();
        if(!selectedEntity) {
            this.messageBoxService.showMsgBox(this.translateService.instant('cloud.common.noCurrentSelection').text, this.translateService.instant('Generate Payment Schedule').text, 'ico-warning');
            return;
        }
        const queryPath = this.configService.webApiBaseUrl + 'sales/contract/transaction/generate?mainItemId='+ selectedEntity.Id;
        this.http.get(queryPath).subscribe((res) => {
            if(res === 0){
                this.messageBoxService.showMsgBox('There is no new new transaction generated, please check amount or status!', this.translateService.instant('Generate Transactions').text, 'ico-warning');
                return;
            } else if(Object(res).ErrorMessage){
                this.messageBoxService.showMsgBox(Object(res).ErrorMessage, this.translateService.instant('Generate Transactions').text, 'ico-warning');
                return;
            } else{
                this.messageBoxService.showInfoBox('Transaction Generated Successfully.', 'info', true);
                this.headerDataService.refreshSelected();
                return;
            }
        });
    }
}