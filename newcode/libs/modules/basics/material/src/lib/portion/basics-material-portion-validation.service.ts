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
import { sumBy } from 'lodash';
import { BasicsMaterialPortionDataService } from './basics-material-portion-data.service';
import { BasicsSharedCostCodeLookupService, BasicsSharedDataValidationService, BasicsSharedMaterialPortionTypeLookupService } from '@libs/basics/shared';
import { IMaterialPortionEntity } from '../model/entities/material-portion-entity.interface';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedPriceConditionResponse } from '@libs/basics/shared';
import { ICostCodeEntity } from '@libs/basics/costcodes';
import { firstValueFrom } from 'rxjs';

/**
 * Material Portion validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialPortionValidationService extends BaseValidationService<IMaterialPortionEntity> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly dataService = inject(BasicsMaterialPortionDataService);
	private readonly translationService: PlatformTranslateService = inject(PlatformTranslateService);
	private readonly http = inject(PlatformHttpService);
	private readonly costCodeLookupService = inject(BasicsSharedCostCodeLookupService);
	private readonly materialPortionTypeLookupService = inject(BasicsSharedMaterialPortionTypeLookupService);

	protected generateValidationFunctions(): IValidationFunctions<IMaterialPortionEntity> {
		return {
			PrcPriceConditionFk: this.validatePrcPriceConditionFk,
			Code: this.validateCode,
			MdcCostCodeFk: this.validateMdcCostCodeFk,
			CostPerUnit: this.validateCostPerUnit,
			Quantity: this.validateQuantity,
			IsEstimatePrice: this.validateIsEstimatePrice,
			IsDayworkRate: this.validateIsDayworkRate,
			MaterialPortionTypeFk: this.validateMaterialPortionTypeFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialPortionEntity> {
		return this.dataService;
	}

	protected async validatePrcPriceConditionFk(info: ValidationInfo<IMaterialPortionEntity>): Promise<ValidationResult> {
		if (!info.value) {
			info.entity.PriceExtra = 0;
			if (info.entity.IsEstimatePrice || info.entity.IsDayworkRate) {
				this.dataService.priceConditionService.handleRecalculateDone({
					PriceConditions: this.dataService.priceConditionService.getList(),
					IsSuccess: true,
					VatPercent: 0,
					Field: this.recalcuateFieldName(info.entity)
				});
			}
			return new ValidationResult();
		}
		const res = await this.http.post<BasicsSharedPriceConditionResponse>('basics/material/pricecondition/reload', {
			PrcPriceConditionId: info.value,
			MainItem: this.dataService.parentService.getSelectedEntity(),
			ExchangeRate: 1,
			IsFromMaterial: false,
			IsCopyFromPrcItem: false,
			MaterialPriceListId: null,
			HeaderId: 0,
			HeaderName: 'basicsMaterialRecordService',
			ProjectFk: 0,
			IsCopyFromBoqDivision: false,
			BasicPrcItemId: null
		});
		if (res && res.PriceConditions && res.PriceConditions.length > 0) {
			info.entity.PriceExtra = sumBy(res.PriceConditions, i => (i.PriceConditionType?.IsPriceComponent && i.IsActivated) ? i.Total : 0);
		}
		if (info.entity.IsEstimatePrice || info.entity.IsDayworkRate) {
			this.dataService.priceConditionService.handleRecalculateDone({
				PriceConditions: res.PriceConditions,
				IsSuccess: res.IsSuccess,
				VatPercent: 0,
				Field: this.recalcuateFieldName(info.entity)
			});
		}
		return new ValidationResult();
	}

	private recalcuateFieldName(entity: IMaterialPortionEntity) {
		let field = 'PrcPriceConditionFk';
		if (entity.IsEstimatePrice || !entity.IsDayworkRate) {
			field = 'IsEstimatePrice';
		} else if (!entity.IsEstimatePrice && entity.IsDayworkRate) {
			field = 'IsDayworkRate';
		}
		return field;
	}
	private async validateCode(info: ValidationInfo<IMaterialPortionEntity>) {
		return this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList(), 'cloud.common.entityCode');
	}

	private async validateMdcCostCodeFk(info: ValidationInfo<IMaterialPortionEntity>) {
		if (info.value && info.value != '0') {
			const costCode = await firstValueFrom(this.costCodeLookupService.getItemByKey({id: info.value as number}));
			if (costCode && costCode.Rate) {
				info.entity.CostPerUnit = costCode.Rate;
			}
		}
		this.dataService.fieldChanged('MdcCostCodeFk', info.entity);
		return new ValidationResult();
	}

	private validateCostPerUnit(info: ValidationInfo<IMaterialPortionEntity>): ValidationResult {
		info.entity.CostPerUnit = info.value ? (info.value as number) : 0;
		this.dataService.fieldChanged('CostPerUnit', info.entity);
		return new ValidationResult();
	}

	private validateQuantity(info: ValidationInfo<IMaterialPortionEntity>): ValidationResult {
		info.entity.Quantity = info.value ? (info.value as number) : 0;
		this.dataService.fieldChanged('Quantity', info.entity);
		return new ValidationResult();
	}

	private validateIsEstimatePrice(info: ValidationInfo<IMaterialPortionEntity>): ValidationResult {
		info.entity.IsEstimatePrice = info.value ? (info.value as boolean) : false;
		//TODO !isFromBulkEditor
		this.dataService.fieldChanged('IsEstimatePrice', info.entity);
		return new ValidationResult();
	}

	private validateIsDayworkRate(info: ValidationInfo<IMaterialPortionEntity>): ValidationResult {
		info.entity.IsDayworkRate = info.value ? (info.value as boolean) : false;
		// TODO if (!isFromBulkEditor) {
		this.dataService.fieldChanged('IsDayworkRate', info.entity);
		return new ValidationResult();
	}

	private async validateMaterialPortionTypeFk(info: ValidationInfo<IMaterialPortionEntity>) {
		if (!info.value) {
			return new ValidationResult();
		}
		const typeItem = await firstValueFrom(this.materialPortionTypeLookupService.getItemByKey({id: info.value as number}));
		if (!info.entity.MdcCostCodeFk && typeItem?.CostCodeFk) {
			info.entity.MdcCostCodeFk = typeItem.CostCodeFk;
			const costCodeEntity = await this.http.post<ICostCodeEntity>('basics/costcodes/getcostcodebyid', {Id: typeItem.CostCodeFk});
			if (costCodeEntity && costCodeEntity.Rate) {
				info.entity.CostPerUnit = costCodeEntity.Rate;
				this.dataService.fieldChanged('CostPerUnit', info.entity);
			}
		}
		if (!info.entity.PrcPriceConditionFk && typeItem?.PriceConditionFk) {
			info.entity.PrcPriceConditionFk = typeItem.PriceConditionFk;
			await this.validatePrcPriceConditionFk({entity: info.entity, value: typeItem.PriceConditionFk, field: 'PrcPriceConditionFk'});
		}
		return new ValidationResult();
	}
}