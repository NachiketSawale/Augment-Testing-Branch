/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';

@Injectable({ providedIn: 'root' })

/**
 * Service for updating controlling budget wizard.
 */
export class EstimateMainUpdateControllingBudgetWizardService {
	private http = inject(HttpClient);
	private readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);

	/**
	 * This method provides functionality for update budgets.
	 */
	public  updateControllingBudget() {
		const data = {
			EstHeaderFk: this.estimateMainContextService.selectedEstHeaderFk,
			ProjectId: this.estimateMainContextService.getSelectedProjectId()
        };

		this.http.post(`${this.configService.webApiBaseUrl}estimate/main/calculator/updatecontrollingbudget`, data).subscribe((responseData) => {
			this.messageBoxService.showMsgBox(this.translate.instant({ key: 'estimate.main.updateControllingBudgetText' }).text, this.translate.instant({ key: 'estimate.main.updateControllingBudgetHeader' }).text, 'info');
		});
	}
}
