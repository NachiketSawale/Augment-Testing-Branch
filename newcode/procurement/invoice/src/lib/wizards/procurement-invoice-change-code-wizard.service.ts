/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import { BasicsSharedChangeCodeDialogService } from '@libs/basics/shared';
import { IInitializationContext } from '@libs/platform/common';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { IInvHeaderEntity } from '../model';
import { ProcurementInvoiceHeaderValidationService } from '../header/procurement-invoice-header-validation.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementInvoiceChangeCodeWizardService {

	public async changeCode (context: IInitializationContext){
		const changeCodeDialogService = context.injector.get(BasicsSharedChangeCodeDialogService<IInvHeaderEntity>);

		const options = changeCodeDialogService
			.createDefaultOptions(
				context.injector.get(ProcurementInvoiceHeaderDataService),
				context.injector.get(ProcurementInvoiceHeaderValidationService),
				context.injector.get(ProcurementInvoiceHeaderDataService),
				'procurement.invoice.wizard.change.code.headerText'
			);

		await changeCodeDialogService.show(options);
	}
}