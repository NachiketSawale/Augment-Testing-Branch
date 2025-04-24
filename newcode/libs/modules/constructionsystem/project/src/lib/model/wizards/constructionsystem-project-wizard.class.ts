/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ConstructionSystemProjectChangeInstanceHeaderStatusService } from '../../services/wizards/change-instance-header-status-wizard.service';
import {
	CompareCosInstanceHeaderWizardService
} from '../../services/wizards/compare-cos-instance-header-wizard.service';
import { ChangeModelWizardService } from '../../services/wizards/change-model-wizard.service';

export class ConstructionSystemProjectWizard {

	public changeModel(context: IInitializationContext) {
		const service = context.injector.get(ChangeModelWizardService);
		service.changeModel();
	}

	/**
	 * Initiates the wizard for changing the instance header status.
	 * @param context - The initialization context.
	 */
	public changeInstanceHeaderStatus(context: IInitializationContext) {
		const service = context.injector.get(ConstructionSystemProjectChangeInstanceHeaderStatusService);
		service.changeInstanceHeaderStatus();
	}

	public compareCosInstanceHeader(context: IInitializationContext) {
		const service = context.injector.get(CompareCosInstanceHeaderWizardService);
		service.compareCosHeader();
	}
}
