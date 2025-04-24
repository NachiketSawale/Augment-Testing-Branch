/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IFieldValidationResult, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { BasicsMaterialRecordDataService } from './basics-material-record-data.service';
import { firstValueFrom } from 'rxjs';
import { union, includes, clone, set } from 'lodash';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';

import { BasicsMaterialInheritCodeValue } from '../model/enums/basics-material-inherit-code-value.enum';
import {
	BasicsSharedDataValidationService,
	BasicsSharedMaterialGroupLookupService,
	BasicsSharedProcurementStructureLookupService,
	BasicsSharedPackagingTypesLookupService,
	BasicsSharedMaterialLookupService,
	IMaterialSearchEntity,
	BasicsSharedMaterialTemplateTypeLookupService,
	BasicsSharedDangerClassLookupService,
	BasicsSharedUomLookupService,
	BasicsSharedNumberGenerationService
} from '@libs/basics/shared';
import { IMdcMaterial2basUomEntity } from '../model/entities/mdc-material-2-bas-uom-entity.interface';
import { BasicsMaterialPriceConditionDataService } from '../price-condition/basics-material-price-condition-data.service';

/**
 * Material record validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialRecordValidationService extends BaseValidationService<IMaterialEntity> {
	private readonly http = inject(PlatformHttpService);
	private readonly dataService = inject(BasicsMaterialRecordDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly materialLookupService = inject(BasicsSharedMaterialLookupService);
	private readonly materialGroupLookupService = inject(BasicsSharedMaterialGroupLookupService);
	private readonly procurementStructureLookupService = inject(BasicsSharedProcurementStructureLookupService);
	private readonly materialTemplateTypeLookup = inject(BasicsSharedMaterialTemplateTypeLookupService);
	private readonly dangerousClassLookupService = inject(BasicsSharedDangerClassLookupService);
	private readonly uomLookupService = inject(BasicsSharedUomLookupService);
	private readonly priceConditionService = inject(BasicsMaterialPriceConditionDataService);
	private readonly numberGenerationService = inject(BasicsSharedNumberGenerationService);

	protected generateValidationFunctions(): IValidationFunctions<IMaterialEntity> {
		return {
			UomFk: this.validateUomFk,
			BasUomPriceUnitFk: this.validateBasUomPriceUnitFk,
			Code: this.validateCode,
			MdcTaxCodeFk: this.validateMdcTaxCodeFk,
			CostPriceGross: this.validateCostPriceGross,
			NeutralMaterialCatalogFk: this.validateNeutralMaterialCatalogFk,
			StockMaterialCatalogFk: this.validateStockMaterialCatalogFk,
			MaterialGroupFk: this.validateMaterialGroupFk,
			ListPrice: this.validateListPrice,
			Discount: this.validateDiscount,
			Charges: this.validateCharges,
			PriceExtra: this.validatePriceExtra,
			RetailPrice: this.validateRetailPrice,
			Weight: this.validateWeight,
			MaterialTempTypeFk: this.validateMaterialTempTypeFk,
			MaterialTempFk: this.validateMaterialTempFk,
			PackageTypeFk: this.validatePackageTypeFk,
			DangerClassFk: this.validateDangerClassFk,
			MdcMaterialStockFk: this.validateMdcMaterialStockFk,
			PrcPriceconditionFk: this.validatePrcPriceconditionFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialEntity> {
		return this.dataService;
	}

	private validateUomFk(info: ValidationInfo<IMaterialEntity>): ValidationResult {
		const entity = info.entity;
		const result = this.validationUtils.isMandatory(info);
		if (result.valid) {
			entity.BasUomPriceUnitFk = info.value as number;
			entity.FactorPriceUnit = 1;
		}
		return result;
	}

	private async validateBasUomPriceUnitFk(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;

		entity.FactorPriceUnit = 1;

		if (this.isUomFkSet(entity) && value) {
			const uomObj = await this.uomLookupService.getItemByKeyAsync({id: entity.UomFk});
			const uomPriceObj = await this.uomLookupService.getItemByKeyAsync({id: value});
			if (uomObj && uomPriceObj) {
				if (
					(uomPriceObj.LengthDimension !== 0 && uomObj.LengthDimension === uomPriceObj.LengthDimension) ||
					(uomPriceObj.MassDimension !== 0 && uomObj.MassDimension === uomPriceObj.MassDimension) ||
					(uomPriceObj.TimeDimension !== 0 && uomObj.TimeDimension === uomPriceObj.TimeDimension)
				) {
					if (uomPriceObj.Factor !== 0 && uomPriceObj.Factor && uomObj.Factor) {
						entity.FactorPriceUnit = uomObj.Factor / uomPriceObj.Factor;
					}
				}
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private async validateCode(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const list = this.dataService.getList();
		const result = this.validationUtils.isUniqueAndMandatory(info, list);
		if (!result.valid) {
			return result;
		} else {
			const entity = info.entity;
			const value = info.value as string;
			const isUnique = await this.checkIsUniqueMaterialCode(entity.Id, value, entity.MaterialGroupFk);

			if (!isUnique) {
				return this.validationUtils.createErrorObject({key: 'basics.material.error.materialCodeUniqueError'});
			} else {
				return this.validationUtils.createSuccessObject();
			}
		}
	}

	private validateMdcTaxCodeFk(info: ValidationInfo<IMaterialEntity>): ValidationResult {
		const entity = info.entity;
		entity.MdcTaxCodeFk = info.value as number;
		this.dataService.setCostPriceGross([entity]);
		return this.validationUtils.createSuccessObject();
	}

	private validateCostPriceGross(info: ValidationInfo<IMaterialEntity>): ValidationResult {
		info.entity.CostPriceGross = info.value as number;
		this.dataService.recalculateCostByCostPriceGross(info.entity);
		return this.validationUtils.createSuccessObject();
	}

	private validateNeutralMaterialCatalogFk(info: ValidationInfo<IMaterialEntity>): ValidationResult {
		info.entity.MdcMaterialFk = null;
		return this.validationUtils.createSuccessObject();
	}

	private async validateStockMaterialCatalogFk(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		entity.MdcMaterialStockFk = null;

		return await this.validateMdcMaterialStockFk(new ValidationInfo<IMaterialEntity>(entity, undefined, 'MdcMaterialStockFk'));
	}

	private async validateMaterialGroupFk(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		if (value < 0) {
			return this.validationUtils.createErrorObject({key: 'basics.material.error.materialShouldCoversionUom'});
		} else {
			const isUnique = await this.checkIsUniqueMaterialCode(entity.Id, entity.Code, value);
			if (!isUnique) {
				return this.validationUtils.createErrorObject({key: 'basics.material.error.materialCodeUniqueError'});
			} else {
				const group = await this.materialGroupLookupService.getItemByKeyAsync({id: value});

				const successResult = this.validationUtils.createSuccessObject();
				entity.MaterialCatalogFk = group.MaterialCatalogFk;
				if (group.PrcStructureFk) {
					const structure = await this.procurementStructureLookupService.getItemByKeyAsync({id: group.PrcStructureFk});
					if (structure) {
						entity.MdcTaxCodeFk = structure.TaxCodeFk;
					}
					return successResult;
				} else {
					return successResult;
				}
			}
		}
	}

	private async costPriceValidator(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		const model = info.field as string;

		this.dataService.recalculateCost(entity, value, model);
		set(entity, model, value);
		await this.priceConditionService.recalculate(entity.PrcPriceConditionFk);

		return this.validationUtils.createSuccessObject();
	}

	private validateListPrice = this.costPriceValidator;
	private validateDiscount = this.costPriceValidator;
	private validateCharges = this.costPriceValidator;
	private validatePriceExtra = this.costPriceValidator;

	private async withRecalculatePriceCondition(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		const model = info.field as string;

		set(entity, model, value);
		await this.priceConditionService.recalculate(entity.PrcPriceConditionFk);

		return this.validationUtils.createSuccessObject();
	}

	private validateRetailPrice = this.withRecalculatePriceCondition;
	private validateWeight = this.withRecalculatePriceCondition;

	private async validateMaterialTempTypeFk(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		const successResult = this.validationUtils.createSuccessObject();

		const newTempType = await this.materialTemplateTypeLookup.getItemByKeyAsync({id: value});
		if (!newTempType) {
			return this.validationUtils.createErrorObject({key: 'basics.material.error.materialTempTypeNotUpdated'});
		} else {
			if (newTempType && newTempType.IsTemplate) {
				entity.MaterialTempFk = null;
			}

			if (entity.Version) {
				const isCanChange = await this.checkCanChangetemptype(entity.Id, newTempType.IsTemplate);

				if (!isCanChange) {
					return this.validationUtils.createErrorObject({key: 'basics.material.error.materialCanNotBeSetToTypeOfNotTemplate'});
				}
			}

			entity.MaterialTempTypeFk = value;
			this.dataService.readonlyProcessor.process(entity);

			const hasToGenerate = this.numberGenerationService.hasNumberGenerateConfig(entity.BasRubricCategoryFk);
			if (hasToGenerate || newTempType.InheritCodeFk === BasicsMaterialInheritCodeValue.newCode || !entity.MaterialTempFk) {
				return successResult;
			} else {
				const tempEntity = clone(entity);
				tempEntity.Code = '';
				const code = await this.generateCodeOnTempTypeChanged(tempEntity);
				await this.handleGenerateCodeAfterTempTypeChange(entity, code);
				return successResult;
			}
		}
	}

	private async validateMaterialTempFk(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		const successResult = this.validationUtils.createSuccessObject();

		const tempType = await this.materialTemplateTypeLookup.getItemByKeyAsync({id: value});
		if (tempType && tempType.IsTemplate && value) {
			return this.validationUtils.createErrorObject({key: 'basics.material.error.materialIsTemplateShouldNoTempFk'});
		} else if (entity.Id === value) {
			return this.validationUtils.createErrorObject({key: 'basics.material.error.materialShouldNotSetTemplateToItSelf'});
		} else if (!value) {
			entity.MaterialTempFk = value;
			this.dataService.readonlyProcessor.process(entity);
			return successResult;
		}

		this.dataService.materialTempChangedEmitter.next();

		const hasToGenerateCode = this.numberGenerationService.hasNumberGenerateConfig(entity.BasRubricCategoryFk);
		const oldMaterialTemp = entity.MaterialTempFk ? await firstValueFrom(this.materialLookupService.getItemByKey({id: entity.MaterialTempFk})) : null;
		const newMaterialTemp = await firstValueFrom(this.materialLookupService.getItemByKey({id: value}));
		const generateCodeByTempType =
			entity.Version === 0 &&
			!hasToGenerateCode &&
			((oldMaterialTemp && newMaterialTemp && oldMaterialTemp.Code.toLowerCase() !== newMaterialTemp.Code.toLowerCase()) || !oldMaterialTemp) &&
			(!tempType || (tempType && tempType.InheritCodeFk !== BasicsMaterialInheritCodeValue.newCode));
		const tempEntity = clone(entity);
		tempEntity.MaterialTempFk = value;
		const codeGeneratedResult = generateCodeByTempType ? await this.generateCodeOnTempTypeChanged(tempEntity) : entity.Code;

		await this.updateUomFromMaterialTemp(entity, newMaterialTemp);
		await this.handleGenerateCodeAfterTempTypeChange(entity, codeGeneratedResult);

		this.dataService.readonlyProcessor.process(entity);
		return successResult;
	}

	private async validatePackageTypeFk(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const value = info.value as number;
		const successResult = this.validationUtils.createSuccessObject();
		if (!value) {
			return successResult;
		}

		const entity = info.entity;
		const packageTypesLookup = ServiceLocator.injector.get(BasicsSharedPackagingTypesLookupService);
		const packageType = await packageTypesLookup.getItemByKeyAsync({id: value});
		if (packageType) {
			entity.UomVolumeFk = packageType.UomFk || entity.UomVolumeFk;
			entity.Volume = packageType.DefaultCapacity;
		}

		return successResult;
	}

	private async validateDangerClassFk(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const value = info.value as number;

		const dangerClass = await this.dangerousClassLookupService.getItemByKeyAsync({id: value});
		if (dangerClass && dangerClass.PackageTypeFk) {
			info.entity.PackageTypeFk = dangerClass.PackageTypeFk;
			return await this.validatePackageTypeFk(new ValidationInfo(info.entity, value, info.field));
		}

		return this.validationUtils.createSuccessObject();
	}

	private async validateMdcMaterialStockFk(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		const successResult = this.validationUtils.createSuccessObject();
		if (!value) {
			this.dataService.removeInvalid(entity, {field: info.field, result: successResult});
			return successResult;
		}

		const data = await this.getMaterialInformationBasUoM(entity.Id);
		const materialItem = await firstValueFrom(this.materialLookupService.getItemByKey({id: value}));
		const arrayUomKeys = union(data.map((d) => d.BasUomFk), [entity.UomFk]);
		if (materialItem && includes(arrayUomKeys, materialItem.BasUomFk)) {
			return successResult;
		}

		const errorResult = this.validationUtils.createErrorObject({key: 'basics.material.error.materialShouldCoversionUom'});
		this.dataService.addInvalid(entity, {field: info.field, result: errorResult});
		return errorResult;
	}

	private async validatePrcPriceconditionFk(info: ValidationInfo<IMaterialEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;

		this.dataService.priceConditionChanged$.next(value);
		entity.PrcPriceconditionFk = value;

		await this.priceConditionService.reloadPriceConditions({priceConditionId: entity.PrcPriceConditionFk ?? null});
		return this.validationUtils.createSuccessObject();
	}

	private async checkIsUniqueMaterialCode(id: number, code: string, groupId: number): Promise<boolean> {
		return this.http.get<boolean>('basics/material/isunique', {
			params: {
				id: id,
				code: code,
				groupFK: groupId,
			},
		});
	}

	private async getMaterialInformationBasUoM(materialId: number): Promise<IMdcMaterial2basUomEntity[]> {
		return this.http.get<IMdcMaterial2basUomEntity[]>('basics/material/basuom/list', {
			params: {
				mainItemId: materialId,
			},
		});
	}

	private async checkCanChangetemptype(id: number, isTemplate: boolean): Promise<boolean> {
		return this.http.get<boolean>('basics/material/canchangetemptype', {
			params: {
				materialId: id,
				isTemplateOfNewType: isTemplate,
			},
		});
	}

	private async generateCodeOnTempTypeChanged(entity: IMaterialEntity): Promise<string> {
		return this.http.post<string>('basics/material/generatecodeontemptypechanged', entity);
	}

	private async updateUomFromMaterialTemp(entity: IMaterialEntity, materialTemp: IMaterialSearchEntity) {
		if (this.isUomFkSet(entity) || !materialTemp) {
			return;
		}

		const materialTempType = await this.materialTemplateTypeLookup.getItemByKeyAsync({id: materialTemp.MaterialTempTypeFk});
		if (!materialTempType?.Uom) {
			entity.UomFk = materialTemp.BasUomFk;
			const uomInfo = {entity: entity, value: entity.UomFk, field: 'UomFk'};
			const uomResult = this.validateUomFk(uomInfo);

			if (!uomResult.valid) {
				this.dataService.addInvalid(entity, {field: uomInfo.field, result: uomResult});
			}
		}
	}

	private async handleGenerateCodeAfterTempTypeChange(entity: IMaterialEntity, codeGeneratedResult: string): Promise<void> {
		if (!codeGeneratedResult) {
			return;
		}

		const field = 'Code';
		const fieldResult: IFieldValidationResult<IMaterialEntity> = {
			field: field,
			result: {apply: true, valid: true}
		};

		// TODO DEV-37659 the logic is depends on this string. Please enhance the server side code. Should not depends on such hard coded
		if (codeGeneratedResult.startsWith('Error:')) {
			entity.Code = '';
			fieldResult.result.valid = false;
			fieldResult.result.error = codeGeneratedResult.substring(6);
			this.dataService.addInvalid(entity, fieldResult);
			return;
		}

		entity.Code = codeGeneratedResult;
		fieldResult.result = await this.validateCode({entity: entity, value: entity.Code, field: field});
		if (fieldResult.result.valid) {
			this.dataService.removeInvalid(entity, fieldResult);
		} else {
			this.dataService.addInvalid(entity, fieldResult);
		}
		return;
	}

	private isUomFkSet(entity: IMaterialEntity): boolean {
		// TODO DEV-37633 when new a material, the UomFk is set -1, whether it need to be set a default value instead -1
		return (!!entity.UomFk && entity.UomFk !== -1);
	}
}
