/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {BusinesspartnerMainHeaderDataService} from '../businesspartner-data.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { lastValueFrom } from 'rxjs';
import { ICheckVatNoResultResponse } from '../../model/responses/check-vat-no-result-response.interface';


@Injectable({
	providedIn: 'root'
})
export class CheckVatNoService  {
	protected readonly dataService = inject(BusinesspartnerMainHeaderDataService);
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private messageBoxService = inject(UiCommonMessageBoxService);

	public async checkVatNo() {
		const currentItem = this.dataService.getSelection()[0];
		if (currentItem) {
			const data=await lastValueFrom(this.http.get<ICheckVatNoResultResponse>(this.configService.webApiBaseUrl + 'businesspartner/main/businesspartnermain/checkbpvatno?vatNo=' + (currentItem.VatNo ?? '')));
			if(data){
				this.messageBoxService.showMsgBox(data.Response || '', 'businesspartner.main.checkVatWizard.title', 'ico-info');
			}else{
				this.messageBoxService.showMsgBox('businesspartner.main.checkVatWizard.unknownIssue', 'businesspartner.main.checkVatWizard.title', 'ico-info');
			}
		}
	}
}