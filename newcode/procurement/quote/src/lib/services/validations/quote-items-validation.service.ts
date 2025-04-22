/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable, InjectionToken } from '@angular/core';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { IQuoteItemEntity } from '../../model/entities/quote-item-entity.interface';
import { QuoteItemComplete } from '../../model/entities/quote-item-entity-complete.class';
import { ProcurementQuoteItemDataService } from '../procurement-quote-item-data.service';
import { IPrcItemEntity, IPrcItemPriceConditionEntity, ProcurementCommonItemValidationService } from '@libs/procurement/common';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IQuoteRequisitionEntity } from '../../model/entities/quote-requisition-entity.interface';
import { QuoteRequisitionEntityComplete } from '../../model/entities/quote-quisition-entity-complete.class';
import { ProcurementQuoteHeaderDataService } from '../quote-header-data.service';

export const PROCUREMENT_QUOTE_ITEM_VALIDATION_TOKEN = new InjectionToken<ProcurementQuoteItemValidationService>('procurementContractItemValidationToken');

/**
 * quote item validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteItemValidationService extends ProcurementCommonItemValidationService<IQuoteItemEntity, QuoteItemComplete, IQuoteRequisitionEntity, QuoteRequisitionEntityComplete> {
	private readonly quoteDataService = inject(ProcurementQuoteHeaderDataService);

	/**
	 * The constructor
	 */
	public constructor(private readonly quoteItemDataService: ProcurementQuoteItemDataService) {
		super(quoteItemDataService);
	}

	protected override async validateItemno(info: ValidationInfo<IQuoteItemEntity>): Promise<ValidationResult> {
		const quote = this.dataService.parentService.getSelectedEntity()!;
		const result = await super.validateItemno(info);

		if (result.valid && quote.PrcHeaderFk && info.value) {
			await this.overwriteItemNo(quote, info.entity, quote.PrcHeaderFk, info.value as number);
			this.dataService.readonlyProcessor.process(info.entity);
		}

		return result;
	}

	protected override async validatePlantFk(info: ValidationInfo<IQuoteItemEntity>): Promise<ValidationResult> {
		// Todo - depends on equipment plant lookup which is a quite complicated one
		return super.validatePlantFk(info);
	}

	/**
	 * If user overwrites line no to a line no already used in the basis contract or a previous change order,
	 * then MDC_MATERIAL_FK, PRC_STRUCTURE_FK, DESCRIPTION1, DESCRIPTION2,
	 * BAS_UOM_FK must be taken from the previous line and set to read only
	 * @param quote
	 * @param entity
	 * @param conHeaderFk
	 * @param itemNo
	 * @private
	 */
	private async overwriteItemNo(quoteRequisition: IQuoteRequisitionEntity, entity: IQuoteItemEntity, conHeaderFk: number, itemNo: number) {
		const quote = this.quoteDataService.getSelectedEntity()!;
		const dto = await this.http.get<IPreviewPrcItemByItemNoDto>('procurement/common/prcitem/getpreviewprcItembyitemno', {
			params: {
				conHeaderFk: conHeaderFk,
				itemNo: itemNo,
				inContractMoudle: true,
			},
		});

		const prcItem = dto.Main;
		//const priceConditions = dto.PriceConditions;

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

		if (prcItem.PrjChangeFk) {
			entity.PrjChangeFk = prcItem.PrjChangeFk;
		}
		if (prcItem.PrjChangeStatusFk) {
			entity.PrjChangeStatusFk = prcItem.PrjChangeStatusFk;
		}

		this.calculatePrice(quote, entity, prcItem);
		this.setPriceIsChangeFields(entity, prcItem);
		await this.dataService.calculateTotal(entity);
		// Todo - reload price condition container, will be handled in dev-13577.

		const uomVR = await this.validateBasUomFk({
			entity: entity,
			value: entity.BasUomFk,
			field: 'BasUomFk',
		});

		this.validationUtils.applyValidationResult(this.dataService, {
			entity: entity,
			field: 'BasUomFk',
			result: uomVR,
		});
	}

	private calculatePrice(quote: IQuoteHeaderEntity, entity: IQuoteItemEntity, prcItem: IQuoteItemEntity) {
		const vatPercent = this.dataService.getVatPercent(entity);
		const sameExchangeRate = quote.ExchangeRate === prcItem.MainExchangeRate;
		const sameVatPercent = vatPercent === prcItem.MainVatPercent;
		const sameRateAndVat = sameExchangeRate && sameVatPercent;

		if (this.dataService.isCalculateOverGross) {
			entity.PriceGrossOc = prcItem.PriceGrossOc;
			entity.PriceGross = sameExchangeRate ? prcItem.PriceGross : this.itemCalculationService.getPriceGrossByPriceGrossOc(entity, quote.ExchangeRate);
			entity.PriceOc = sameRateAndVat ? prcItem.PriceOc : this.itemCalculationService.getPriceOc(entity, vatPercent);
			entity.Price = sameRateAndVat ? prcItem.Price : this.itemCalculationService.getPrice(entity, vatPercent);
		} else {
			entity.PriceOc = prcItem.PriceOc;
			entity.Price = sameExchangeRate ? prcItem.Price : this.itemCalculationService.getPriceByPriceOc(entity, quote.ExchangeRate);
			entity.PriceGrossOc = sameRateAndVat ? prcItem.PriceGrossOc : this.itemCalculationService.getPriceGrossOc(entity, vatPercent);
			entity.PriceGross = sameRateAndVat ? prcItem.PriceGross : this.itemCalculationService.getPriceGross(entity, vatPercent);
		}
	}

	private setPriceIsChangeFields(entity: IQuoteItemEntity, prcItem: IQuoteItemEntity) {
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
}

interface IPreviewPrcItemByItemNoDto {
	Main: IPrcItemEntity;
	PriceConditions: IPrcItemPriceConditionEntity[];
}
