/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsMaterialCatalogDataService } from './basics-material-catalog-data.service';
import { BasicsSharedDataValidationService, BasicsSharedMaterialCatalogTypeLookupService, IMaterialCatalogEntity } from '@libs/basics/shared';
import { BusinessPartnerLogicalValidatorFactoryService } from '@libs/businesspartner/shared';
import { firstValueFrom } from 'rxjs';

/**
 * Material catalog validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialCatalogValidationService extends BaseValidationService<IMaterialCatalogEntity> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly dataService = inject(BasicsMaterialCatalogDataService);
	private readonly businessPartnerLogicalValidatorFactoryService = inject(BusinessPartnerLogicalValidatorFactoryService);
	private readonly materialCatalogTypeService = inject(BasicsSharedMaterialCatalogTypeLookupService);

	private readonly bpValidator = this.businessPartnerLogicalValidatorFactoryService.create({
		dataService: this.dataService,
	});

	protected validateSubsidiaryFk = async (info: ValidationInfo<IMaterialCatalogEntity>) => this.bpValidator.subsidiaryValidator(info.entity, info.value as number);
	protected validateSupplierFk = async (info: ValidationInfo<IMaterialCatalogEntity>) => this.bpValidator.supplierValidator(info.entity, info.value as number);

	protected generateValidationFunctions(): IValidationFunctions<IMaterialCatalogEntity> {
		return {
			Code: this.validateCode,
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo,
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			SupplierFk: this.validateSupplierFk,
			SubsidiaryFk: this.validateSubsidiaryFk,
			MaterialCatalogTypeFk: this.validateMaterialCatalogTypeFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialCatalogEntity> {
		return this.dataService;
	}

	protected async validateCode(info: ValidationInfo<IMaterialCatalogEntity>): Promise<ValidationResult> {
		return this.validationUtils.isSynAndAsyncUnique(info, this.dataService.getList(), 'basics/materialcatalog/catalog/isunique');
	}

	private validateValidFrom(info: ValidationInfo<IMaterialCatalogEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ValidTo, 'ValidTo');
	}

	private validateValidTo(info: ValidationInfo<IMaterialCatalogEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, info.entity.ValidFrom, <string>info.value, 'ValidFrom');
	}

	private async validateBusinessPartnerFk(info: ValidationInfo<IMaterialCatalogEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const newValue = info.value;
		const materialCatalogType = await firstValueFrom(
			this.materialCatalogTypeService.getItemByKey({
				id: entity.MaterialCatalogTypeFk,
			}),
		);

		if (!newValue) {
			entity.SubsidiaryFk = null;
			entity.SupplierFk = null;

			if (materialCatalogType.IsFramework) {
				return this.validationUtils.isFkMandatory(info);
			} else {
				this.dataService.removeInvalid(entity, {
					field: 'BusinessPartnerFk',
					result: new ValidationResult(),
				});
				return this.validationUtils.createSuccessObject();
			}
		}

		return this.bpValidator.businessPartnerValidator({ entity: info.entity, value: info.value as number });
	}

	private async validateMaterialCatalogTypeFk(info: ValidationInfo<IMaterialCatalogEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const newValue = info.value as number;

		if (!entity.BusinessPartnerFk) {
			entity.MaterialCatalogTypeFk = newValue;
			await this.validationUtils.executeValidatorAsync(this, this.dataService, this.validateBusinessPartnerFk, new ValidationInfo(entity, entity.BusinessPartnerFk ?? undefined, 'BusinessPartnerFk'));
		}

		return this.validationUtils.createSuccessObject();
	}
}
