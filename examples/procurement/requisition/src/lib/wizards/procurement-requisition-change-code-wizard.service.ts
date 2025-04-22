/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedChangeCodeDialogService } from '@libs/basics/shared';
import { IInitializationContext } from '@libs/platform/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { ProcurementRequisitionHeaderValidationService } from '../services/validations/requisition-header-validation.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementRequisitionChangeCodeWizardService {

	public async changeCode (context: IInitializationContext){
		const changeCodeDialogService = context.injector.get(BasicsSharedChangeCodeDialogService<IReqHeaderEntity>);

		const options = changeCodeDialogService
			.createDefaultOptions(
				context.injector.get(ProcurementRequisitionHeaderDataService),
				context.injector.get(ProcurementRequisitionHeaderValidationService),
				context.injector.get(ProcurementRequisitionHeaderDataService),
				'procurement.requisition.wizard.change.code.headerText'
			);

		await changeCodeDialogService.show(options);
	}
}