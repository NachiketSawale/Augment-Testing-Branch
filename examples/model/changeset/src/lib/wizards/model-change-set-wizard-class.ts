/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ModelChangeSetRepeatComparisonWizardService } from '../services/model-change-set-repeat-comparison-wizard.service';
import { ModelChangeSetModelComparisonWizardService } from '../services/model-change-set-model-comparison-wizard.service';

/**
 *
 * This class provides functionality for model ChangeSet wizards
 */
export class ModelChangeSetWizard {

	/**
	 * This method provides functionality for Repeat Comparison 
	 */
	public recompareModels(context: IInitializationContext) {
		const service = context.injector.get(ModelChangeSetRepeatComparisonWizardService);
		service.recompareModels();
	}

	/**
	 * This method provides functionality for Model Comparison 
	 */
	public compareModels(context: IInitializationContext) {
		const service = context.injector.get(ModelChangeSetModelComparisonWizardService);
		service.compareModels();
	}
}