/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { GenerateInventoryDialogComponentComponent } from '../components/generate-inventory-dialog-component/generate-inventory-dialog-component.component';
import { ProcurementInventoryHeaderDataService } from '../services/procurement-inventory-header-data.service';

@Injectable({
	providedIn: 'root'
})
export class GenerateInventoryWizardService {
    private readonly messageBoxService = inject(UiCommonMessageBoxService);
    public modalDialogService = inject(UiCommonDialogService);
    private readonly inventoryHeaderDataService = inject(ProcurementInventoryHeaderDataService);
    private readonly title = 'procurement.inventory.header.generateInventory';

    public async generateInventory() {
        const selectedHeader = this.inventoryHeaderDataService.getSelectedEntity();
        if(!selectedHeader || selectedHeader.Id <= 0) {
            return this.messageBoxService.showMsgBox('procurement.inventory.header.selectedHeader', this.title,'ico-info');
        }
        if(selectedHeader.Version === 0){
            return this.messageBoxService.showMsgBox('procurement.inventory.savefirst', this.title,'ico-info');
        }
        if(selectedHeader.IsPosted){
            return this.messageBoxService.showMsgBox('procurement.inventory.cannotexecutewizard', this.title,'ico-info');
        }

        const modalOptions: ICustomDialogOptions<{ text: string }, GenerateInventoryDialogComponentComponent> = {
			width: '600px',
			resizeable: true,
			backdrop: false,
			headerText: { key: 'procurement.inventory.wizard.generate.caption' },
			id: 'generateWizard',
			bodyComponent: GenerateInventoryDialogComponentComponent,
            buttons: [
                {
					id: StandardDialogButtonId.Ok,
                    caption: { key: 'ui.common.dialog.okBtn' },
					fn: (event, info) => {
                        info.dialog.body.onOKBtnClicked();
                    },
                    autoClose: true,
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'ui.common.dialog.cancelBtn' },
				},
			],
			bodyProviders: [{ provide: 'selectedHeaderIdData', useValue: selectedHeader }],
		};

        return await this.modalDialogService.show(modalOptions);
    }
}