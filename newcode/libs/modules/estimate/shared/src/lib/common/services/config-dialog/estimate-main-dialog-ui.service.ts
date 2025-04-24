/*
 * Copyright(c) RIB Software GmbH
 */

import { EstimateMainEstimateConfigConfigurationService } from './estimate-main-estimate-config-configuration.service';
import { inject, Injectable } from '@angular/core';
import { IFormConfig } from '@libs/ui/common';
import { IEstimateMainConfigComplete} from '@libs/estimate/interfaces';
import { EstimateMainColumnConfigLayoutService } from './column-config/estimate-main-column-config-layout.service';
import { EstimateMainStructureLayoutService } from './estimate-structure/estimate-main-structure-layout.service';
import { EstimateMainRuleAssignLayoutService } from './estimate-rule-config/estimate-main-rule-assign-layout.service';
import { TotalsConfigLayoutService } from './totals-config/totals-config-layout.service';
import { RoundingConfigLayoutService } from './rounding-config/rounding-config-layout.service';

/**
 * estimate config dialog service
 */
@Injectable({ providedIn: 'root' })
export class EstimateMainDialogUiService{
	private readonly estimateConfigConfigurationService = inject(EstimateMainEstimateConfigConfigurationService<IEstimateMainConfigComplete>);
	private readonly columnConfigLayoutService = inject(EstimateMainColumnConfigLayoutService<IEstimateMainConfigComplete>);
	private readonly estimateMainStructureLayoutService = inject(EstimateMainStructureLayoutService<IEstimateMainConfigComplete>);
	private readonly estimateMainRuleAssignLayoutService = inject(EstimateMainRuleAssignLayoutService<IEstimateMainConfigComplete>);
	private readonly totalsConfigLayoutService = inject(TotalsConfigLayoutService<IEstimateMainConfigComplete>);
	private readonly roundingConfigLayoutService = inject(RoundingConfigLayoutService<IEstimateMainConfigComplete>);

	private getBaseFormConfig():IFormConfig<IEstimateMainConfigComplete> {
		return {
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [],
			rows: [],
		};
	}

	/**
	 * get form configuration
	 */
	public getFormConfig(){
		const formConfig = this.getBaseFormConfig();

		//merge estimate config
		this.estimateConfigConfigurationService.addColumnConfigRow(formConfig, false, false);

		//merge column config
		this.columnConfigLayoutService.addColumnConfigRow(formConfig, false);

		//merge estimate structure
		this.estimateMainStructureLayoutService.addColumnConfigRow(formConfig, false);

		//merge rule assign
		this.estimateMainRuleAssignLayoutService.addColumnConfigRow(formConfig,false);

		//merge totals config
		this.totalsConfigLayoutService.addColumnConfigRow(formConfig, false);

		//merge rounding config
		this.roundingConfigLayoutService.addColumnConfigRow(formConfig, false);

		return formConfig;
	}
}