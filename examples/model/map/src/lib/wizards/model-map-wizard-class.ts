/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ModelMapSpacedLevelsWizardService } from '../services/model-map-spaced-levels-wizard.service';
import { ModelMapPopulateMapsFromLocationTreeWizardService } from '../services/model-map-populate-maps-from-location-tree-wizard.service';

/**
 *
 * This class provides functionality for model map wizards
 */
export class ModelMapWizard {

	/**
	 * This method provides functionality for Space Level
	 */
	public showDialogSpaceLevel(context: IInitializationContext) {
		const service = context.injector.get(ModelMapSpacedLevelsWizardService);
		service.spaceLevelModels();
	}

	/**
	 * This method provides functionality for Location Tree
	 */
	public showDialogLocationTree(context: IInitializationContext) {
		const service = context.injector.get(ModelMapPopulateMapsFromLocationTreeWizardService);
		service.locationTreeModels();
	}
}