/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {BusinesspartnerMainHeaderDataService} from '../businesspartner-data.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { lastValueFrom } from 'rxjs';
import { IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';


@Injectable({
	providedIn: 'root'
})
export class ChangeBusinessPartnerCodeService  { //todo-mike: the class need to refactor or remove.
	protected readonly dataService = inject(BusinesspartnerMainHeaderDataService);
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private messageBoxService = inject(UiCommonMessageBoxService);

	public async changeBpCode() {
		const currentItem = this.dataService.getSelection()[0];
		// judge is had rubric CATEGORY?
		if (!currentItem.RubricCategoryFk/* ===undefined||currentItem.RubricCategoryFk===null||currentItem.RubricCategoryFk===0 */) {
			this.messageBoxService.showMsgBox('businesspartner.main.changeBpCode.noRubricCategory', 'businesspartner.main.changeBpCode.title', 'ico-warning');
			return;
		}
		// can not use in create data
		if (currentItem.Version===0) {
			this.messageBoxService.showMsgBox('businesspartner.main.changeBpCode.zeroVersion', 'businesspartner.main.changeBpCode.title', 'ico-warning');
			return;
		}
		if (currentItem) {
			const data=await lastValueFrom(this.http.post<IBusinessPartnerEntity>(this.configService.webApiBaseUrl + 'businesspartner/main/businesspartnermain/generatebpcode',currentItem));
			if(data) {
				this.messageBoxService.showMsgBox('businesspartner.main.changeBpCode.successChange', 'businesspartner.main.changeBpCode.title', 'ico-info');
				// todo
				// businesspartnerMainHeaderDataService.refreshSelectedEntities();
			}else{
				this.messageBoxService.showMsgBox('businesspartner.main.changeBpCode.unknownIssue', 'businesspartner.main.changeBpCode.title', 'ico-warning');
			}
		}
	}
}