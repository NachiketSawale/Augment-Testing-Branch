/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceTypeAlternativeResTypeValidationGeneratedService } from './generated/resource-type-alternative-res-type-validation-generated.service';
import { inject, Injectable } from '@angular/core';
import { IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IResourceTypeAlternativeResTypeEntity } from '@libs/resource/interfaces';
import { firstValueFrom } from 'rxjs';
import { ResourceTypeLookupService } from '@libs/resource/shared';

@Injectable({
	providedIn: 'root'
})
export class ResourceTypeAlternativeResTypeValidationService extends ResourceTypeAlternativeResTypeValidationGeneratedService {

	private readonly resTypeLookupService = inject(ResourceTypeLookupService);

	public override generateValidationFunctions(): IValidationFunctions<IResourceTypeAlternativeResTypeEntity> {
		return {
			ResAlterTypeFk: [this.validateIsMandatory, this.validateResAlterTypeFk]
		};
	}
	protected async validateResAlterTypeFk(info: ValidationInfo<IResourceTypeAlternativeResTypeEntity>): Promise<ValidationResult> {
		const resAlterTypeFk = info.value as number;
		if(resAlterTypeFk){
			// Get related PlantGroupFk
			const typeItem = await firstValueFrom(this.resTypeLookupService.getItemByKey({id: resAlterTypeFk}));
			info.entity.PlantGroupFk = typeItem?.PlantGroupFk ?? undefined;
			this.resourceTypeAlternativeResTypeData.setModified(info.entity);
			return {apply: true, valid: true};
		}

		info.entity.PlantGroupFk = undefined;
		this.resourceTypeAlternativeResTypeData.setModified(info.entity);
		return {apply: !!info.value, valid: true};
	}
}