/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IPpsCad2mdcMaterialEntity } from '../../model/models';
import { PpsCadToMaterialDataService } from './pps-cad-to-material-data.service';

export const PPS_CAD_TO_MATERIAL_VALIDATION_TOKEN = new InjectionToken<PpsCadToMaterialValidationService>('ppsCadToMaterialValidationToken');

@Injectable({
	providedIn: 'root'
})
export class PpsCadToMaterialValidationService extends BaseValidationService<IPpsCad2mdcMaterialEntity> {

	private dataService = inject(PpsCadToMaterialDataService);
	
	protected generateValidationFunctions(): IValidationFunctions<IPpsCad2mdcMaterialEntity> {
		return {
			MdcMaterialFk: this.validateMdcMaterialFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsCad2mdcMaterialEntity> {
		return this.dataService;
	}

	private validateMdcMaterialFk(info: ValidationInfo<IPpsCad2mdcMaterialEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}
}
