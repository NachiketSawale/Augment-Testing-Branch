/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ProcurementBaseValidationService } from '@libs/procurement/shared';
import { IInvPaymentEntity } from '../model';
import { ProcurementInvoicePaymentDataService } from './procurement-invoice-payment-data.service';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { Injectable } from '@angular/core';

/**
 * Procurement invoice payment validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoicePaymentValidationService extends ProcurementBaseValidationService<IInvPaymentEntity> {

	/**
	 *
	 * @param dataService
	 * param invoiceHeaderDataService
	 */
	protected constructor(
		protected dataService: ProcurementInvoicePaymentDataService,
		protected invoiceHeaderDataService: ProcurementInvoiceHeaderDataService,
	) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IInvPaymentEntity> {
		return {
			TaxCodeFk: this.validateTaxCodeFk,
			Amount_Net: this.validateAmount_Net,
			Amount: this.validateAmount,
			DiscountAmountNet: this.validateDiscountAmountNet,
			DiscountAmount: this.validateDiscountAmount,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IInvPaymentEntity> {
		return this.dataService;
	}

	private validateTaxCodeFk(info: ValidationInfo<IInvPaymentEntity>) {
		const vatPercent = this.getVatPercent(info.entity, info.value as number);
		info.entity.AmountVat = (info.entity.Amount_Net ?? 0) * (vatPercent / 100);
		info.entity.Amount = (info.entity.Amount_Net ?? 0) + (info.entity.AmountVat ?? 0);
		info.entity.DiscountAmountVat = (info.entity.DiscountAmountNet ?? 0) * (vatPercent / 100);
		info.entity.DiscountAmount = (info.entity.DiscountAmountNet ?? 0) + (info.entity.DiscountAmountVat ?? 0);

		this.dataService.updateInvoiceHeaderWithPaymentChanged();
		return this.validationUtils.createSuccessObject();
	}

	private validateAmount_Net(info: ValidationInfo<IInvPaymentEntity>) {
		const value = info.value as number;
		const vatPercent = this.getVatPercent(info.entity);
		info.entity.AmountVat = value * (vatPercent / 100);
		info.entity.Amount = value * (1 + vatPercent / 100);

		this.dataService.updateInvoiceHeaderWithPaymentChanged();
		return this.validationUtils.createSuccessObject();
	}

	private validateAmount(info: ValidationInfo<IInvPaymentEntity>) {
		const value = info.value as number;
		const vatPercent = this.getVatPercent(info.entity);
		info.entity.Amount_Net = value / (1 + vatPercent / 100);
		info.entity.AmountVat = value - (info.entity.Amount_Net ?? 0);

		this.dataService.updateInvoiceHeaderWithPaymentChanged();
		return this.validationUtils.createSuccessObject();
	}

	private validateDiscountAmountNet(info: ValidationInfo<IInvPaymentEntity>) {
		const value = info.value as number;
		const vatPercent = this.getVatPercent(info.entity);
		info.entity.DiscountAmountVat = value * (vatPercent / 100);
		info.entity.DiscountAmount = value * (1 + vatPercent / 100);

		this.dataService.updateInvoiceHeaderWithPaymentChanged();
		return this.validationUtils.createSuccessObject();
	}

	private validateDiscountAmount(info: ValidationInfo<IInvPaymentEntity>) {
		const value = info.value as number;
		const vatPercent = this.getVatPercent(info.entity);
		info.entity.DiscountAmountNet = value / (1 + vatPercent / 100);
		info.entity.DiscountAmountVat = value - (info.entity.DiscountAmountNet ?? 0);

		this.dataService.updateInvoiceHeaderWithPaymentChanged();
		return this.validationUtils.createSuccessObject();
	}

	private getVatPercent(entity: IInvPaymentEntity, taxCodeFk?: number) {
		if (!taxCodeFk && entity.TaxCodeFk) {
			taxCodeFk = entity.TaxCodeFk;
		}
		return this.invoiceHeaderDataService.getVatPercentWithTaxCodeMatrix(taxCodeFk);
	}
}
