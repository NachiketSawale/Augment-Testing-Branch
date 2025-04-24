import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {IPPSItem2ClerkEntity} from '../model/entities/pps-item-2clerk-entity.interface';
import {inject, Injectable} from '@angular/core';
import {PpsItem2ClerkDataService} from './pps-item-2-clerk-data.service';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})
export class PpsItem2ClerkValidationDataService extends BaseValidationService<IPPSItem2ClerkEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);

	public constructor(private dataService: PpsItem2ClerkDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IPPSItem2ClerkEntity> {
		return {
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo,
			ClerkFk: this.validateClerkFk,
			ClerkRoleFk: this.validateClerkRoleFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPPSItem2ClerkEntity> {
		return this.dataService;
	}

	private validateClerkRoleFk(info: ValidationInfo<IPPSItem2ClerkEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	private validateClerkFk(info: ValidationInfo<IPPSItem2ClerkEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	private validateValidFrom(info: ValidationInfo<IPPSItem2ClerkEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ValidTo, 'ValidTo');
	}

	private validateValidTo(info: ValidationInfo<IPPSItem2ClerkEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, info.entity.ValidFrom, <string>info.value, 'ValidFrom');
	}
}