/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceEquipmentPlantValidationGeneratedService } from './generated/resource-equipment-plant-validation-generated.service';
import { Injectable } from '@angular/core';
import { ValidationInfo, ValidationResult, } from '@libs/platform/data-access';
import { IResourceEquipmentPlantEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentPlantValidationService extends ResourceEquipmentPlantValidationGeneratedService {
	protected override handwrittenValidators = {
		HasPoolJob : [this.validateHasPoolJob],
	};
	private validateHasPoolJob(info: ValidationInfo<IResourceEquipmentPlantEntity>): ValidationResult {
		info.entity.HasPoolJobChanged = false;
		if (info.entity.HasPoolJob !== info.value) {
			info.entity.HasPoolJobChanged = true;
		}
		return new ValidationResult();
	}
}