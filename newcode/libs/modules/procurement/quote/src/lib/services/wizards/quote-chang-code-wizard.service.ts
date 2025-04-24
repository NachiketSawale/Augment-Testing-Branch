/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedChangeCodeDialogService } from '@libs/basics/shared';
import { ProcurementQuoteHeaderDataService } from '../../services/quote-header-data.service';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { ProcurementQuoteHeaderValidationService } from '../../services/validations/quote-header-validation.service';
import { IInitializationContext } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteChangeCodeWizardService {

	public async changeCode (context: IInitializationContext){
		const changeCodeDialogService = context.injector.get(BasicsSharedChangeCodeDialogService<IQuoteHeaderEntity>);

		const options = changeCodeDialogService
			.createDefaultOptions(
				context.injector.get(ProcurementQuoteHeaderDataService),
				context.injector.get(ProcurementQuoteHeaderValidationService),
				context.injector.get(ProcurementQuoteHeaderDataService),
				'procurement.quote.wizard.change.code.headerText'
			);

		await changeCodeDialogService.show(options);
	}
}