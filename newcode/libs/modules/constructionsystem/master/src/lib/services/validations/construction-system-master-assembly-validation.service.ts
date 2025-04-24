/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ICosAssemblyEntity } from '../../model/entities/cos-assembly-entity.interface';
import { ConstructionSystemMasterAssemblyDataService } from '../construction-system-master-assembly-data.service';

/**
 * Cos assembly validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterAssemblyValidationService extends BaseValidationService<ICosAssemblyEntity> {
	private readonly dataService = inject(ConstructionSystemMasterAssemblyDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<ICosAssemblyEntity> {
		return {
			Code: this.validateCode,
			EstLineItemFk: this.validateEstLineItemFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosAssemblyEntity> {
		return this.dataService;
	}

	public validateCode(info: ValidationInfo<ICosAssemblyEntity>) {
		this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList());
		return this.validationUtils.createSuccessObject();
	}

	public validateEstLineItemFk(info: ValidationInfo<ICosAssemblyEntity>): ValidationResult {
		this.validationUtils.isMandatory(info);
		return this.validationUtils.createSuccessObject();
	}
}
