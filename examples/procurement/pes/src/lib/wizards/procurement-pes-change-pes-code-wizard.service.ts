/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import { BasicsSharedChangeCodeDialogService } from '@libs/basics/shared';
import { IPesHeaderEntity } from '../model/entities';
import { ProcurementPesHeaderDataService } from '../services/procurement-pes-header-data.service';
import { IInitializationContext } from '@libs/platform/common';
import { ProcurementPesHeaderValidationService } from '../services/validations/procurement-pes-header-validation.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPesChangePesCodeWizardService {
	public async changeCode (context: IInitializationContext){
		const changeCodeDialogService = context.injector.get(BasicsSharedChangeCodeDialogService<IPesHeaderEntity>);

		const options = changeCodeDialogService
			.createDefaultOptions(
				context.injector.get(ProcurementPesHeaderDataService),
				context.injector.get(ProcurementPesHeaderValidationService),
				context.injector.get(ProcurementPesHeaderDataService),
				'procurement.pes.wizard.change.code.headerText'
			);

		await changeCodeDialogService.show(options);
	}
}