/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IValidationFunctions,
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	ValidationInfo,
	ValidationResult,
	IFieldValidationResult,
	IReadOnlyField,
} from '@libs/platform/data-access';
import { IMaterialPriceConditionEntity } from '@libs/basics/interfaces';
import { BasicsMaterialCalculationService } from '../../material';
import { BasicsSharedMaterialCreateSimilarMaterialService } from './material-create-similar-material.service';
import { BasicsSharedDataValidationService } from '../../services/basics-shared-data-validation.service';
import { PlatformConfigurationService, Translatable } from '@libs/platform/common';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { firstValueFrom, map } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { get, isNil } from 'lodash';

/**
 * Material record validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialCreateMaterialValidationService extends BaseValidationService<IMaterialEntity> {
	private readonly createSimilarMaterialService = inject(BasicsSharedMaterialCreateSimilarMaterialService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly calculationService = inject(BasicsMaterialCalculationService);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);
	// No foreign currency in material module, just 1.
	private readonly materialExchangeRate = 1;

	protected generateValidationFunctions(): IValidationFunctions<IMaterialEntity> {
		return {
			MaterialCatalogFk: this.validateMaterialCatalogFk,
			MaterialGroup: this.validateMaterialGroup,
			Code: this.validateCode,
			ListPrice: this.validateListPrice,
			Discount: this.validateDiscount,
			Charges: this.validateCharges,
			PriceExtra: this.validatePriceExtra,
			MdcTaxCodeFk: this.validateMdcTaxCodeFk,
			PrcPriceconditionFk: this.validatePrcPriceconditionFk,
			CostPriceGross: this.validateCostPriceGross
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialEntity> {
		//TODO should have a common function to implement the interface when validation not in container
		return {
			removeInvalid: (entity: IMaterialEntity, result: IFieldValidationResult<IMaterialEntity>) => {},
			addInvalid: (entity: IMaterialEntity, result: IFieldValidationResult<IMaterialEntity>) => {},
			setEntityReadOnly: (entity: IMaterialEntity, readonly: boolean) => {},
			setEntityReadOnlyFields: (entity: IMaterialEntity, readonlyFields: IReadOnlyField<IMaterialEntity>[]) => {},
			getValidationErrors: (entity: IMaterialEntity) => [],
			getInvalidEntities: () => [],
			hasValidationErrors: () => false,
			isEntityReadOnly: (entity: IMaterialEntity) => false,
			getEntityReadOnlyFields: (entity: IMaterialEntity) => [],
			getEntityReadonlyRuntimeData: (entity: IMaterialEntity) => null
		};
	}

	private async validateMaterialCatalogFk(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		const groupId = await this.getMaterialGroupByCatalog(value);
		if (!groupId) {
			return this.validateFail(info, { key: 'basics.material.error.materialCatalogNoGroup' });
		} else {
			entity.MaterialGroupFk = groupId;
			const groupResult = this.validateMaterialGroup({entity: entity, value: groupId, field: 'MaterialGroup'});
			if (!groupResult.valid) {
				return groupResult;
			} else {
				const newCode = await this.reGenerateCodeByCatalog(value);
				entity.Code = newCode;
				await this.validateCode({entity: entity, value: newCode, field: 'Code'});
				return this.validateSuccess(info);
			}
		}
	}

	private validateMaterialGroup(info: ValidationInfo<IMaterialEntity>): ValidationResult {
		const value = info.value as number;
		if (isNil(value) || value < 0) {
			return this.validateFail(info,isNil(value) ?
				{ key: 'cloud.common.emptyOrNullValueErrorMessage' } :
				{ key: 'basics.material.error.materialGroupSelectError' });
		} else {
			return this.validateSuccess(info);
		}
	}

	private async validateCode(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as string;
		const result = this.validationUtils.isUniqueAndMandatory(info, []);
		if (!result.valid) {
			return Promise.resolve(result);
		} else {
			const isUnique = await this.checkIsUniqueMaterialCode(entity.Id, value, entity.MaterialGroupFk);
			if (!isUnique) {
				return this.validateFail(info,{ key: 'basics.material.error.materialCodeUniqueError' });
			}
			return this.validateSuccess(info);
		}
	}

	private validateMdcTaxCodeFk(info: ValidationInfo<IMaterialEntity>): ValidationResult {
		const entity = info.entity;
		entity.MdcTaxCodeFk = info.value as number;
		this.calculationService.calculateCostPriceGross([entity]);
		return this.validationUtils.createSuccessObject();
	}

	private async validatePrcPriceconditionFk(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		info.entity.PrcPriceconditionFk = info.value as number;
		await this.priceConditionReload(info.entity, info.entity.PrcPriceconditionFk);
		return this.validationUtils.createSuccessObject();
	}

	private validateCostPriceGross(info: ValidationInfo<IMaterialEntity>): ValidationResult {
		info.entity.CostPriceGross = info.value as number;
		this.calculationService.calculateCostByCostPriceGross(info.entity);
		return this.validationUtils.createSuccessObject();
	}

	private async costPriceValidator(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		const model = info.field as string;
		this.calculationService.calculateCost(entity, value, model);
		await this.priceConditionRecalculate(entity);
		return this.validationUtils.createSuccessObject();
	}

	private validateListPrice = this.costPriceValidator;
	private validateDiscount = this.costPriceValidator;
	private validateCharges = this.costPriceValidator;
	private validatePriceExtra = this.costPriceValidator;

	private validateSuccess(info: ValidationInfo<IMaterialEntity>): ValidationResult {
		const result = this.validationUtils.createSuccessObject();
		this.getEntityRuntimeData().removeInvalid(info.entity, {
			field: info.field,
			result: result
		});
		return result;
	}

	private validateFail(info: ValidationInfo<IMaterialEntity>, error: Translatable): ValidationResult {
		const errorResult = this.validationUtils.createErrorObject(error);
		this.getEntityRuntimeData().addInvalid(info.entity, {
			field: info.field,
			result: errorResult
		});
		return errorResult;
	}

	private async getMaterialGroupByCatalog(materialCatalogId: number): Promise<number | undefined> {
		return firstValueFrom(this.http.get(this.configurationService.webApiBaseUrl + 'basics/material/getMaterialGroupByCatalog?id=' + materialCatalogId).pipe(map((res) => {
			return res as (number | undefined);
		})));
	}

	private async reGenerateCodeByCatalog(materialCatalogId: number): Promise<string> {
		return firstValueFrom(this.http.get(this.configurationService.webApiBaseUrl + 'basics/material/reGenerateCodeByCatalog?id=' + materialCatalogId).pipe(map((res) => {
			return res as string;
		})));
	}

	private async checkIsUniqueMaterialCode(id: number, code: string, groupId: number): Promise<boolean> {
		return firstValueFrom(this.http.get(this.configurationService.webApiBaseUrl + 'basics/material/isunique?id=' + id + '&&code=' + code + '&&groupFK=' + groupId).pipe(map((res) => {
			return res as boolean;
		})));
	}

	private async priceConditionRecalculate(material: IMaterialEntity): Promise<IMaterialPriceConditionEntity[]> {
		const priceConditions = this.createSimilarMaterialService.getMaterialPriceConditions();
		return firstValueFrom(this.http.post(this.configurationService.webApiBaseUrl + 'basics/material/pricecondition/recalculate', {
			PriceConditions: priceConditions,
			MainItem: material,
			ExchangeRate: this.materialExchangeRate
		}).pipe(map((res) => {
			const priceConditions = get(res, 'PriceConditions')! as IMaterialPriceConditionEntity[];
			this.handleUpdatedPriceCondition(material, priceConditions);
			return priceConditions;
		})));
	}

	private async priceConditionReload(material: IMaterialEntity, prcPriceConditionId: number): Promise<IMaterialPriceConditionEntity[]> {
		return firstValueFrom(this.http.post(this.configurationService.webApiBaseUrl + 'basics/material/pricecondition/reload', {
			PrcPriceConditionId: prcPriceConditionId,
			MainItem: material,
			ExchangeRate: this.materialExchangeRate
		}).pipe(map((res) => {
			const priceConditions = get(res, 'PriceConditions')! as IMaterialPriceConditionEntity[];
			this.handleUpdatedPriceCondition(material, priceConditions);
			return priceConditions;
		})));
	}

	private handleUpdatedPriceCondition(material: IMaterialEntity, priceConditions: IMaterialPriceConditionEntity[]) {
		this.createSimilarMaterialService.setMaterialPriceConditions(priceConditions);
		this.calculationService.updatePriceExtra(material, priceConditions);
		this.calculationService.calculateCost(material);
	}
}