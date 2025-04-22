/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedChangeCodeDialogService } from '@libs/basics/shared';
import { IInitializationContext } from '@libs/platform/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { ProcurementPackageHeaderValidationService } from '../services/validations/package-header-validation.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageChangeCodeWizardService {

	public async changeCode (context: IInitializationContext){
		const changeCodeDialogService = context.injector.get(BasicsSharedChangeCodeDialogService<IPrcPackageEntity>);

		const options = changeCodeDialogService
			.createDefaultOptions(
				context.injector.get(ProcurementPackageHeaderDataService),
				context.injector.get(ProcurementPackageHeaderValidationService),
				context.injector.get(ProcurementPackageHeaderDataService),
				'procurement.package.wizard.change.code.headerText'
			);

		await changeCodeDialogService.show(options);
	}
}