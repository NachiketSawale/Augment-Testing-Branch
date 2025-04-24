/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IMdcMatPricever2custEntity } from '../model/entities/mdc-mat-pricever-2-cust-entity.interface';
import { BasicsMaterialPriceVersionToCustomerDataService } from './basics-material-price-version-to-customer-data.service';
import { BusinessPartnerLogicalValidatorFactoryService } from '@libs/businesspartner/shared';

/**
 * Material price version validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialPriceVersionToCustomerValidationService extends BaseValidationService<IMdcMatPricever2custEntity> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly dataService = inject(BasicsMaterialPriceVersionToCustomerDataService);
	private readonly businessPartnerLogicalValidatorFactoryService = inject(BusinessPartnerLogicalValidatorFactoryService);

	private readonly bpValidator = this.businessPartnerLogicalValidatorFactoryService.create({
		dataService: this.dataService,
		businessPartnerField: 'BpdBusinesspartnerFk',
		subsidiaryField: 'BpdSubsidiaryFk',
		customerField: 'BpdCustomerFk',
	});

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMdcMatPricever2custEntity> {
		return this.dataService;
	}

	protected generateValidationFunctions(): IValidationFunctions<IMdcMatPricever2custEntity> {
		return {
			BpdBusinesspartnerFk: this.validateBusinessPartnerFk,
		};
	}

	private async validateBusinessPartnerFk(info: ValidationInfo<IMdcMatPricever2custEntity>): Promise<ValidationResult> {
		const newValue = info.value;

		if (!newValue) {
			return this.validationUtils.isFkMandatory(info);
		}

		return this.bpValidator.businessPartnerValidator({ entity: info.entity, value: info.value as number });
	}
}
