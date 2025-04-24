/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedChangeCodeDialogService } from '@libs/basics/shared';
import { ProcurementRfqHeaderMainDataService } from '../services/procurement-rfq-header-main-data.service';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderValidationService } from '../services/validations/procurement-rfq-header-validation.service';
import { IInitializationContext } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqChangeCodeWizardService {

	public async changeCode (context: IInitializationContext){
		const changeCodeDialogService = context.injector.get(BasicsSharedChangeCodeDialogService<IRfqHeaderEntity>);

		const options = changeCodeDialogService
			.createDefaultOptions(
				context.injector.get(ProcurementRfqHeaderMainDataService),
				context.injector.get(RfqHeaderValidationService),
				context.injector.get(ProcurementRfqHeaderMainDataService),
				'procurement.contract.wizard.change.code.headerText'
			);

		await changeCodeDialogService.show(options);
	}
}