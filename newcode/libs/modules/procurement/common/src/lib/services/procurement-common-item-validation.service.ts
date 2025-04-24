/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { isNil, find, map, max, set } from 'lodash';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { round as mathRound, bignumber } from 'mathjs';
import { IPrcItemEntity } from '../model/entities';
import { ProcurementCommonItemDataService } from './procurement-common-item-data.service';
import { PrcCommonItemComplete } from '../model/procurement-common-item-complete.class';
import { ProcurementPrcItemCalculationService, DiscountAndAbsoluteField, DiscountAbsoluteField, PriceField } from './helper';
import { Translatable, CompleteIdentification, IEntityIdentification, PlatformTranslateService, PlatformHttpService } from '@libs/platform/common';
import { BaseValidationService, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import {
	BasicsSharedDataValidationService,
	BasicsSharedMaterialLookupService,
	BasicsSharedTaxCodeLookupService,
	BasicsSharedUomLookupService,
	BasItemType,
	BasItemType2,
	IMaterialSearchEntity,
	BasicsSharedPrcStructureTaxLookupService,
} from '@libs/basics/shared';
import { EmptyFk, Nullable, ProcurementShareProjectChangeLookupService } from '@libs/procurement/shared';
import { LookupSearchRequest } from '@libs/ui/common';
import { ProcurementCommonItemBaseAltValidationService } from './procurement-common-item-base-alt-validation.service';
import { ProcurementCommonItemStatusLookupService } from '../lookups/procurement-common-item-status-lookup.service';

/**
 * The basic validation service for procurement item
 */
export abstract class ProcurementCommonItemValidationService<T extends IPrcItemEntity, U extends PrcCommonItemComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends BaseValidationService<T> {
	protected readonly http = inject(PlatformHttpService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly itemCalculationService = inject(ProcurementPrcItemCalculationService);
	protected readonly roundingType = this.itemCalculationService.getRoundingType<IPrcItemEntity>();
	protected readonly round = this.itemCalculationService.round.bind(this.itemCalculationService);
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);
	protected readonly itemBaseAltValidationService = inject(ProcurementCommonItemBaseAltValidationService<T, U, PT, PU>);
	protected readonly prcItemStatusLookupService = inject(ProcurementCommonItemStatusLookupService);

	protected readonly lookups = {
		taxCode: inject(BasicsSharedTaxCodeLookupService),
		uom: inject(BasicsSharedUomLookupService),
		material: inject(BasicsSharedMaterialLookupService),
		prcStructureTax: inject(BasicsSharedPrcStructureTaxLookupService),
		projectChange: inject(ProcurementShareProjectChangeLookupService)
	};

	protected get entityProxy() {
		return this.dataService.entityProxy;
	}

	/**
	 * The constructor
	 * @param dataService
	 */
	protected constructor(protected dataService: ProcurementCommonItemDataService<T, U, PT, PU>) {
		super();

		this.entityProxy.propertyChanged$.subscribe((e) => {
			const entity = e.entity;

			switch (<keyof T>e.field) {
				case 'LeadTime':
				case 'SafetyLeadTime':
				case 'BufferLeadTime':
				case 'LeadTimeExtra':
					{
						entity.TotalLeadTime = this.calculateTotalLeadTime(entity);
						this.updateTotalLeadTime(entity);
					}
					break;
				case 'HasScope': {
					this.dataService.readonlyProcessor.process(entity);
				}
			}
		});

		this.itemBaseAltValidationService.initialize({
			getItemList: () => {
				return this.dataService.getList();
			},
			validationService: this,
			dataService: this.dataService,
		});
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			Quantity: this.validateQuantity,
			PriceOc: this.validatePriceCommonFun,
			Price: this.validatePriceCommonFun,
			PriceGrossOc: this.validatePriceCommonFun,
			PriceGross: this.validatePriceCommonFun,
			Itemno: this.validateItemno,
			BasItemTypeFk: this.validateBasItemTypeFk,
			BasItemType2Fk: this.itemBaseAltValidationService.validateBasItemType2Fk.bind(this.itemBaseAltValidationService),
			BasItemType85Fk: this.validateBasItemType85Fk,
			BasUomFk: this.validateBasUomFk,
			AlternativeUomFk: this.validateAlternativeUomFk,
			BasUomPriceUnitFk: this.validateBasUomPriceUnitFk,
			AAN: this.itemBaseAltValidationService.validateAAN.bind(this.itemBaseAltValidationService),
			AGN: this.itemBaseAltValidationService.validateAGN.bind(this.itemBaseAltValidationService),
			Onhire: this.validateOnhire,
			Offhire: this.validateOffhire,
			PrcStructureFk: this.validatePrcStructureFk,
			MdcTaxCodeFk: this.validateMdcTaxCodeFk,
			MdcMaterialFk: this.validateMdcMaterialFk,
			MdcControllingUnitFk: this.validateMdcControllingUnitFk,
			LeadTime: this.validateLeadTime,
			SafetyLeadTime: this.validateLeadTime,
			BufferLeadTime: this.validateLeadTime,
			LeadTimeExtra: this.validateLeadTime,
			Co2Project: this.validateCo2Project,
			PrjChangeFk: this.validatePrjChangeFk,
			Specification: this.validateSpecification,
			PlantFk: this.validatePlantFk,
			FactorPriceUnit: this.validateFactorPriceUnit,
			PriceUnit: this.validatePriceUnit,
			TargetPrice: this.validateTargetPrice,
			TargetTotal: this.validateTargetTotal,
			Discount: this.validateDiscount,
			DiscountAbsolute: this.validateDiscountAbsoluteFields,
			DiscountAbsoluteOc: this.validateDiscountAbsoluteFields,
			DiscountAbsoluteGross: this.validateDiscountAbsoluteFields,
			DiscountAbsoluteGrossOc: this.validateDiscountAbsoluteFields,
			AlternativeQuantity: this.validateAlternativeQuantity,
			BudgetFixedUnit: this.validateBudgetFixedUnit,
			BudgetFixedTotal: this.validateBudgetFixedTotal,
			BudgetPerUnit: this.validateBudgetPerUnit,
			BudgetTotal: this.validateBudgetTotal,
			TotalGross: this.validateTotalGross,
			TotalGrossOc: this.validateTotalGrossOc,
			NotSubmitted: this.validateNotSubmitted,
		};
	}

	protected getEntityRuntimeData(): ProcurementCommonItemDataService<T, U, PT, PU> {
		return this.dataService;
	}

	/**
	 * Validate quantity
	 * @param info
	 * @protected
	 */
	protected async validateQuantity(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = this.entityProxy.apply(info.entity as T);
		const value = (info.value ?? 0) as number;
		const oldValue = entity.Quantity;
		entity.Quantity = value;
		this.setCo2ProjectTotalNCo2SourceTotal(entity);
		this.calTargetTotal(entity, entity.TargetPrice, value);
		this.calcQuantityConverted(entity, entity.FactorPriceUnit, value);
		entity.AlternativeQuantity = this.convertQuantity(entity, entity.AlternativeUomFk, value);
		await this.calculateRelatedQuantityFields(entity, oldValue, value);
		await this.resetExtraAndCalculateTotal(entity);
		return this.validationUtils.createSuccessObject();
	}

	/**
	 * Validate price common function
	 * @param info
	 * @protected
	 */
	protected async validatePriceCommonFun(info: ValidationInfo<T>): Promise<ValidationResult> {
		const entity = info.entity as T;
		const model = info.field as PriceField;
		const value = (info.value ?? 0) as number;
		entity[model] = value;
		const rate = this.dataService.getParentExchangeRate();
		const vatPercent = this.dataService.getVatPercent(entity);
		this.itemCalculationService.update4PriceFields(entity, value, model, vatPercent, rate);
		await this.resetExtraAndCalculateTotal(entity, true);
		this.updateDiscountAbsoluteReadOnly(entity);
		return this.validationUtils.createSuccessObject();
	}

	/**
	 * Validate Itemno
	 * @param info
	 * @protected
	 */
	protected async validateItemno(info: ValidationInfo<T>): Promise<ValidationResult> {
		const list = this.dataService.getList();
		return this.validationUtils.isValueUnique(info, list, 'procurement.common.prcItemItemNo');
	}

	protected validateTargetPrice(info: ValidationInfo<T>) {
		const value = (info.value ?? 0) as number;
		this.calTargetTotal(info.entity, value, info.entity.Quantity);
		return this.validationUtils.createSuccessObject();
	}

	protected validateTargetTotal(info: ValidationInfo<T>) {
		const value = (info.value ?? 0) as number;
		info.entity.TargetPrice = info.entity.Quantity === 0 ? 0 : this.round(this.roundingType.TargetPrice, bignumber(value).div(info.entity.Quantity));
		return this.validationUtils.createSuccessObject();
	}

	/**
	 * Set Co2ProjectTotal and Co2SourceTotal
	 * @param entity
	 * @protected
	 */
	protected setCo2ProjectTotalNCo2SourceTotal(entity: T) {
		if (!isNil(entity.Co2Project)) {
			entity.Co2ProjectTotal = mathRound(bignumber(entity.Co2Project).mul(entity.Quantity), 3).toNumber();
		}
		if (!isNil(entity.Co2Source)) {
			entity.Co2SourceTotal = mathRound(bignumber(entity.Co2Source).mul(entity.Quantity), 3).toNumber();
		}
	}

	/**
	 * Set TargetTotal
	 * @param entity
	 * @param targetPrice
	 * @param quantity
	 * @protected
	 */
	protected calTargetTotal(entity: T, targetPrice: number, quantity: number) {
		entity.TargetTotal = this.round(this.roundingType.TargetTotal, bignumber(quantity).mul(targetPrice));
	}

	/**
	 * Update discountAbsolute four fields readonly status
	 * @param entity
	 * @private
	 */
	private updateDiscountAbsoluteReadOnly(entity: T) {
		// Always refresh readonly fields for whole entity
		this.dataService.readonlyProcessor.process(entity);
	}

	protected async validateBasItemTypeFk(info: ValidationInfo<T>) {
		const entity = info.entity;

		entity.BasItemTypeFk = info.value as number;

		if (info.value === BasItemType.TextElement) {
			entity.BasItemType2Fk = BasItemType2.Normal;
			entity.BasUomFk = EmptyFk;
			entity.BasUomPriceUnitFk = EmptyFk;
			entity.AlternativeUomFk = EmptyFk;
			entity.AlternativeQuantity = 0;
			entity.SellUnit = 0;
			entity.Quantity = 0;
			entity.Price = 0;
			entity.PriceOc = 0;
			entity.PriceGross = 0;
			entity.PriceGrossOc = 0;
			entity.Total = 0;
			entity.TotalOc = 0;
			entity.TotalGross = 0;
			entity.TotalGrossOc = 0;
			entity.TotalPrice = 0;
			entity.TotalPriceOc = 0;
			entity.TotalPriceGross = 0;
			entity.TotalPriceGrossOc = 0;
			entity.FactorPriceUnit = 0;
			entity.QuantityRemaining = 0;
			entity.QuantityRemainingUi = 0;
			entity.QuantityConverted = 0;
			entity.PriceExtra = 0;
			entity.PriceExtraOc = 0;
			entity.Discount = 0;
			entity.DiscountAbsolute = 0;
			entity.DiscountAbsoluteGross = 0;
			entity.DiscountAbsoluteGrossOc = 0;
			entity.DiscountAbsoluteOc = 0;
			entity.DiscountSplit = 0;
			entity.DiscountSplitOc = 0;
			entity.TotalNoDiscount = 0;
			entity.TotalCurrencyNoDiscount = 0;
			entity.QuantityConfirm = 0;
			this.dataService.setModified(entity);
			this.validateBasUomFk(new ValidationInfo(entity, entity.BasUomFk, 'BasUomFk'));
		} else if (info.value === BasItemType.OptionalWithoutIT) {
			entity.TotalNoDiscount = 0;
			entity.TotalCurrencyNoDiscount = 0;
			entity.Total = 0;
			entity.TotalOc = 0;
			entity.TotalGross = 0;
			entity.TotalGrossOc = 0;
			this.dataService.setModified(entity);
		} else {
			await this.resetExtraAndCalculateTotal(entity);
		}

		this.dataService.readonlyProcessor.process(info.entity);

		return this.validationUtils.createSuccessObject();
	}

	protected async validateBasUomFk(info: ValidationInfo<T>) {
		const entity = info.entity;

		if (!info.value || info.value === EmptyFk) {
			if (entity.BasItemTypeFk !== BasItemType.TextElement) {
				const uom = this.translateService.instant('cloud.common.entityUoM').text;
				return this.validationUtils.createErrorObject({
					key: 'cloud.common.emptyOrNullValueErrorMessage',
					params: {
						fieldName: uom,
					},
				});
			}
		} else {
			// Whenever BAS_UOM_FK is changed then FactorPriceUnit is reinitialized to 1
			// When BAS_UOM_FK is changed, BasUomPriceUnitFk is updated to the same value

			// When BAS_UOM_FK is changed and MdcMaterialFk is null, AlternativeUomFk is updated to the same value
			if (!entity.MdcMaterialFk) {
				entity.AlternativeUomFk = info.value as number;
			}
			entity.BasUomPriceUnitFk = info.value as number;
			entity.FactorPriceUnit = 1;
			await this.resetExtraAndCalculateTotal(entity);
			this.calcQuantityConverted(entity, entity.FactorPriceUnit, entity.Quantity);
			this.dataService.setModified(entity);
		}

		return this.validationUtils.createSuccessObject();
	}

	private createCompareLessThanError() {
		return this.validationUtils.createErrorObject({
			key: 'cloud.common.ValidationRule_CompareLessThan',
			params: {
				p_0: 'on hire date',
				p_1: 'off hire date',
			},
		});
	}

	protected validateOnhire(info: ValidationInfo<T>) {
		if (info.entity.Offhire && info.value) {
			const onhire = new Date(info.value as string);
			if (onhire > new Date(info.entity.Offhire)) {
				return this.createCompareLessThanError();
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateOffhire(info: ValidationInfo<T>) {
		if (info.entity.Onhire && info.value) {
			const offhire = new Date(info.value as string);
			if (offhire < new Date(info.entity.Onhire)) {
				return this.createCompareLessThanError();
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	/**
	 * Update PriceExtra/PriceExtraOc and update other fields related to PriceExtra/PriceExtraOc
	 * @param entity
	 * @param isUpdatePrice
	 * @param notCalculateTotalIfExtraNoUpdate
	 */
	public async resetExtraAndCalculateTotal(entity: T, isUpdatePrice: boolean = false, notCalculateTotalIfExtraNoUpdate = false) {
		const isUpdatePriceExtra = await this.dataService.updatePriceExtra(entity);
		if (isUpdatePriceExtra || isUpdatePrice) {
			this.updateDiscountAfterPriceOrExtraChanged(entity);
			this.dataService.calculateTotalPriceNTotal(entity);
		} else {
			if (!notCalculateTotalIfExtraNoUpdate) {
				this.dataService.calculateTotal(entity);
			}
		}
	}

	protected async validatePrcStructureFk(info: ValidationInfo<T>) {
		const newValue = info.value as number;
		info.entity.PrcStructureFk = newValue;
		return await this.onPrcStructureFkChange(info.entity, newValue);
	}

	protected async onPrcStructureFkChange(entity: T, value: number, taxCodeFK?: number) {
		// onEntityCreated(value, entity);  TODO: dead loop

		const headerItem = this.dataService.headerEntity;
		const result = this.validationUtils.createSuccessObject();

		entity = this.entityProxy.apply(entity);

		if (!value) {
			const newTaxCodeFk = taxCodeFK ?? entity.MdcTaxCodeFk ?? headerItem.TaxCodeFk;
			if (entity.MdcTaxCodeFk !== newTaxCodeFk) {
				entity.MdcTaxCodeFk = newTaxCodeFk;
				await this.validateMdcTaxCodeFk(new ValidationInfo(entity, entity.MdcTaxCodeFk, 'MdcTaxCodeFk'));
			}
			return result;
		}

		const searchPrcStructureTaxReq = new LookupSearchRequest('', []);
		searchPrcStructureTaxReq.additionalParameters = {
			PrcStructureFk: value,
		};
		const searchPrcStructureTaxRes = await firstValueFrom(this.lookups.prcStructureTax.getSearchList(searchPrcStructureTaxReq));
		const prcStructureTax = searchPrcStructureTaxRes.items.length > 0 ? searchPrcStructureTaxRes.items[0] : null;

		// #93553 - Contract item no getting the tax code from material master
		const newTaxCodeFk = taxCodeFK ?? (prcStructureTax?.MdcTaxCodeFk ? prcStructureTax.MdcTaxCodeFk : null) ?? (entity.MdcTaxCodeFk ? entity.MdcTaxCodeFk : headerItem.TaxCodeFk);
		if (entity.MdcTaxCodeFk !== newTaxCodeFk) {
			entity.MdcTaxCodeFk = newTaxCodeFk;
			await this.validateMdcTaxCodeFk(new ValidationInfo(entity, entity.MdcTaxCodeFk, 'MdcTaxCodeFk'));
		}

		entity.MdcSalesTaxGroupFk = prcStructureTax?.MdcSalesTaxGroupFk;
		this.dataService.readonlyProcessor.process(entity);

		return result;
	}

	protected async validateMdcTaxCodeFk(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value as number;

		entity.IsInputTotal = false;
		entity.MdcTaxCodeFk = value;
		this.dataService.calculateAfterVatPercentChanged(entity);
		await this.resetExtraAndCalculateTotal(entity, false, true);
		return this.validationUtils.createSuccessObject();
	}

	protected validateAlternativeUomFk(info: ValidationInfo<T>) {
		const entity = info.entity;
		entity.AlternativeQuantity = this.convertQuantity(entity, info.value as number, entity.Quantity);
		return this.validationUtils.createSuccessObject();
	}

	/**
	 * rename from conversionQuantity in old angularjs
	 * @private
	 */
	private convertQuantity(entity: T, uom?: number | null, quantity?: number, alterAtiveQuantity?: number) {
		let uomQuantity = 1;
		const uomItem = find(entity.Material2Uoms, { UomFk: uom });

		if (uomItem && typeof uomItem === 'object' && 'Quantity' in uomItem) {
			uomQuantity = uomItem.Quantity;
		}
		if (uomQuantity === 0) {
			return 0;
		}
		if (!isNil(quantity)) {
			return this.round(this.roundingType.Quantity, bignumber(quantity).mul(uomQuantity)); // entity.AlternativeQuantity
		}
		if (!isNil(alterAtiveQuantity)) {
			return this.round(this.roundingType.Quantity, bignumber(alterAtiveQuantity).div(uomQuantity)); // entity.Quantity
		}
		return 0;
	}

	protected async validateBasUomPriceUnitFk(info: ValidationInfo<T>) {
		const entity = info.entity;

		entity.FactorPriceUnit = 1;

		const uoms = await firstValueFrom(this.lookups.uom.getList());
		const uomObj = find(uoms, (e) => e.Id === entity.BasUomFk);
		const uomPriceObj = find(uoms, (e) => e.Id === info.value);
		if (uomObj && uomPriceObj) {
			if (
				(uomPriceObj.LengthDimension !== 0 && uomObj.LengthDimension === uomPriceObj.LengthDimension) ||
				(uomPriceObj.MassDimension !== 0 && uomObj.MassDimension === uomPriceObj.MassDimension) ||
				(uomPriceObj.TimeDimension !== 0 && uomObj.TimeDimension === uomPriceObj.TimeDimension)
			) {
				if (uomPriceObj.Factor !== 0 && uomPriceObj.Factor) {
					entity.FactorPriceUnit = this.round(this.roundingType.FactorPriceUnit, bignumber(uomObj.Factor).div(uomPriceObj.Factor));
				}
			}
		}

		await this.resetExtraAndCalculateTotal(entity);
		this.calcQuantityConverted(entity, entity.FactorPriceUnit, entity.Quantity);
		this.dataService.setModified(entity);
		return this.validationUtils.createSuccessObject();
	}

	/**
	 * Set QuantityConverted
	 * @param entity
	 * @param factorPriceUnit
	 * @param quantity
	 * @protected
	 */
	protected calcQuantityConverted(entity: T, factorPriceUnit: number, quantity: number) {
		entity.QuantityConverted = this.round(this.roundingType.QuantityConverted, bignumber(quantity).mul(factorPriceUnit));
	}

	protected validateLeadTime(info: ValidationInfo<T>) {
		const entity = this.entityProxy.apply(info.entity);
		const value = info.value as number;
		set(entity, info.field, value);
		// Todo - comment following code because it will be handled in property changed, need to confirm, will be removed if working fine
		// entity.TotalLeadTime = this.calculateTotalLeadTime(entity);
		// this.updateTotalLeadTime(entity);
		return this.validationUtils.createSuccessObject();
	}

	protected updateTotalLeadTime(entity: T) {
		const list = this.dataService.getList();
		const maxTotalLeadTime = max(map(list, 'TotalLeadTime'));

		this.dataService.setModified(entity);

		if (maxTotalLeadTime) {
			this.dataService.parentService.updateTotalLeadTime(maxTotalLeadTime);
		}
	}

	protected validateCo2Project(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value as number;
		entity.Co2Project = value;
		this.setCo2ProjectTotalNCo2SourceTotal(entity);
		return this.validationUtils.createSuccessObject();
	}

	/**
	 * Could be override in specific modules to return sameBasicPrcItem in angularjs
	 * @param materialFk
	 * @protected
	 */
	protected async getItemWithSameMaterial(materialFk: number): Promise<Nullable<T>> {
		return null;
	}

	protected async validateMdcMaterialFk(info: ValidationInfo<T>) {
		const entity = this.entityProxy.apply(info.entity);
		const value = info.value as number;
		const headerContext = this.dataService.parentService.getHeaderContext();

		if (entity.MdcMaterialFk === value) {
			return this.validationUtils.createSuccessObject();
		}

		entity.IsInputTotal = false;

		// if user click clear button, no need to clear other data
		if (!value) {
			entity.MdcMaterialFk = undefined;
			entity.MaterialExternalCode = undefined;
			entity.Material2Uoms = undefined;

			this.dataService.readonlyProcessor.process(info.entity);
			this.dataService.setModified(entity);
			// Todo - dataService.loadMaterialSpecification(true); reset item text depends on item text container implementation(Wei)
			return this.validationUtils.createSuccessObject();
		}

		// Todo - priceConditionService.lockParentSelection(); not sure why need it

		// Regarding price list, after selecting a price version in material lookup dialog, material respective fields will be overrided by price list, so we just need to get price from material lookup item in the cache.
		// Todo - Need to confirm this after validation framework is ready
		const materialItem = await firstValueFrom(this.lookups.material.getItemByKey({ id: value }));
		const sameBasicPrcItem = await this.getItemWithSameMaterial(value);

		entity.MdcMaterialFk = value;
		this.copyFieldValuesFromMaterial(entity, materialItem);

		if (sameBasicPrcItem) {
			entity.SellUnit = sameBasicPrcItem.SellUnit;
			entity.MinQuantity = sameBasicPrcItem.MinQuantity;
			entity.LeadTime = sameBasicPrcItem.LeadTime;

			if (sameBasicPrcItem.BasUomFk) {
				entity.BasUomFk = sameBasicPrcItem.BasUomFk;
			}

			entity.MaterialStockFk = sameBasicPrcItem.MaterialStockFk;
			entity.AlternativeUomFk = sameBasicPrcItem.MaterialStock2UomFk || sameBasicPrcItem.BasUomFk;
			// fixed issue:106771
			const factorPriceUnit = sameBasicPrcItem.FactorPriceUnit ? sameBasicPrcItem.FactorPriceUnit : 1;
			entity.FactorPriceUnit = this.round(this.roundingType.FactorPriceUnit, factorPriceUnit);
			entity.PriceUnit = this.round(this.roundingType.PriceUnit, sameBasicPrcItem.PriceUnit);
			entity.BasUomPriceUnitFk = sameBasicPrcItem.BasUomPriceUnitFk;
		}

		// #105079 - Do Not Set Express Lead Time via Material Look Up Dialog in Procurement
		entity.LeadTimeExtra = 0;
		// Todo - comment following code because it will be handled in property changed, need to confirm, will be removed if working fine
		// entity.TotalLeadTime = this.calculateTotalLeadTime(entity);

		if (headerContext.paymentTermFiFk) {
			entity.BasPaymentTermFiFk = headerContext.paymentTermFiFk;
		}
		if (headerContext.paymentTermPaFk) {
			entity.BasPaymentTermPaFk = headerContext.paymentTermPaFk;
		}
		if (headerContext.incotermFk) {
			entity.PrcIncotermFk = headerContext.incotermFk;
		}

		this.dataService.setModified(entity);
		this.dataService.dataProcessor.processSpecification(entity);
		this.dataService.readonlyProcessor.process(info.entity);
		this.setCo2ProjectTotalNCo2SourceTotal(entity);

		await this.executeFieldValidation(new ValidationInfo(info.entity, entity.BasUomFk, 'BasUomFk'));
		await this.executeFieldValidation(new ValidationInfo(info.entity, entity.PrcStructureFk ?? undefined, 'PrcStructureFk'));

		// Todo - dataService.loadMaterialSpecification(true); reset item text depends on item text container implementation(Wei)

		if (sameBasicPrcItem) {
			await this.dataService.modifyPriceConditionFk(entity, sameBasicPrcItem.PrcPriceConditionFk);
		} else {
			await this.dataService.modifyPriceConditionFk(entity, materialItem.PrcPriceconditionFk, materialItem.MaterialPriceListFk);
		}

		await this.copyCertificatesFromOtherModule(entity, headerContext.prcHeaderFk, entity.MdcMaterialFk);

		return this.validationUtils.createSuccessObject();
	}

	protected copyFieldValuesFromMaterial(entity: T, materialItem: IMaterialSearchEntity) {
		entity.MaterialExternalCode = materialItem.ExternalCode;
		entity.Description1 = materialItem.DescriptionInfo.Translated || materialItem.DescriptionInfo.Description;
		entity.Description2 = materialItem.DescriptionInfo2.Translated || materialItem.DescriptionInfo2.Description;
		entity.PriceUnit = this.round(this.roundingType.PriceUnit, materialItem.PriceUnit);
		entity.BasUomFk = materialItem.BasUomFk;
		entity.BasUomPriceUnitFk = materialItem.BasUomPriceUnitFk;
		const factorPriceUnit = materialItem.FactorPriceUnit ? materialItem.FactorPriceUnit : 1;
		entity.FactorPriceUnit = this.round(this.roundingType.FactorPriceUnit, factorPriceUnit);
		entity.PrcStructureFk = materialItem.PrcStructureFk;
		entity.Material2Uoms = materialItem.Material2Uoms;
		entity.Userdefined1 = materialItem.UserDefined1;
		entity.Userdefined2 = materialItem.UserDefined2;
		entity.Userdefined3 = materialItem.UserDefined3;
		entity.Userdefined4 = materialItem.UserDefined4;
		entity.Userdefined5 = materialItem.UserDefined5;
		entity.MaterialStockFk = materialItem.MaterialStockFk;
		entity.AlternativeUomFk = materialItem.MaterialStock2UomFk || materialItem.BasUomFk;
		entity.AlternativeQuantity = this.convertQuantity(entity, entity.AlternativeUomFk, entity.Quantity); // entity.AlternativeQuantity
		entity.Co2Project = materialItem.Co2Project;
		entity.Co2Source = materialItem.Co2Source;
		entity.SellUnit = materialItem.SellUnit;
		entity.MinQuantity = materialItem.MinQuantity;
		entity.LeadTime = materialItem.LeadTime;
		entity.PrcPriceConditionFk = materialItem.PrcPriceconditionFk;
		entity.Specification = materialItem.SpecificationInfo.Translated || materialItem.SpecificationInfo.Description;
	}

	protected calculateTotalLeadTime(entity: T) {
		return entity.LeadTime + entity.SafetyLeadTime + entity.LeadTimeExtra + entity.BufferLeadTime;
	}

	protected async copyCertificatesFromOtherModule(entity: T, prcHeaderFk: number, materialFk: number) {
		// Todo - depends on certificates container
	}

	protected async validateMdcControllingUnitFk(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value as number;
		const headerContext = this.dataService.parentService.getHeaderContext();

		entity.MdcControllingunitFk = value;
		this.dataService.readonlyProcessor.process(entity);

		if (value && entity.MdcControllingunitFk !== value && headerContext.projectFk) {
			const hasError = await this.http.get('controlling/structure/validationControllingUnit', {
				params: {
					ControllingUnitFk: value,
					ProjectFk: headerContext.projectFk,
				},
			});

			if (hasError) {
				return this.validationUtils.createErrorObject({
					key: 'basics.common.error.controllingUnitError',
				});
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	protected validateBasItemType85Fk(info: ValidationInfo<T>) {
		this.dataService.readonlyProcessor.process(info.entity);
		return this.validationUtils.createSuccessObject();
	}

	// Todo special validation for bulk edit, but sure why but there are some of these special validation

	protected async validatePrjChangeFk(info: ValidationInfo<T>) {
		const value = info.value as number;
		const proxy = this.entityProxy.apply(info.entity);

		proxy.PrjChangeFk = value;

		if (value) {
			const projectChangeEntity = await this.lookups.projectChange.getItemByKeyAsync({id: value});
			proxy.PrjChangeStatusFk = projectChangeEntity?.ChangeStatusFk;
		} else {
			proxy.PrjChangeStatusFk = null;
		}

		return this.validationUtils.createSuccessObject();
	}

	protected validateSpecification(info: ValidationInfo<T>) {
		this.entityProxy.apply(info.entity).Specification = info.value as string;
		return this.validationUtils.createSuccessObject();
	}

	protected async validatePlantFk(info: ValidationInfo<T>) {
		// According to angularjs logic, only contract module needs it, will be overrided in the contract module
		return this.validationUtils.createSuccessObject();
	}

	protected async validateTotalGross(info: ValidationInfo<T>) {
		// only contract module needs it, will be overrided in the contract module
		return this.validationUtils.createSuccessObject();
	}

	protected async validateTotalGrossOc(info: ValidationInfo<T>) {
		// only contract module needs it, will be overrided in the contract module
		return this.validationUtils.createSuccessObject();
	}

	protected async validateFactorPriceUnit(info: ValidationInfo<T>) {
		const result = await this.validateFactorOrPriceUnit(info, {
			key: 'basics.common.procurementDialog.FactorZeroDescription',
			params: { Itemno: `#${info.entity.Itemno}` },
		});
		const value = info.value as number;
		this.calcQuantityConverted(info.entity, value, info.entity.Quantity);
		return result;
	}

	protected async validatePriceUnit(info: ValidationInfo<T>) {
		return this.validateFactorOrPriceUnit(info, {
			key: 'basics.common.procurementDialog.PriceUnitZeroDescription',
			params: { Itemno: `#${info.entity.Itemno}` },
		});
	}

	protected async validateFactorOrPriceUnit(info: ValidationInfo<T>, zeroError: Translatable) {
		const entity = info.entity;
		const value = info.value as number;
		if (!value || value === 0) {
			return this.validationUtils.createErrorObject(zeroError);
		} else {
			const field = info.field as 'FactorPriceUnit' | 'PriceUnit';
			entity[field] = value;
			await this.resetExtraAndCalculateTotal(entity);
			return this.validationUtils.createSuccessObject();
		}
	}

	protected async validateBudgetFixedUnit(info: ValidationInfo<T>) {
		// only contract and req module needs it, will be overrided in the contract and req module
		return this.validationUtils.createSuccessObject();
	}

	protected async validateBudgetFixedTotal(info: ValidationInfo<T>) {
		// only contract and req module needs it, will be overrided in the contract and req module
		return this.validationUtils.createSuccessObject();
	}

	protected validateBudgetPerUnit(info: ValidationInfo<T>) {
		//const entity = info.entity;
		const value = (info.value ?? 0) as number;
		info.entity.BudgetTotal = this.round(this.roundingType.BudgetTotal, bignumber(value).mul(info.entity.Quantity));
		return this.validationUtils.createSuccessObject();
	}

	protected validateBudgetTotal(info: ValidationInfo<T>) {
		const value = (info.value ?? 0) as number;
		info.entity.BudgetPerUnit = info.entity.Quantity === 0 ? 0 : this.round(this.roundingType.BudgetPerUnit, bignumber(value).div(info.entity.Quantity));
		return this.validationUtils.createSuccessObject();
	}

	protected async validateAlternativeQuantity(info: ValidationInfo<T>) {
		const value = info.value as number;
		const quantity = this.convertQuantity(info.entity, info.entity.AlternativeUomFk, undefined, value);
		await this.validateQuantity(new ValidationInfo(info.entity, quantity, 'Quantity'));
		info.entity.Quantity = quantity;
		info.entity.AlternativeQuantity = value;
		return this.validationUtils.createSuccessObject();
	}

	protected updateDiscountAfterPriceOrExtraChanged(entity: T) {
		const totalPriceOc = this.itemCalculationService.getTotalPriceOcNoDiscount(entity);
		const discountAbsoluteOcField = 'DiscountAbsoluteOc';
		entity.Discount = this.itemCalculationService.getDiscount(entity);
		if (entity.DiscountAbsoluteOc > totalPriceOc) {
			this.dataService.addInvalid(entity, {
				field: discountAbsoluteOcField,
				result: this.validationUtils.createErrorObject({
					key: 'procurement.common.discountAbsoluteRange',
					params: { discountAbsolute: discountAbsoluteOcField, value: totalPriceOc },
				}),
			});
		} else {
			this.removeDiscountNAbsoluteInvalid(entity);
		}
	}

	protected async validateDiscount(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = (info.value ?? 0) as number;
		const field = info.field as 'Discount';
		if (value < 0 || value > 100) {
			return this.validationUtils.createErrorObject({
				key: 'procurement.common.discountRangeError',
			});
		}
		const vatPercent = this.dataService.getVatPercent(entity);
		await this.afterDiscountNAbsoluteValidated(entity, value, field, vatPercent);
		return this.validationUtils.createSuccessObject();
	}

	protected async validateDiscountAbsoluteFields(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value as number;
		const field = info.field as DiscountAbsoluteField;
		const vatPercent = this.dataService.getVatPercent(entity);
		let priceAddPriceExtra = 0;
		switch (field) {
			case 'DiscountAbsolute': {
				priceAddPriceExtra = this.itemCalculationService.getTotalPriceNoDiscount(entity);
				break;
			}
			case 'DiscountAbsoluteOc': {
				priceAddPriceExtra = this.itemCalculationService.getTotalPriceOcNoDiscount(entity);
				break;
			}
			case 'DiscountAbsoluteGross': {
				const priceExtraGross = this.itemCalculationService.getAfterTaxValueByPreTaxValue(entity.PriceExtra, vatPercent);
				priceAddPriceExtra = this.round(this.roundingType.PriceGross, bignumber(entity.PriceGross).add(priceExtraGross));
				break;
			}
			case 'DiscountAbsoluteGrossOc': {
				const priceExtraGrossOc = this.itemCalculationService.getAfterTaxValueByPreTaxValue(entity.PriceExtraOc, vatPercent);
				priceAddPriceExtra = this.round(this.roundingType.PriceGrossOc, bignumber(entity.PriceGrossOc).add(priceExtraGrossOc));
				break;
			}
		}
		if (priceAddPriceExtra === 0 && value !== 0) {
			return this.validationUtils.createErrorObject({
				key: 'procurement.common.discountAbsoluteRange',
				params: { discountAbsolute: field, value: 0 },
			});
		} else {
			const discount = priceAddPriceExtra === 0 && value === 0 ? 0 : this.round(this.roundingType.NoType, bignumber(value).div(priceAddPriceExtra).mul(100));
			if (discount < 0 || discount > 100) {
				return this.validationUtils.createErrorObject({
					key: 'procurement.common.discountAbsoluteRange',
					params: { discountAbsolute: field, value: priceAddPriceExtra },
				});
			}
			await this.afterDiscountNAbsoluteValidated(entity, value, field, vatPercent);
			return this.validationUtils.createSuccessObject();
		}
	}

	protected async afterDiscountNAbsoluteValidated(entity: T, value: number, field: DiscountAndAbsoluteField, vatPercent: number) {
		entity[field] = value;
		const rate = this.dataService.getParentExchangeRate();
		this.itemCalculationService.updateDiscountNAbsolute(entity, value, field, vatPercent, rate);
		await this.dataService.updatePriceExtra(entity);
		this.dataService.calculateTotalPriceNTotal(entity, vatPercent);
		this.removeDiscountNAbsoluteInvalid(entity);
	}

	protected removeDiscountNAbsoluteInvalid(entity: T) {
		const result = this.validationUtils.createSuccessObject();
		const discountNDiscountAbsoluteFields: DiscountAndAbsoluteField[] = ['Discount', 'DiscountAbsolute', 'DiscountAbsoluteOc', 'DiscountAbsoluteGross', 'DiscountAbsoluteGrossOc'];
		discountNDiscountAbsoluteFields.forEach((f) => {
			this.dataService.removeInvalid(entity, { field: f, result: result });
		});
	}

	/**
	 * Empty function hook
	 * Specific modules may have extra quantity fields which need to be calculated.
	 * @param entity
	 * @param oldQuantity
	 * @param newQuantity
	 * @protected
	 */
	protected async calculateRelatedQuantityFields(entity: T, oldQuantity: number, newQuantity: number) {}

	protected async validateNotSubmitted(info: ValidationInfo<T>) {
		if (info.value === true) {
			const confirmResult = await this.validationUtils.asyncValidateAskBeforeValidating(info, 'procurement.common.askDeletePrice', 'procurement.common.askDeletePrice');
			if (confirmResult.apply) {
				info.entity.Price = 0;
				info.entity.IsInputTotal = false;

				await this.validatePriceCommonFun(new ValidationInfo(info.entity, info.entity.Price, 'Price'));
			}
			return confirmResult;
		}

		return this.validationUtils.createSuccessObject();
	}
}
