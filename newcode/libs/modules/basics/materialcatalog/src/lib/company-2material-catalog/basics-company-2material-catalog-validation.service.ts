/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsCompany2MaterialCatalogDataService } from './basics-company-2material-catalog-data.service';
import { set, get } from 'lodash';
import { ICompanies2MaterialCatalogEntity } from '../model/entities/companies-2-material-catalog-entity.interface';

/**
 * Material catalog 2 company validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCompany2MaterialCatalogValidationService extends BaseValidationService<ICompanies2MaterialCatalogEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsCompany2MaterialCatalogDataService);

	protected generateValidationFunctions(): IValidationFunctions<ICompanies2MaterialCatalogEntity> {
		return {
			IsOwner: this.validateUpdateChildEntityFlag,
			CanEdit: this.validateUpdateChildEntityFlag,
			CanLookup: this.validateUpdateChildEntityFlag,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICompanies2MaterialCatalogEntity> {
		return this.dataService;
	}

	protected validateUpdateChildEntityFlag(info: ValidationInfo<ICompanies2MaterialCatalogEntity>): ValidationResult {
		this.setChildNodeFlag(info, info.entity);
		return this.validationUtils.createSuccessObject();
	}

	private setChildNodeFlag(info: ValidationInfo<ICompanies2MaterialCatalogEntity>, entity: ICompanies2MaterialCatalogEntity) {
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
