/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlatformCommonModule, PlatformConfigurationService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import { IPrcInventoryHeaderEntity } from '../../model/entities/prc-inventory-header-entity.interface';
import { UiCommonMessageBoxService } from '@libs/ui/common';

/**
 * Generate inventory response entity.
 */
interface IGenerateInventoryResponse {
    isSuccess: boolean;
    hasStockTotal: boolean;
    message: string;
}

@Component({
	selector: 'procurement-inventory-generate-inventory-dialog-component',
	templateUrl: './generate-inventory-dialog-component.component.html',
	styleUrls: ['./generate-inventory-dialog-component.component.scss'],
	imports: [FormsModule,PlatformCommonModule],
	standalone: true
})

export class GenerateInventoryDialogComponentComponent {
    public constructor(@Inject('selectedHeaderIdData') public selectedHeader : IPrcInventoryHeaderEntity) { }

	private configService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	public clearActualQuantity: boolean = false;
	private readonly title = 'procurement.inventory.header.generateInventory';
	
	public async onOKBtnClicked() {
		let params = new HttpParams();
		params = params.set('mainItemFk', this.selectedHeader.Id);
		params = params.set('clearActualQuantity', this.clearActualQuantity);
		const url = this.configService.webApiBaseUrl + 'procurement/inventory/header/generateinventory';
		const response = await firstValueFrom(this.http.get<IGenerateInventoryResponse>(url, {params: params}));
		if (response) {
			if(response.isSuccess && !response.hasStockTotal){
				this.messageBoxService.showMsgBox('procurement.inventory.noinventorycreated', this.title,'ico-info');
			}
			if(!response.isSuccess){
				this.messageBoxService.showMsgBox(response.message, this.title, 'ico-info');
			}
		}

		//TODO: cloudDesktopSidebarService.filterRequest not implemented
		//TODO refresh main service
    }
}
