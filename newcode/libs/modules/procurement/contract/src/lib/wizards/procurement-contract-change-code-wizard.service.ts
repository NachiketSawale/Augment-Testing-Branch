/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import { BasicsSharedChangeCodeDialogService } from '@libs/basics/shared';
import {ProcurementContractHeaderDataService} from '../services/procurement-contract-header-data.service';
import {IConHeaderEntity} from '../model/entities';
import { ProcurementContractHeaderValidationService } from '../services/procurement-contract-header-validation.service';
import { IInitializationContext } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractChangeCodeWizardService {

	public async changeCode (context: IInitializationContext){
		const changeCodeDialogService = context.injector.get(BasicsSharedChangeCodeDialogService<IConHeaderEntity>);

		const options = changeCodeDialogService
			.createDefaultOptions(
				context.injector.get(ProcurementContractHeaderDataService),
				context.injector.get(ProcurementContractHeaderValidationService),
				context.injector.get(ProcurementContractHeaderDataService),
				'procurement.contract.wizard.change.code.headerText'
			);

		await changeCodeDialogService.show(options);
	}
}