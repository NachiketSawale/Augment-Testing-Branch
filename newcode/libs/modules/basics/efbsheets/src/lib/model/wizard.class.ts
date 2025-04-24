/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { BasicsEfbSheetsUpdateWagesWizardService } from '../wizards/basics-efb-sheets-update-wages-wizard.service';

/**
 * This class provides functionality for efb sheets wizards
*/
export class EfbSheetsWizard {

/**
 * This method provides functionality for Update Wages wizard
 */
public updateWages(context: IInitializationContext) {
	const service = context.injector.get(BasicsEfbSheetsUpdateWagesWizardService);
	service.updateWages();
}
}