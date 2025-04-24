/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ControllingSharedGroupSetDataService } from './controlling-shared-group-set-data.service';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ControllingUnitGroupSetCompleteIdentification, IControllingUnitdGroupSetEntity, IControllingUnitGroupSetEntityIdentification } from '@libs/controlling/interfaces';

/**
 * ControllingShared Group set Validation Service
 */
@Injectable({
	providedIn: 'root'
})

export class ControllingSharedGroupSetValidationService<T extends IControllingUnitdGroupSetEntity,
	PT extends IControllingUnitGroupSetEntityIdentification,
	PU extends ControllingUnitGroupSetCompleteIdentification<PT>>
	extends BaseValidationService<T> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	public constructor(
		protected dataService: ControllingSharedGroupSetDataService<T, PT, PU>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			ControllinggroupFk: this.validateControllinggroupFk,
			ControllinggroupdetailFk: this.validateControllinggroupdetailFk,
			//todo -- validateEntity
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	private validateControllinggroupFk(info: ValidationInfo<T>) {
		if (info.entity.ControllinggroupFk !== info.value) {
			info.entity.ControllinggrpdetailFk = undefined;
			this.validateControllinggroupdetailFk(info);
		}
		this.dataService.readonlyProcessor.process(info.entity);
		this.dataService.setModified(info.entity);
		return this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList());
	}

	private validateControllinggroupdetailFk(info: ValidationInfo<T>) {
		return this.validationUtils.isMandatory(info);
	}

}