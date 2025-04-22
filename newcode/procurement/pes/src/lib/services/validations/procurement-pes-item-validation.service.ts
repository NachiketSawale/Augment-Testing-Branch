/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult, Validator } from '@libs/platform/data-access';
import { IPesItemEntity } from '../../model/entities';
import { ProcurementPesItemDataService } from '../procurement-pes-item-data.service';
import { Injectable, inject } from '@angular/core';
import { isEmptyOrUninitializedFk, PrcStockTransactionType, PrcStockTransactionTypeLookupService, ProcurementPackageLookupService, ProcurementShareProjectChangeLookupService, ProjectStockLookupService } from '@libs/procurement/shared';
import { BasicsSharedCalculateOverGrossService, BasicsSharedDataValidationService, BasicsSharedProcurementStructureLookupService } from '@libs/basics/shared';
import { PlatformHttpService, PlatformTranslateService, PropertyType } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import { bignumber } from 'mathjs';
import { ProcurementPesItemCalculationService } from '../procurement-pes-item-calculation.service';
import { PriceField, TotalGrossField } from '@libs/procurement/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPesItemValidationService extends BaseValidationService<IPesItemEntity> {
	private readonly dataService = inject(ProcurementPesItemDataService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly httpService = inject(PlatformHttpService);
	private readonly prcPackageLookupService = inject(ProcurementPackageLookupService);
	private readonly prcStructureLookupService = inject(BasicsSharedProcurementStructureLookupService);
	private readonly prcStockTransactionTypeLookupService = inject(PrcStockTransactionTypeLookupService);
	private readonly prjStockLookupService = inject(ProjectStockLookupService);
	private readonly prjChangeLookupService = inject(ProcurementShareProjectChangeLookupService);
	private readonly calculationService = inject(ProcurementPesItemCalculationService);
	private readonly overGrossService = inject(BasicsSharedCalculateOverGrossService);
	private readonly roundingType = this.calculationService.roundingType;
	private readonly round = this.calculationService.round.bind(this.calculationService);

	public constructor() {
		super();

		this.dataService.entityProxy.propertyChanged$.subscribe(async (e) => {
			const entity = e.entity;
			const field = e.field as string;
			const info = new ValidationInfo<IPesItemEntity>(entity, e.newValue as PropertyType | undefined, field);
			const validators = this.generateValidationFunctions();
			const validator = validators[field];

			if (['ControllingUnitFk', 'PrcStructureFk', 'UomFk', 'AlternativeUomFk', 'PrcStockTransactionTypeFk'].some((p) => p === e.field) && validator) {
				await this.validationUtils.executeValidatorAsync(this, this.dataService, validator as Validator<IPesItemEntity>, info);
			}
		});
	}

	protected generateValidationFunctions(): IValidationFunctions<IPesItemEntity> {
		return {
			UomFk: this.validateUomFk,
			AlternativeUomFk: this.validateAlternativeUomFk,
			ConHeaderFk: this.validateConHeaderFk,
			PrcItemFk: this.validatePrcItemFk,
			ItemNo: this.validateItemNo,
			PrcPackageFk: this.validatePrcPackageFk,
			PrcStructureFk: this.validatePrcStructureFk,
			ControllingUnitFk: this.validateControllingUnitFk,
			IsAssetManagement: this.validateIsAssetManagement,
			PrjStockFk: this.validatePrjStockFk,
			PrjStockLocationFk: this.validatePrjStockLocationFk,
			LotNo: this.validateLotNo,
			ExpirationDate: this.validateExpirationDate,
			PrcStockTransactionFk: this.validatePrcStockTransactionFk,
			PrcStockTransactionTypeFk: this.validatePrcStockTransactionTypeFk,
			MdcMaterialFk: this.validateMdcMaterialFk,
			MdcTaxCodeFk: this.validateMdcTaxCodeFk,
			PrjChangeFk: this.validatePrjChangeFk,
			PercentageQuantity: this.validatePercentageQuantity,
			Quantity: this.validateQuantity,
			AlternativeQuantity: this.validateAlternativeQuantity,
			Price: this.validatePriceFields,
			PriceOc: this.validatePriceFields,
			PriceGross: this.validatePriceFields,
			PriceGrossOc: this.validatePriceFields,
			TotalGross: this.validateTotalGrossNTotalGrossOc,
			TotalGrossOc: this.validateTotalGrossNTotalGrossOc
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPesItemEntity> {
		return this.dataService;
	}

	private async validateUomFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;

		if (isEmptyOrUninitializedFk(info.value)) {
			return this.createEmptyError('cloud.common.entityUoM');
		}

		// When BAS_UOM_FK is changed and MdcMaterialFk is null, AlternativeUomFk is updated to the same value
		if (!entity.MdcMaterialFk) {
			entity.AlternativeUomFk = info.value as number;
		}

		await this.dataService.readonlyProcessor.updateEntityReadonly(entity);

		return this.validationUtils.createSuccessObject();
	}

	private validateAlternativeUomFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;

		entity.AlternativeQuantity = this.dataService.convertQuantityToAlternativeQ(entity, entity.UomFk, entity.Quantity);

		return this.validationUtils.createSuccessObject();
	}

	private async validateConHeaderFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const newConHeaderFk = info.value as number;
		const pesHeader = this.dataService.currentPesHeader;
		const proxy = this.dataService.entityProxy.apply(entity);

		if (newConHeaderFk) {
			await this.dataService.updateHeaderContract(entity, newConHeaderFk);
			const conHeaderLookupEntity = await firstValueFrom(this.dataService.conHeaderLookupService.getItemByKey({id: newConHeaderFk}));
			proxy.ProjectFk = conHeaderLookupEntity.ProjectFk;
			proxy.PrcPackageFk = conHeaderLookupEntity.PrcPackageFk;
		}

		this.dataService.updateQuantityDeliveredNRemaining([entity]);
		await this.dataService.resetPesItem(pesHeader, entity);
		await this.dataService.readonlyProcessor.updateEntityReadonly(entity);

		return this.validationUtils.createSuccessObject();
	}

	private async validatePrcItemFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value as number;
		const pesHeader = this.dataService.currentPesHeader;

		if (!value) {
			entity.PrcItemFk = null;
			entity.MdcMaterialFk = null;
			entity.Co2Project = null;
			entity.Co2ProjectTotal = null;
			entity.Co2Source = null;
			entity.Co2SourceTotal = null;
			await this.dataService.resetPesItem(pesHeader, entity);
		} else {
			await this.dataService.setPesItemByPrcItemFk(pesHeader, entity, value);
		}

		await this.dataService.readonlyProcessor.updateEntityReadonly(entity);

		return this.validationUtils.createSuccessObject();
	}

	private async validateItemNo(info: ValidationInfo<IPesItemEntity>) {
		return await this.validationUtils.checkSynAndAsyncUnique(info, this.dataService.getList(), 'procurement/pes/item/isitemnounique', {
			additionalHttpParams: {
				pesHeaderFk: info.entity.PesHeaderFk,
			},
		});
	}

	private async validatePrcPackageFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value as number;
		const proxy = this.dataService.entityProxy.apply(entity);

		if (value) {
			const prcPackage = await firstValueFrom(this.prcPackageLookupService.getItemByKey({id: value}));
			proxy.ProjectFk = prcPackage.ProjectFk;
			proxy.PrcStructureFk = prcPackage.StructureFk;
		}

		return this.validationUtils.createSuccessObject();
	}

	private async validateControllingUnitFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value as number;

		const result = this.validationUtils.isMandatory(info);

		if (!result.valid) {
			return result;
		}

		const invalid = await this.httpService.get<boolean>('controlling/structure/validationControllingUnit', {
			params: {
				ControllingUnitFk: value,
				ProjectFk: entity.ProjectFk!,
			},
		});

		if (invalid) {
			return this.validationUtils.createErrorObject({
				key: 'basics.common.error.controllingUnitError',
			});
		}

		await this.dataService.readonlyProcessor.updateEntityReadonly(entity);

		return this.validationUtils.createSuccessObject();
	}

	private async validatePrcStructureFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value as number;
		const proxy = this.dataService.entityProxy.apply(entity);

		const result = this.validationUtils.isMandatory(info);

		if (!result.valid) {
			return result;
		}

		entity.PrcStructureFk = value;

		if (!entity.MdcTaxCodeFk) {
			const prcStructureLookupEntity = await firstValueFrom(this.prcStructureLookupService.getItemByKey({id: value}));
			if (prcStructureLookupEntity?.TaxCodeFk) {
				proxy.MdcTaxCodeFk = prcStructureLookupEntity.TaxCodeFk;
				await this.dataService.calculateTotalPriceNTotal(entity);
			}
		}

		proxy.MdcSalesTaxGroupFk = await this.prcStructureLookupService.getMdcSalesTaxGroupFk(value);

		await this.dataService.readonlyProcessor.updateEntityReadonly(entity);

		return this.validationUtils.createSuccessObject();
	}

	private async validateIsAssetManagement(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value as boolean;
		const proxy = this.dataService.entityProxy.apply(entity);

		if (!value) {
			proxy.FixedAssetFk = null;
		}

		this.dataService.readonlyProcessor.process(entity);
		return this.validationUtils.createSuccessObject();
	}

	private async validatePrjStockFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value as number;
		const proxy = this.dataService.entityProxy.apply(entity);

		if (value) {
			const result = await this.dataService.getMaterialToPrjStock(entity, {
				projectStockId: value,
			});

			proxy.PrjStockLocationFk = result.PrjStockLocationFk;

			if (result.IsInStock2Material) {
				proxy.PrcStockTransactionTypeFk = (await this.prcStockTransactionTypeLookupService.getDefault())?.Id;
			}

			const prjStockLookupEntity = await firstValueFrom(this.prjStockLookupService.getItemByKey({id: value}));

			if (prjStockLookupEntity?.IsProvisionAllowed) {
				proxy.ProvisionPercent = result.ProvisionPercent;
				proxy.ProvisonTotal = result.ProvisonTotal;
			} else {
				proxy.ProvisionPercent = 0;
				proxy.ProvisonTotal = 0;
			}
		}

		await this.validationUtils.executeValidatorAsync(this, this.dataService, this.validateLotNo, new ValidationInfo<IPesItemEntity>(entity, entity.LotNo!, 'LotNo'));
		await this.validationUtils.executeValidatorAsync(this, this.dataService, this.validateExpirationDate, new ValidationInfo<IPesItemEntity>(entity, entity.ExpirationDate!, 'ExpirationDate'));
		await this.validationUtils.executeValidatorAsync(this, this.dataService, this.validatePrjStockLocationFk, new ValidationInfo<IPesItemEntity>(entity, entity.PrjStockLocationFk!, 'PrjStockLocationFk'));

		await this.dataService.readonlyProcessor.updateEntityReadonly(entity);

		return this.validationUtils.createSuccessObject();
	}

	private async validateLotNo(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value as number;

		if (entity.PrjStockFk && !value) {
			const result = await this.dataService.getMaterialToPrjStock(entity, {
				projectStockId: entity.PrjStockFk,
			});
			if (result.IsLotManagement) {
				return this.createEmptyError('procurement.common.entityLotNo');
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private async validatePrjStockLocationFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value as number;

		if (entity.PrjStockFk && isEmptyOrUninitializedFk(value)) {
			const prjStockLookupEntity = await firstValueFrom(this.prjStockLookupService.getItemByKey({id: entity.PrjStockFk}));
			if (prjStockLookupEntity.IsLocationMandatory) {
				return this.createEmptyError('procurement.common.entityPrjStockLocation');
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private async validateExpirationDate(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value;

		if (entity.PrjStockFk && !value) {
			const result = await this.dataService.getMaterialToPrjStock(entity, {
				projectStockId: entity.PrjStockFk,
			});
			if (result.IsLotManagement) {
				return this.createEmptyError('procurement.common.ExpirationDate');
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private async validatePrcStockTransactionFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value as number;

		if (isEmptyOrUninitializedFk(value)) {
			if (entity.PrcStockTransactionTypeFk === PrcStockTransactionType.IncidentalAcquisitionExpense) {
				return this.createEmptyError('procurement.common.entityPrcStockTransaction');
			}

			const type = await firstValueFrom(this.prcStockTransactionTypeLookupService.getItemByKey({id: value}));

			if (type.IsDelta) {
				return this.createEmptyError('procurement.common.entityPrcStockTransaction');
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private async validatePrcStockTransactionTypeFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value as number;
		const proxy = this.dataService.entityProxy.apply(entity);

		if (value === PrcStockTransactionType.MaterialReceipt) {
			proxy.PrcStockTransactionFk = null;
		}

		await this.validationUtils.executeValidatorAsync(this, this.dataService, this.validatePrcStockTransactionFk, new ValidationInfo<IPesItemEntity>(entity, entity.PrcStockTransactionFk!, 'PrcStockTransactionFk'));

		await this.dataService.readonlyProcessor.updateEntityReadonly(entity);

		return this.validationUtils.createSuccessObject();
	}

	private createEmptyError(fieldName: string) {
		const entityPrcStockTransaction = this.translateService.instant(fieldName);
		return this.validationUtils.createErrorObject({
			key: 'cloud.common.emptyOrNullValueErrorMessage',
			params: {fieldName: entityPrcStockTransaction},
		});
	}

	private async validateMdcMaterialFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value as number;

		if (entity.PrcItemFk) {
			return this.validationUtils.createSuccessObject();
		}

		if (!value) {
			await this.dataService.resetPesItemFromMaterial(this.dataService.currentPesHeader, entity);
		} else {
			await this.dataService.setPesItemFromMaterialFk(this.dataService.currentPesHeader, entity, value);
		}

		return this.validationUtils.createSuccessObject();
	}

	private async validateMdcTaxCodeFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value as number;

		entity.MdcTaxCodeFk = value;

		await this.dataService.calculateTotalPriceNTotal(entity);

		return this.validationUtils.createSuccessObject();
	}

	private async validatePrjChangeFk(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const value = info.value as number;

		entity.PrjChangeFk = value;

		if (value) {
			const prjChange = await firstValueFrom(this.prjChangeLookupService.getItemByKey({id: value}));
			entity.PrjChangeStatusFk = prjChange.ChangeStatusFk;
		} else {
			entity.PrjChangeStatusFk = null;
		}

		return this.validationUtils.createSuccessObject();
	}


	private async validateQuantity(info: ValidationInfo<IPesItemEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const oldQuantity = entity.Quantity;
		const newQuantity = (info.value ?? 0) as number;
		entity.Quantity = newQuantity;

		this.updateDeliveredNRemainingQuantityOfList(entity, oldQuantity, newQuantity);
		this.dataService.calculateQuantityConverted(entity);
		this.updateDeliveredNRemainingQuantityConvertedOfList(entity);
		this.updateDiscountSplit(entity, newQuantity);

		this.dataService.calculateInvoiceQuantity(entity);
		entity.PercentageQuantity = this.getPercentageQuantityByQuantity(entity, newQuantity);
		entity.BudgetTotal = this.getBudgetTotalByQuantity(entity, newQuantity);
		entity.AlternativeQuantity = this.dataService.convertQuantityToAlternativeQ(entity, entity.UomFk, newQuantity);
		entity.ProvisonTotal = await this.getProvisonTotalByQuantity(entity, newQuantity);

		await this.resetExtraAndCalculateTotal(entity);

		return this.validationUtils.createSuccessObject();
	}

	private async validatePercentageQuantity(info: ValidationInfo<IPesItemEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const newPercentageQuantity = (info.value ?? 0) as number;
		const newQuantity = (entity.QuantityContracted && newPercentageQuantity) ? bignumber(newPercentageQuantity).mul(entity.QuantityContracted).div(100).toNumber() : 0;

		await this.validateQuantity({entity: entity, value: newQuantity, field: 'Quantity'});

		return this.validationUtils.createSuccessObject();
	}

	private async validateAlternativeQuantity(info: ValidationInfo<IPesItemEntity>) {
		const entity = info.entity;
		const newAlternativeQuantity = (info.value ?? 0) as number;
		const newQuantity = this.dataService.convertAlternativeQToQuantity(entity, entity.UomFk, newAlternativeQuantity);

		await this.validateQuantity({entity: entity, value: newQuantity, field: 'Quantity'});

		return this.validationUtils.createSuccessObject();
	}

	/**
	 * Validate Price/PriceOc/PriceGross/PriceGrossOc
	 * @param info
	 * @protected
	 */
	private async validatePriceFields(info: ValidationInfo<IPesItemEntity>): Promise<ValidationResult> {
		const entity = info.entity as IPesItemEntity;
		const model = info.field as PriceField;
		const value = (info.value ?? 0) as number;
		entity[model] = value;

		const rate = this.dataService.getParentExchangeRate();
		const vatPercent = this.dataService.getVatPercent(entity);
		this.calculationService.update4PriceFields(entity, value, model, vatPercent, rate);
		await this.resetExtraAndCalculateTotal(entity, true);

		return this.validationUtils.createSuccessObject();
	}

	private async validateTotalGrossNTotalGrossOc(info: ValidationInfo<IPesItemEntity>): Promise<ValidationResult> {
		const entity = info.entity as IPesItemEntity;

		if (!entity.Quantity || !this.overGrossService.isOverGross) {
			return {valid: true, apply: false};
		}

		const exchangeRate = this.dataService.getParentExchangeRate();
		const vatPercent = this.dataService.getVatPercent(entity);
		const priceUnitAndFactor = await this.dataService.getFactorAndPriceUnit(entity);
		const oldTotal = entity.Total;
		const oldTotalOc = entity.TotalOc;
		const value = (info.value ?? 0) as number;
		const field = info.field as TotalGrossField;

		entity.PrcPriceConditionFk = null;
		entity.PriceExtra = 0;
		entity.PriceExtraOc = 0;
		this.calculationService.calculateAfterInputTotalGross(entity, value, field, vatPercent, exchangeRate, priceUnitAndFactor.PriceUnit, priceUnitAndFactor.FactorPriceUnit);
		this.dataService.calculateRelatedFieldsAfterUpdateTotal(entity, oldTotal, oldTotalOc, vatPercent);

		return this.validationUtils.createSuccessObject();
	}

	/**
	 * Update PriceExtra/PriceExtraOc and update other fields related to PriceExtra/PriceExtraOc
	 * @param entity
	 * @param isUpdatePrice
	 */
	public async resetExtraAndCalculateTotal(entity: IPesItemEntity, isUpdatePrice: boolean = false) {
		const isUpdatePriceExtra = await this.dataService.updatePriceExtra(entity);
		if (isUpdatePriceExtra || isUpdatePrice) {
			await this.dataService.calculateTotalPriceNTotal(entity);
		} else {
			await this.dataService.calculateTotal(entity);
		}
	}

	private getPercentageQuantityByQuantity(entity: IPesItemEntity, quantity: number): number {
		return entity.QuantityContracted !== 0 ?
			bignumber(quantity).div(entity.QuantityContracted).toNumber() :
			0;
	}

	private updateDiscountSplit(entity: IPesItemEntity, quantity: number) {
		if (quantity && entity.PrcItemQuantity !== 0) {
			entity.DiscountSplit = this.round(this.roundingType.DiscountSplit, bignumber(quantity).div(entity.PrcItemQuantity).mul(entity.PrcItemDiscountSplit));
			entity.DiscountSplitOc = this.round(this.roundingType.DiscountSplitOc, bignumber(quantity).div(entity.PrcItemQuantity).mul(entity.PrcItemDiscountSplitOc));
		} else {
			entity.DiscountSplit = 0;
			entity.DiscountSplitOc = 0;
		}
	}

	private async getProvisonTotalByQuantity(entity: IPesItemEntity, quantity: number): Promise<number> {
		if (!entity.PrjStockFk) {
			return 0;
		}

		const result = await this.dataService.getMaterialToPrjStock(entity, {
			prcItemId: entity.PrcItemFk,
			projectStockId: entity.PrjStockFk,
			quantity: quantity,
			materialId: entity.MdcMaterialFk
		});
		return this.round(this.roundingType.ProvisonTotal, result.ProvisonTotal);

	}

	private getBudgetTotalByQuantity(entity: IPesItemEntity, quantity: number) {
		if (!entity.BudgetFixedTotal && entity.BudgetFixedUnit) {
			return this.round(this.roundingType.BudgetTotal, bignumber(quantity).mul(entity.BudgetPerUnit));
		}
		return entity.BudgetTotal;
	}

	private updateDeliveredNRemainingQuantityOfList(entity: IPesItemEntity, oldQuantity: number, newQuantity: number) {
		const diff = bignumber(newQuantity).sub(oldQuantity).toNumber();
		if (diff === 0) {
			return;
		}

		if (entity.PrcItemFk) {
			this.dataService.getList().forEach(item => {
				if (item.PrcItemFk === entity.PrcItemFk) {
					this.updateItemDeliveredAndRemainingQuantity(item, diff);
					this.dataService.setModified(item);
				}
			});
		} else {
			this.updateItemDeliveredAndRemainingQuantity(entity, diff);
		}

	}

	private updateItemDeliveredAndRemainingQuantity(item: IPesItemEntity, diff: number) {
		if (!item || !diff) {
			return;
		}
		item.QuantityDelivered += this.round(this.roundingType.QuantityDelivered, diff);
		item.QuantityRemaining -= this.round(this.roundingType.QuantityRemaining, diff);
	}

	private updateDeliveredNRemainingQuantityConvertedOfList(entity: IPesItemEntity) {
		if (!entity?.PrcItemFk) {
			return;
		}

		this.dataService.getList().forEach((item) => {
			if (item.PrcItemFk === entity.PrcItemFk) {
				item.QuantityRemainingConverted = entity.QuantityRemainingConverted;
				item.QuantityDeliveredConverted = entity.QuantityDeliveredConverted;
				this.dataService.setModified(item);
			}
		});
	}

	// todo - validations for bulk edit, not sure if it is still needed https://rib-40.atlassian.net/browse/DEV-21825
}
