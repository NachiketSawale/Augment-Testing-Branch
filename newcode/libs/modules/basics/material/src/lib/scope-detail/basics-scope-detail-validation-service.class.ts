/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions, ValidationInfo, ValidationResult,
} from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { BasicScopeDetailCalculationService, BasicsSharedDataValidationService, BasicsSharedMaterialLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import {
	IMaterialScopeDetailEntity,
	IBasicsScopeDetailDataService,
	IBasicsScopeDetailValidationService
} from '@libs/basics/interfaces';
import { IDescriptionInfo } from '@libs/platform/common';

export class BasicsScopeDetailValidationService<T extends IMaterialScopeDetailEntity> extends BaseValidationService<T> implements IBasicsScopeDetailValidationService<T> {
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);
	protected readonly uomLookupService = inject(BasicsSharedUomLookupService);
	protected readonly calculationService = inject(BasicScopeDetailCalculationService);
	protected readonly materialLookupService = inject(BasicsSharedMaterialLookupService);

	public constructor(protected readonly dataService: IBasicsScopeDetailDataService<T>) {
		super();
	}

	public generateValidationFunctions(): IValidationFunctions<T> {
		return {
			PrcPriceConditionFk: this.validatePrcPriceConditionFk.bind(this),
			ItemNo: this.validateItemNo.bind(this),
			PrcStructureFk: this.validatePrcStructureFk.bind(this),
			UomFk: this.validateUomFk.bind(this),
			UomPriceUnitFk: this.validateUomPriceUnitFk.bind(this),
			Price: this.validatePrice.bind(this),
			PriceOc: this.validatePriceOc.bind(this),
			PriceExtra: this.validatePriceExtra.bind(this),
			PriceExtraOc: this.validatePriceExtraOc.bind(this),
			PriceUnit: this.validatePriceUnit.bind(this),
			FactorPriceUnit: this.validateFactorPriceUnit.bind(this),
			Quantity: this.validateQuantity.bind(this),
			MaterialFk: this.validateMaterialFk.bind(this),
			ScopeOfSupplyTypeFk: this.validateScopeOfSupplyType.bind(this)
		};
	}

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	protected validatePrcPriceConditionFk(info: ValidationInfo<T>): ValidationResult {
		// Todo - will be handle in https://rib-40.atlassian.net/browse/DEV-14463
		return this.validationUtils.createSuccessObject();
	}

	protected validateItemNo(info: ValidationInfo<T>): ValidationResult {
		return this.validationUtils.isUnique(this.dataService, info, this.dataService.getList());
	}

	protected validatePrcStructureFk(info: ValidationInfo<T>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	protected validateUomFk(info: ValidationInfo<T>): ValidationResult {
		info.entity.UomPriceUnitFk = info.value as number;
		info.entity.FactorPriceUnit = 1;
		return this.validationUtils.createSuccessObject();
	}

	protected async validateUomPriceUnitFk(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity;
		const uoms = await firstValueFrom(this.uomLookupService.getList());
		const uomE = uoms.find(e => e.Id === entity.UomFk);
		const uomPUE = uoms.find(e => e.Id === info.value as number);

		if (uomE && uomPUE && uomE.Factor && uomPUE.Factor && this.uomLookupService.isSameDimension(uomE, uomPUE)) {
			entity.FactorPriceUnit = uomE.Factor / uomPUE.Factor;
		} else {
			entity.FactorPriceUnit = 1;
		}

		return this.validationUtils.createSuccessObject();
	}

	protected async validatePrice(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		entity.Price = value;
		entity.PriceOc = this.calculationService.convertToOc(value, this.dataService.getExchangeRate());
		await this.calculateTotal(entity);
		return this.validationUtils.createSuccessObject();
	}

	protected async validatePriceOc(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		entity.PriceOc = value;
		entity.Price = this.calculationService.convertFromOc(value, this.dataService.getExchangeRate());
		await this.calculateTotal(entity);
		return this.validationUtils.createSuccessObject();
	}

	protected async validatePriceExtra(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		entity.PriceExtra = value;
		entity.PriceExtraOc = this.calculationService.convertToOc(value, this.dataService.getExchangeRate());
		await this.calculateTotal(entity);
		return this.validationUtils.createSuccessObject();
	}

	protected async validatePriceExtraOc(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		entity.PriceExtraOc = value;
		entity.PriceExtra = this.calculationService.convertFromOc(value, this.dataService.getExchangeRate());
		await this.calculateTotal(entity);
		return this.validationUtils.createSuccessObject();
	}

	protected async validatePriceUnit(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		entity.PriceUnit = value;
		await this.calculateTotal(entity);
		return this.validationUtils.createSuccessObject();
	}

	protected validateFactorPriceUnit(info: ValidationInfo<T>): ValidationResult {
		const entity = info.entity;
		const value = info.value as number;
		entity.FactorPriceUnit = value;
		this.calculateTotal(entity);
		return this.validationUtils.createSuccessObject();
	}

	protected validateQuantity(info: ValidationInfo<T>): ValidationResult {
		const entity = info.entity;
		const value = info.value as number;
		entity.Quantity = value;
		this.calculateTotal(entity);
		return this.validationUtils.createSuccessObject();
	}

	private async calculateTotal(entity: T) {
		this.calculationService.calculateTotal(entity);
		await this.dataService.applyScopeTotal();
	}

	protected async validateMaterialFk(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity;

		entity.MaterialFk = info.value as number;
		this.dataService.readonlyProcessor.process(entity);

		// Regarding price list, after selecting a price version in material lookup dialog, material respective fields will be overrided by price list, so we just need to get price from material lookup item in the cache.
		const materialEntity = await firstValueFrom(this.materialLookupService.getItemByKey({id: entity.MaterialFk}));

		entity.PriceUnit = materialEntity.PriceUnit;
		entity.UomFk = materialEntity.BasUomFk;
		entity.UomPriceUnitFk = materialEntity.BasUomPriceUnitFk;
		entity.FactorPriceUnit = materialEntity.FactorPriceUnit;
		
		if(entity.Description1Info) {
			this.modifyTranslation(entity.Description1Info, materialEntity.DescriptionInfo);
		}
		if(entity.Description2Info) {
			this.modifyTranslation(entity.Description2Info, materialEntity.DescriptionInfo2);
		}
		if(entity.SpecificationInfo) {
			this.modifyTranslation(entity.SpecificationInfo, materialEntity.SpecificationInfo);	
		}
		

		if(materialEntity.PrcStructureFk && entity.PrcStructureFk !== materialEntity.PrcStructureFk) {
			entity.PrcStructureFk = materialEntity.PrcStructureFk;
			const prcStructureVR = this.validatePrcStructureFk({
				entity: info.entity,
				field: 'PrcStructureFk',
				value: entity.PrcStructureFk
			});
			this.validationUtils.applyValidationResult(this.dataService, {
				entity: info.entity,
				field: 'PrcStructureFk',
				result: prcStructureVR
			});
		}

		if(materialEntity.PrcPriceconditionFk) {
			await this.dataService.reloadPriceCondition(entity, materialEntity.PrcPriceconditionFk, materialEntity.MaterialPriceListFk);
		}

		return this.validationUtils.createSuccessObject();
	}

	private modifyTranslation(a: IDescriptionInfo, b: IDescriptionInfo) {
		a.Translated = b.Translated;
		a.Modified;
	}

	protected async validateScopeOfSupplyType(info: ValidationInfo<T>): Promise<ValidationResult> {

		await this.dataService.applyScopeTotal();

		return this.validationUtils.createSuccessObject();
	}

}