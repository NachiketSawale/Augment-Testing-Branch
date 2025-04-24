import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { TransportplanningBundleGridDataService } from '../transportplanning-bundle-grid-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IBundleEntity } from '../../model/entities/bundle-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class TransportPlanningBundleValidationService extends BaseValidationService<IBundleEntity> {
	public dataService = inject(TransportplanningBundleGridDataService);
	private validateUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<IBundleEntity> {
		return {
			Code: this.validateCode,
			LgmJobFk: this.validateLgmJobFk,
			ProjectFk: this.validateProjectFk,
			LDQuantity: this.validateLDQuantity,
			LDRequestedFrom: this.validateLDRequestedFrom,
			LDRequestedTo: this.validateLDRequestedTo,
			LDUomFk: this.validateLDUomFk,
			LDTypeFk: this.validateLDTypeFk,
			LDJobFk: this.validateLDJobFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBundleEntity> {
		return this.dataService;
	}

	protected validateCode(info: ValidationInfo<IBundleEntity>): ValidationResult {
		return this.validateUtils.isMandatory(info);
	}

	protected validateLgmJobFk(info: ValidationInfo<IBundleEntity>): ValidationResult {
		return this.validateUtils.isMandatory(info);
	}

	protected validateProjectFk(info: ValidationInfo<IBundleEntity>): ValidationResult {
		return this.validateUtils.isMandatory(info);
	}

	protected validateLDQuantity(info: ValidationInfo<IBundleEntity>): ValidationResult {
		return this.validateUtils.isMandatory(info);
	}

	protected validateLDRequestedFrom(info: ValidationInfo<IBundleEntity>): ValidationResult {
		return this.validateUtils.isMandatory(info);
	}

	protected validateLDRequestedTo(info: ValidationInfo<IBundleEntity>): ValidationResult {
		return this.validateUtils.isMandatory(info);
	}

	protected validateLDUomFk(info: ValidationInfo<IBundleEntity>): ValidationResult {
		return this.validateUtils.isMandatory(info);
	}

	protected validateLDTypeFk(info: ValidationInfo<IBundleEntity>): ValidationResult {
		return this.validateUtils.isMandatory(info);
	}

	protected validateLDJobFk(info: ValidationInfo<IBundleEntity>): ValidationResult {
		return this.validateUtils.isMandatory(info);
	}
}
