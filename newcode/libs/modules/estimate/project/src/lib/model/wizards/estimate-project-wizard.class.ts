/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { EstimateProjectChangeEstimateStatusService } from '../../services/wizards/estimate-project-change-estimate-status-wizard.service';

export class EstimateProjectWizard {
	
	/**
	 * Initiates the wizard for changing the estimate status.
	 * @param context - The initialization context.
	 */
	public changeEstimateStatus(context: IInitializationContext) {
		const service = context.injector.get(EstimateProjectChangeEstimateStatusService);
		service.changeEstimateStatus();
	}
}
