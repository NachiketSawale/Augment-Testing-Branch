/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ImportCostCodesService } from '../../services/wizard/import-cost-codes.service';


export class CostCodeWizard {
	public importCostCodesWizard(context: IInitializationContext){
		const service = context.injector.get(ImportCostCodesService);
		service.importCostCodesWizard();
	}
}
