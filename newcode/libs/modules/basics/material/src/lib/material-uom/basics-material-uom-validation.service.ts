/*
 * Copyright(c) RIB Software GmbH
 */
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { BasicsMaterialUomDataService } from '../material-uom/basics-material-uom-data.service';

import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IMdcMaterial2basUomEntity } from '../model/entities/mdc-material-2-bas-uom-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialUomValidationService extends BaseValidationService<IMdcMaterial2basUomEntity> {
	private dataService = inject(BasicsMaterialUomDataService);
	private validationService = inject(BasicsSharedDataValidationService);

	protected validateBasUomFk(info: ValidationInfo<IMdcMaterial2basUomEntity>): ValidationResult {
		return this.validationService.isUnique(this.dataService, info, this.dataService.getList());
	}

	protected validateIsDefaultForInternalDelivery(info: ValidationInfo<IMdcMaterial2basUomEntity>): ValidationResult {
		const selectedUoms = this.dataService.getList().filter((uom) => uom.IsDefaultForInternalDelivery);
		if (selectedUoms) {
			selectedUoms.forEach((item) => (item.IsDefaultForInternalDelivery = false));
		}
		if (typeof info.value === 'boolean') {
			info.entity.IsDefaultForInternalDelivery = info.value;
		}
		this.dataService.entitiesUpdated(selectedUoms);
		this.dataService.setModified(selectedUoms);

		return new ValidationResult();
	}

	protected generateValidationFunctions(): IValidationFunctions<IMdcMaterial2basUomEntity> {
		return {
			BasUomFk: this.validateBasUomFk,
			IsDefaultForInternalDelivery: this.validateIsDefaultForInternalDelivery,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMdcMaterial2basUomEntity> {
		return this.dataService;
	}
}
