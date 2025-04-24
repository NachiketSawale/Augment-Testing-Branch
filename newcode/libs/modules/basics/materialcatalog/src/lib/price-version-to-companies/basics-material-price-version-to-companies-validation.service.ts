/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { get, set } from 'lodash';
import { BasicsMaterialPriceVersionToCompaniesDataService } from './basics-material-price-version-to-companies-data.service';
import { IPriceVersionUsedCompanyEntity } from '../model/entities/price-version-used-company-entity.interface';

/**
 * Material price version to companies validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialPriceVersionToCompaniesValidationService extends BaseValidationService<IPriceVersionUsedCompanyEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsMaterialPriceVersionToCompaniesDataService);

	protected generateValidationFunctions(): IValidationFunctions<IPriceVersionUsedCompanyEntity> {
		return {
			Checked: this.validateUpdateChildEntityFlag,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPriceVersionUsedCompanyEntity> {
		return this.dataService;
	}

	protected validateUpdateChildEntityFlag(info: ValidationInfo<IPriceVersionUsedCompanyEntity>): ValidationResult {
		this.setChildNodeFlag(info, info.entity);
		return this.validationUtils.createSuccessObject();
	}

	private setChildNodeFlag(info: ValidationInfo<IPriceVersionUsedCompanyEntity>, entity: IPriceVersionUsedCompanyEntity) {
		const children = this.dataService.childrenOf(entity);
		if (children) {
			children.forEach((child) => {
				if (get(child, info.field) !== info.value) {
					set(child, info.field, info.value);
					this.dataService.setModified(child);
					this.dataService.entitiesUpdated(child);
				}
				this.setChildNodeFlag(info, child);
			});
		}
	}
}
