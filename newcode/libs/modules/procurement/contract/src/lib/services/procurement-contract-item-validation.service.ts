/*
 * Copyright(c) RIB Software GmbH
 */

import { defaultTo } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { IConItemEntity, IConHeaderEntity } from '../model/entities';
import { ConItemComplete } from '../model/con-item-complete.class';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractItemDataService } from './procurement-contract-item-data.service';
import {
	IPrcItemEntity, IPrcItemPriceConditionEntity,
	ProcurementCommonItemValidationService, TotalGrossField
} from '@libs/procurement/common';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { ProcurementContractPriceConditionDataService } from './procurement-contract-price-condition-data.service';
import { BasicsSharedCalculateOverGrossService, BasicsSharedConStatusLookupService } from '@libs/basics/shared';

export const PROCUREMENT_CONTRACT_ITEM_VALIDATION_TOKEN = new InjectionToken<ProcurementContractItemValidationService>('procurementContractItemValidationToken');

/**
 * Contract item validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractItemValidationService extends ProcurementCommonItemValidationService<IConItemEntity, ConItemComplete, IConHeaderEntity, ContractComplete> {
	private readonly conStatusLookupService = inject(BasicsSharedConStatusLookupService);
	private readonly contractService = inject(ProcurementContractHeaderDataService);
	private readonly priceConditionService = inject(ProcurementContractPriceConditionDataService);
	private readonly overGrossService = inject(BasicsSharedCalculateOverGrossService);

	/**
	 * The constructor
	 */
	public constructor(private readonly contractItemDataService: ProcurementContractItemDataService) {
		super(contractItemDataService);
	}

	protected override async validateItemno(info: ValidationInfo<IConItemEntity>): Promise<ValidationResult> {
		const contract = this.dataService.parentService.getSelectedEntity()!;
		const result = await super.validateItemno(info);

		if (result.valid && contract.ContractHeaderFk && info.value) {
			await this.overwriteItemNo(contract, info.entity, contract.ContractHeaderFk, info.value as number);
			this.dataService.readonlyProcessor.process(info.entity);
		}

		return result;
	}

	protected override async validatePlantFk(info: ValidationInfo<IConItemEntity>): Promise<ValidationResult> {
		// Todo - depends on equipment plant lookup which is a quite complicated one
		return super.validatePlantFk(info);
	}

	protected override async calculateRelatedQuantityFields(entity: IConItemEntity, oldQuantity: number, newQuantity: number) {
		const contract = this.dataService.parentService.getSelectedEntity()!;
		await this.calculateGrandOrCallOffQuantity(contract, entity, oldQuantity, newQuantity);
	}

	/**
	 * If user overwrites line no to a line no already used in the basis contract or a previous change order,
	 * then MDC_MATERIAL_FK, PRC_STRUCTURE_FK, DESCRIPTION1, DESCRIPTION2,
	 * BAS_UOM_FK must be taken from the previous line and set to read only
	 * @param contract
	 * @param entity
	 * @param conHeaderFk
	 * @param itemNo
	 * @private
	 */
	private async overwriteItemNo(contract: IConHeaderEntity, entity: IConItemEntity, conHeaderFk: number, itemNo: number) {
		const dto = await this.http.get<IPreviewPrcItemByItemNoDto>('procurement/common/prcitem/getpreviewprcItembyitemno', {
			params: {
				conHeaderFk: conHeaderFk,
				itemNo: itemNo,
				inContractMoudle: true
			}
		});

		const prcItem = dto.Main;
		const priceConditions = dto.PriceConditions;

		entity = this.dataService.entityProxy.apply(entity);

		entity.MdcMaterialFk = prcItem.MdcMaterialFk;
		entity.PrcStructureFk = prcItem.PrcStructureFk;
		entity.Description1 = prcItem.Description1;
		entity.Description2 = prcItem.Description2;
		// UOM,price,price factor,unit,price unit uom, price(OC),price condition container from basis contract(ALM 92196)
		entity.BasUomFk = entity.AlternativeUomFk = prcItem.BasUomFk;
		entity.MaterialStockFk = prcItem.MaterialStockFk;
		entity.FactorPriceUnit = prcItem.FactorPriceUnit;
		entity.PriceUnit = prcItem.PriceUnit;
		entity.BasUomPriceUnitFk = prcItem.BasUomPriceUnitFk;
		entity.PrcPriceConditionFk = prcItem.PrcPriceConditionFk;
		entity.PriceExtra = prcItem.PriceExtra;
		entity.PriceExtraOc = prcItem.PriceExtraOc;
		entity.MdcMaterialFk = prcItem.MdcMaterialFk;
		entity.MdcTaxCodeFk = prcItem.MdcTaxCodeFk;
		entity.Discount = prcItem.Discount;
		entity.DiscountAbsolute = prcItem.DiscountAbsolute;
		entity.DiscountAbsoluteOc = prcItem.DiscountAbsoluteOc;
		entity.DiscountAbsoluteGross = prcItem.DiscountAbsoluteGross;
		entity.DiscountAbsoluteGrossOc = prcItem.DiscountAbsoluteGrossOc;
		entity.PrcItemFk = prcItem.PrcItemFk;
		entity.DiscountSplit = 0;
		entity.DiscountSplitOc = 0;
		entity.Co2Project = prcItem.Co2Project;
		entity.Co2Source = prcItem.Co2Source;
		// Todo - could we use common rounding service?
		if (prcItem.Co2Project) {
			entity.Co2ProjectTotal = Number.parseFloat((prcItem.Co2Project * prcItem.Quantity).toFixed(3));
		}
		if (prcItem.Co2Source) {
			entity.Co2SourceTotal = Number.parseFloat((prcItem.Co2Source * prcItem.Quantity).toFixed(3));
		}
		entity.ContractGrandQuantity = prcItem.ContractGrandQuantity;
		entity.TotalCallOffQuantity = prcItem.TotalCallOffQuantity;

		await this.calculateGrandOrCallOffQuantity(contract, entity, 0, entity.Quantity);

		const isConsolidateChange = this.contractItemDataService.isConsolidateChange();
		if (isConsolidateChange) {
			entity.QuantityDelivered = prcItem.QuantityDelivered;
			entity.QuantityRemaining = this.dataService.calculateQuantityRemaining(entity.ContractGrandQuantity, entity.QuantityDelivered);
		}

		if (prcItem.PrjChangeFk) {
			entity.PrjChangeFk = prcItem.PrjChangeFk;
		}
		if (prcItem.PrjChangeStatusFk) {
			entity.PrjChangeStatusFk = prcItem.PrjChangeStatusFk;
		}

		this.calculatePrice(contract, entity, prcItem);
		this.setPriceIsChangeFields(entity, prcItem);
		await this.dataService.calculateTotal(entity);
		this.priceConditionService.handleReloadSucceeded(entity, priceConditions);

		const uomVR = await this.validateBasUomFk({
			entity: entity,
			value: entity.BasUomFk,
			field: 'BasUomFk'
		});

		this.validationUtils.applyValidationResult(this.dataService, {
			entity: entity,
			field: 'BasUomFk',
			result: uomVR
		});
	}

	private async calculateGrandOrCallOffQuantity(contract: IConHeaderEntity, entity: IConItemEntity, oldQuantity: number, newQuantity: number) {
		const itemStatus = await firstValueFrom(this.prcItemStatusLookupService.getItemByKey({id: entity.PrcItemstatusFk}));
		const conStatus = await firstValueFrom(this.conStatusLookupService.getItemByKey({id: contract.ConStatusFk}));

		if (conStatus && !conStatus.Iscanceled && !conStatus.Isvirtual && !itemStatus.IsCanceled) {
			if (!contract.ConHeaderFk || this.contractService.isChangeOrder(contract)) {
				entity.ContractGrandQuantity = defaultTo(entity.ContractGrandQuantity, 0) - oldQuantity + newQuantity;
			} else if (this.contractService.isCallOff(contract)) {
				entity.TotalCallOffQuantity = defaultTo(entity.TotalCallOffQuantity, 0) - oldQuantity + newQuantity;
			}
		}

		entity.RemainingQuantityForCallOff = defaultTo(entity.ContractGrandQuantity, 0) - defaultTo(entity.TotalCallOffQuantity, 0);
	}

	private calculatePrice(contract: IConHeaderEntity, entity: IConItemEntity, prcItem: IConItemEntity) {
		const vatPercent = this.dataService.getVatPercent(entity);
		const sameExchangeRate = contract.ExchangeRate === prcItem.MainExchangeRate;
		const sameVatPercent = vatPercent === prcItem.MainVatPercent;
		const sameRateAndVat = sameExchangeRate && sameVatPercent;

		if (this.dataService.isCalculateOverGross) {
			entity.PriceGrossOc = prcItem.PriceGrossOc;
			entity.PriceGross = sameExchangeRate ? prcItem.PriceGross : this.itemCalculationService.getPriceGrossByPriceGrossOc(entity, contract.ExchangeRate);
			entity.PriceOc = sameRateAndVat ? prcItem.PriceOc : this.itemCalculationService.getPriceOc(entity, vatPercent);
			entity.Price = sameRateAndVat ? prcItem.Price : this.itemCalculationService.getPrice(entity, vatPercent);
		} else {
			entity.PriceOc = prcItem.PriceOc;
			entity.Price = sameExchangeRate ? prcItem.Price : this.itemCalculationService.getPriceByPriceOc(entity, contract.ExchangeRate);
			entity.PriceGrossOc = sameRateAndVat ? prcItem.PriceGrossOc : this.itemCalculationService.getPriceGrossOc(entity, vatPercent);
			entity.PriceGross = sameRateAndVat ? prcItem.PriceGross : this.itemCalculationService.getPriceGross(entity, vatPercent);
		}
	}

	private setPriceIsChangeFields(entity: IConItemEntity, prcItem: IConItemEntity) {
		entity.IsChangePrice = false;
		entity.IsChangePriceOc = false;
		entity.IsChangePriceGross = false;
		entity.IsChangePriceGrossOc = false;
		if (prcItem.Price !== entity.Price) {
			entity.IsChangePrice = true;
		}
		if (prcItem.PriceOc !== entity.PriceOc) {
			entity.IsChangePriceOc = true;
		}
		if (prcItem.PriceGross !== entity.PriceGross) {
			entity.IsChangePriceGross = true;
		}
		if (prcItem.PriceGrossOc !== entity.PriceGrossOc) {
			entity.IsChangePriceGrossOc = true;
		}
	}

	protected override async validateTotalGrossOc(info: ValidationInfo<IConItemEntity>) {
		return await this.validateTotalGrossNTotalGrossOc(info);
	}

	protected override async validateTotalGross(info: ValidationInfo<IConItemEntity>) {
		return await this.validateTotalGrossNTotalGrossOc(info);
	}

	private async validateTotalGrossNTotalGrossOc(info: ValidationInfo<IConItemEntity>) {
		const entity = info.entity as IConItemEntity;

		if (!entity.Quantity || !this.overGrossService.isOverGross) {
			return {valid: true, apply: false};
		}

		const exchangeRate = this.dataService.getParentExchangeRate();
		const vatPercent = this.dataService.getVatPercent(entity);
		const value = (info.value ?? 0) as number;
		const field = info.field as TotalGrossField;

		entity.PrcPriceConditionFk = null;
		entity.PriceExtra = 0;
		entity.PriceExtraOc = 0;
		this.itemCalculationService.calculateAfterInputTotalGross(entity, value, field, vatPercent, exchangeRate);

		return this.validationUtils.createSuccessObject();
	}
}

interface IPreviewPrcItemByItemNoDto {
	Main: IPrcItemEntity;
	PriceConditions: IPrcItemPriceConditionEntity[]
}