/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import {  ICustomDialog, ICustomDialogOptions, IDialogButtonBase, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProjectCostcodesPriceListForJobDataService } from './project-costcodes-price-list-for-job-data.service';
import { ProjectCostcodesPriceListForJobUiStandardService } from './project-costcodes-price-list-for-job-ui-standard.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { ProjectPriceListComponentComponent } from '../../components/project-costcodes-price-for-job-wizard/project-costcodea-price-for-job.component';

/**
 * Token for dialog body data.
 */
export const PROJECT_PRICE_LIST_DIALOG_DATA_TOKEN = new InjectionToken('project-pricelist-data');

/**
 * Function returns Token for dialog body data.
 *@returns { InjectionToken<IDialogButtonBase<ICustomDialog<unknown,unknown,void>,void>[]>} Token for dialog body data.
 */
export function getProjectPriceListToken(): InjectionToken<IDialogButtonBase<ICustomDialog<unknown, unknown, void>, void>[]> {
	return PROJECT_PRICE_LIST_DIALOG_DATA_TOKEN;
}

@Injectable({
	providedIn: 'root',
})

export class ProjectCostCodeWizardConfigurationService {
	public projectCostCodesDataService = inject(ProjectCostcodesPriceListForJobDataService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	public projectCostcodesPriceListForJobUiStandardService = inject(ProjectCostcodesPriceListForJobUiStandardService);
	private modalDialogService = inject(UiCommonDialogService);

	public async updateCostCodesPriceByPriceList(/*isInSummary, jobIds, costCodeIds*/) {

		// TODO
		// if (!projectMainService.hasSelection() && !isInSummary) {
		// 	let bodyText = $translate.instant('project.main.noCurrentSelection');
		// 	let headerText = $translate.instant('project.main.updateCostCodesPricesTitle');
		// 	platformModalService.showMsgBox(bodyText, headerText, 'ico-info');
		// 	return;
		// }

		// let projectCostCodesPriceListForJobDataService = $injector.get('projectCostCodesPriceListForJobDataService');
		// projectCostCodesPriceListForJobDataService.setFilters(jobIds, _.isArray(costCodeIds) ? costCodeIds : []);
		const buttons = [
			{ id:'UpdateBaseAll',caption:{key:'project.main.resetAllWithBasePriceBtnText', text:'Update Base All'}},{ id: StandardDialogButtonId.Ok }, { id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } }
		];

		const modalOptions: ICustomDialogOptions<{ text: string }, ProjectPriceListComponentComponent> = {
			width: '60%',
			buttons:buttons,
			headerText: this.translateService.instant('project.main.updateCostCodesPricesTitle'),			
			bodyComponent: ProjectPriceListComponentComponent,
			bodyProviders: [{ provide: getProjectPriceListToken(), useValue: buttons }],
		};
		await this.modalDialogService.show(modalOptions);		
		
	}
}


