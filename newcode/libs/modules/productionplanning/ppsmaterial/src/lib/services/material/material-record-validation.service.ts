/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { IMaterialNewEntity } from '../../model/models';
import { PpsMaterialRecordDataService } from './material-record-data.service';

@Injectable({
	providedIn: 'root'
})
export class PpsMaterialRecordValidationService extends BaseValidationService<IMaterialNewEntity> {

	private readonly dataService = inject(PpsMaterialRecordDataService);

	protected generateValidationFunctions(): IValidationFunctions<IMaterialNewEntity> {
		return {
			'PpsMaterial.ProdMatGroupFk': this.validateIsMandatory,
			'PpsMaterial.BasClobsPqtyContent': this.validateIsMandatory,
			'PpsMaterial.BasClobsBqtyContent': this.validateIsMandatory,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialNewEntity> {
		return this.dataService;
	}

}
