/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { IProjectStock2ClerkEntity } from '@libs/project/interfaces';
import { ProjectStockClerkDataService } from './project-stock-clerk-data.service';
import { PropertyType, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedClerkRoleLookupService } from '@libs/basics/shared';
import {firstValueFrom} from 'rxjs';
/**
 * Project stock clerk validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProjectStockClerkValidationService extends BaseValidationService<IProjectStock2ClerkEntity> {
	private projectStockClerkDataService = inject(ProjectStockClerkDataService);

	protected override getMissingTimeSpanInfo = (info: ValidationInfo<IProjectStock2ClerkEntity>) : ValidationInfo<IProjectStock2ClerkEntity> | undefined => {
		switch (info.field) {
			case 'ValidFrom':
				return new ValidationInfo(info.entity, info.entity.ValidTo ?? undefined, 'ValidTo');
			case 'ValidTo':
				return new ValidationInfo(info.entity, info.entity.ValidFrom ?? undefined, 'ValidFrom');
			default:
				return new ValidationInfo(info.entity, info.value, info.field);
		}
	};

	protected generateValidationFunctions(): IValidationFunctions<IProjectStock2ClerkEntity> {
		return {
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo,
			BasClerkFk: this.validateBasClerkFk,
			BasClerkRoleFk: this.validateBasClerkRoleFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectStock2ClerkEntity> {
		return this.projectStockClerkDataService;
	}

	private validateValidFrom(info: ValidationInfo<IProjectStock2ClerkEntity>): ValidationResult {
		return this.validateIsValidTimeSpanFrom(info);
	}

	private validateValidTo(info: ValidationInfo<IProjectStock2ClerkEntity>): ValidationResult {
		return this.validateIsValidTimeSpanTo(info);
	}

	private validateBasClerkFk(info: ValidationInfo<IProjectStock2ClerkEntity>): ValidationResult {
		const result = new ValidationResult();
		if(this.validationFk(info.value)){
			result.valid = false;
			result.apply= true;
			result.error = 'cloud.common.emptyOrNullValueErrorMessage';
		}
		return result;
	}

	private validationFk(value: PropertyType | undefined ): boolean {
		return (
			value === undefined ||
			value === null ||
			value === '' ||
			value === -1 ||
			value === 0
		);
	}
	private async validateBasClerkRoleFk(info: ValidationInfo<IProjectStock2ClerkEntity>): Promise<ValidationResult>{
		const basClerkRoleLookupService = ServiceLocator.injector.get(BasicsSharedClerkRoleLookupService);
		const role = await firstValueFrom(basClerkRoleLookupService.getItemByKey({ id: info.entity.BasClerkRoleFk }));
		const isUnSuccess = info.value === 0 || (role && role.IsUnique && this.projectStockClerkDataService.getList().some(item => item.BasClerkRoleFk === info.value && item.Id !== info.entity.Id));

		if(isUnSuccess){
			const result = new ValidationResult();
			const errorMessage = info.value ? 'basics.common.clerkRoleMustBeUnique' : 'cloud.common.emptyOrNullValueErrorMessage';
			result.valid = false;
			result.apply= true;
			result.error = errorMessage;
		}

		return new ValidationResult();
	}
}