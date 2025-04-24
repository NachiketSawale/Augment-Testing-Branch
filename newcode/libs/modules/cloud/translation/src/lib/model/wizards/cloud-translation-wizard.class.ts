/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { CloudTranslationWizardService } from '../../services/wizards/cloud-translation-wizard.service';


/**
 * A wizard for cloud translation.
 */
export class CloudTranslationWizard {

    /**
     * The export to Excel process using the provided initialization context.
     */
	public exportToExcel(context: IInitializationContext){
		const service = context.injector.get(CloudTranslationWizardService);
		service.exportToExcel();
	}
	/**
	 * Initiates the wizard for importFromExcel.
	 * @param context - The initialization context.
	 */
	public importFromExcel(context: IInitializationContext){
		const service = context.injector.get(CloudTranslationWizardService);
		service.importFromExcel();
	}
}