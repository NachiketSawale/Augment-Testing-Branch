/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementInventoryHeaderDataService } from '../procurement-inventory-header-data.service';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
/**
 * Procurement Process Inventory Wizard Service.
 */
export class ProcurementProcessInventoryWizardService {

    private configService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);
    private readonly messageBoxService = inject(UiCommonMessageBoxService);
    public modalDialogService = inject(UiCommonDialogService);
    private readonly inventoryHeaderDataService = inject(ProcurementInventoryHeaderDataService);
    private readonly title = 'procurement.inventory.header.processInventory';

    public async processInventory() {
        const selectedHeader = this.inventoryHeaderDataService.getSelectedEntity();

        if(!selectedHeader || selectedHeader.Id <= 0) {
            this.messageBoxService.showMsgBox('procurement.inventory.header.selectedHeader', this.title,'ico-info');
            return;
        }

        if(selectedHeader){
            if(selectedHeader.IsPosted){
                this.messageBoxService.showMsgBox('procurement.inventory.cannotexecutewizard', this.title,'ico-info');
                return;
            }
            if(!selectedHeader.IsCurrentCompany){
                this.messageBoxService.showMsgBox('procurement.inventory.notBelongToLoginCompanyMessage', this.title,'ico-info');
                return;
            }
    
            this.inventoryHeaderDataService.save().then(()=>{
                this.http.get(this.configService.webApiBaseUrl + 'procurement/inventory/header/processInventory?mainItemFk=' + selectedHeader.Id).subscribe(() => {
                    //TODO: cloudDesktopSidebarService implementaion as per angular js refrence code
                    //TODO: refresh inventoryHeaderDataService
                });
            });
        }
    }
    
}

