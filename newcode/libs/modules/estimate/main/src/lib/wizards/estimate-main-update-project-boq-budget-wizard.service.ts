/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';

@Injectable({ providedIn: 'root' })

/**
 * Service for updating  project boq budget wizard.
 */
export class EstimateMainUpdateProjectBoqBudgetWizardService {
	private http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);

	/**
	 * This method provides functionality for update project boq budgets.
	 */
	public  updateProjectBoqBudget() {
		const data = {
			EstHeaderFk: this.estimateMainContextService.selectedEstHeaderFk,
			ProjectId: this.estimateMainContextService.getSelectedProjectId()
        };

		this.http.post(`${this.configService.webApiBaseUrl}estimate/main/wizard/updateprojectboqbudget`, data).subscribe((responseData) => {
			this.messageBoxService.showMsgBox(this.translate.instant({ key: 'estimate.main.updateProjectBoqBudgetWizard.updatePrjConBoqBudgetText' }).text, this.translate.instant({ key: 'estimate.main.updateProjectBoqBudgetWizard.updatePrjConBoqBudgetHeader' }).text, 'info');
		});
	}
}
