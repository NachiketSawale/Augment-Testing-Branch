/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';

import { firstValueFrom } from 'rxjs';
import { BasicsSharedDataValidationService, BasicsSharedInvRejectionReasonLookupService } from '@libs/basics/shared';
import { IInvRejectEntity } from '../../model';
import { ProcurementInvoiceRejectionDataService } from '../procurement-invoice-rejection-data.service';
import { ProcurementInvoiceRejectionLookupService } from '@libs/procurement/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceRejectionValidationService extends BaseValidationService<IInvRejectEntity> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly dataService = inject(ProcurementInvoiceRejectionDataService);
	private readonly rejectionLookupService = inject(ProcurementInvoiceRejectionLookupService);
	private readonly rejReasonLookupService = inject(BasicsSharedInvRejectionReasonLookupService);

	public constructor() {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IInvRejectEntity> {
		return {
			Quantity: this.validateQuantity,
			AmountNet: this.validateAmountNet,
			AmountNetOc: this.validateAmountNetOc,
			TaxCodeFk: this.validateTaxCodeFk,
			QuantityAskedFor: this.validateQuantityAskedFor,
			QuantityConfirmed: this.validateQuantityConfirmed,
			PriceAskedFor: this.validatePriceAskedFor,
			PriceAskedForOc: this.validatePriceAskedForOc,
			PriceConfirmed: this.validatePriceConfirmed,
			PriceConfirmedOc: this.validatePriceConfirmedOc,
			NetTotalOc: this.validateNetTotalOc,
			NetTotal: this.validateNetTotal,
			InvRejectFk: this.asyncValidateInvRejectFk,
			InvRejectionReasonFk: this.asyncValidateInvRejectionReasonFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IInvRejectEntity> {
		return this.dataService;
	}

	protected validateQuantity(info: ValidationInfo<IInvRejectEntity>) {
		return this.validateNumericProperty(info, (entity, value) => {
			entity.QuantityConfirmed = entity.QuantityAskedFor + value;
			this.validateQuantityConfirmed({ entity, value: entity.QuantityConfirmed, field: 'QuantityConfirmed' });
			this.recalculateAmountTotal(entity);
		});
	}

	protected validateAmountNet(info: ValidationInfo<IInvRejectEntity>) {
		return this.validateNumericProperty(info, (entity, value) => {
			entity.AmountNetOc = this.calculationService.roundTo(value * this.exchangeRate);
			this.recalculateAmountTotal(entity);
		});
	}

	protected validateAmountNetOc(info: ValidationInfo<IInvRejectEntity>) {
		return this.validateNumericProperty(info, (entity, value) => {
			entity.AmountNet = this.calculationService.roundTo(value * this.exchangeRate);
			this.recalculateAmountTotal(entity);
		});
	}

	protected validateTaxCodeFk(info: ValidationInfo<IInvRejectEntity>) {
		return this.validateNumericProperty(info, (entity, value) => {
			this.dataService.recalcuteReject();
		});
	}

	protected validateQuantityAskedFor(info: ValidationInfo<IInvRejectEntity>) {
		return this.validateNumericProperty(info, (entity, value) => {
			if (entity.QuantityConfirmed === 0) {
				entity.QuantityConfirmed = value;
				this.validateQuantityConfirmed({ entity: entity, value: entity.QuantityConfirmed, field: 'QuantityConfirmed' });
			}
			this.recalculatePriceAsked(entity, false);
		});
	}

	protected validateQuantityConfirmed(info: ValidationInfo<IInvRejectEntity>) {
		return this.validateNumericProperty(info, (entity, value) => {
			this.recalculatePriceConfirmed(entity);
		});
	}

	protected validatePriceAskedFor(info: ValidationInfo<IInvRejectEntity>) {
		return this.validateNumericProperty(info, (entity, value) => {
			entity.PriceAskedForOc = this.calculationService.roundTo(value * this.exchangeRate);
			this.recalculatePriceAsked(entity, false);
		});
	}

	protected validatePriceAskedForOc(info: ValidationInfo<IInvRejectEntity>) {
		return this.validateNumericProperty(info, (entity, value) => {
			entity.PriceAskedFor = this.calculationService.roundTo(value / this.exchangeRate);
			this.recalculatePriceAsked(entity, false);
		});
	}

	protected validatePriceConfirmed(info: ValidationInfo<IInvRejectEntity>) {
		return this.validateNumericProperty(info, (entity, value) => {
			entity.PriceConfirmedOc = this.calculationService.roundTo(value * this.exchangeRate);
			this.recalculatePriceConfirmed(entity);
		});
	}

	protected validatePriceConfirmedOc(info: ValidationInfo<IInvRejectEntity>) {
		return this.validateNumericProperty(info, (entity, value) => {
			entity.PriceConfirmed = this.calculationService.roundTo(value * this.exchangeRate);
			this.recalculatePriceConfirmed(entity);
		});
	}

	protected validateNetTotalOc(info: ValidationInfo<IInvRejectEntity>) {
		return this.validateNumericProperty(info, (entity, value) => {
			entity.QuantityConfirmed = 0;
			entity.QuantityAskedFor = -1;
			entity.PriceAskedForOc = value;
			entity.NetTotal = this.calculationService.roundTo(value * this.exchangeRate);
			entity.PriceAskedFor = entity.NetTotal;
			this.recalculateAmountTotal(entity);
		});
	}

	protected validateNetTotal(info: ValidationInfo<IInvRejectEntity>) {
		return this.validateNumericProperty(info, (entity, value) => {
			entity.QuantityConfirmed = 0;
			entity.QuantityAskedFor = -1;
			entity.PriceAskedFor = value;
			entity.NetTotalOc = this.calculationService.roundTo(value * this.exchangeRate);
			entity.PriceAskedForOc = entity.NetTotalOc;
			this.recalculateAmountTotal(entity);
		});
	}

	protected async asyncValidateInvRejectFk(info: ValidationInfo<IInvRejectEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		if (!value) {
			return this.validationUtils.createSuccessObject();
		}

		const rejection = await firstValueFrom(this.rejectionLookupService.getItemByKey({ id: value }));
		if (!rejection) {
			return this.validationUtils.createSuccessObject();
		}

		entity.Quantity = rejection.Quantity;
		entity.UomFk = rejection.UomFk;
		entity.Description = rejection.Description;
		entity.TaxCodeFk = rejection.TaxCodeFk;
		entity.CommentText = rejection.CommentText;
		entity.Remark = rejection.Remark;
		entity.QuantityAskedFor = rejection.QuantityAskedFor;
		entity.QuantityConfirmed = rejection.QuantityConfirmed;
		entity.Itemreference = rejection.Itemreference;
		entity.PriceAskedForOc = rejection.PriceAskedForOc * -1;
		entity.PriceConfirmedOc = rejection.PriceConfirmedOc * -1;
		entity.PriceAskedFor = rejection.PriceAskedFor * -1;
		entity.PriceConfirmed = rejection.PriceConfirmed * -1;
		entity.AmountNet = rejection.AmountNet * -1;
		entity.AmountNetOc = rejection.AmountNetOc * -1;
		entity.InvRejectionReasonFk = rejection.InvRejectionReasonFk;

		this.recalculatePriceAsked(entity, true);

		this.dataService.readonlyProcessor.process(entity);

		return this.validationUtils.createSuccessObject();
	}

	private validateNumericProperty(info: ValidationInfo<IInvRejectEntity>, additionalValidation: (entity: IInvRejectEntity, value: number) => void) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		if (!value) {
			return this.validationUtils.createSuccessObject();
		}

		const propertyKey = info.field as keyof IInvRejectEntity;
		if (!Object.getOwnPropertyDescriptor(entity, propertyKey)?.writable) {
			throw new Error(`Property '${propertyKey}' is read-only and cannot be assigned a new value.`);
		}
		(entity[propertyKey] as number) = value;
		additionalValidation(entity, value);
		//this.recalculateAmountTotal(entity);
		return this.validationUtils.createSuccessObject();
	}

	protected async asyncValidateInvRejectionReasonFk(info: ValidationInfo<IInvRejectEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		if (!value || entity.InvRejectionReasonFk === value) {
			return this.validationUtils.createSuccessObject();
		}

		const reason = await firstValueFrom(this.rejReasonLookupService.getItemByKey({ id: value }));
		if (reason) {
			entity.Description = reason.DescriptionInfo?.Translated;
			this.dataService.setModified(entity);
		}

		return this.validationUtils.createSuccessObject();
	}

	private recalculateAmountTotal(entity: IInvRejectEntity) {
		entity.AmountTotalOc = this.calculationService.roundTo(entity.Quantity * entity.AmountNetOc);
		entity.AmountTotal = this.calculationService.roundTo(entity.Quantity * entity.AmountNet);

		this.dataService.recalcuteReject();
	}

	private recalculatePriceConfirmed(entity: IInvRejectEntity) {
		entity.ConfirmedTotal = this.calculationService.roundTo(entity.QuantityConfirmed * entity.PriceConfirmed);
		entity.ConfirmedTotalOc = this.calculationService.roundTo(entity.QuantityConfirmed * entity.PriceConfirmedOc);

		if (entity.AskedForTotal) {
			entity.NetTotal = this.calculationService.roundTo(entity.ConfirmedTotal - entity.AskedForTotal);
		}
		if (entity.AskedForTotalOc) {
			entity.NetTotalOc = this.calculationService.roundTo(entity.ConfirmedTotalOc - entity.AskedForTotalOc);
		}
		this.recalculateAmountTotal(entity);
	}

	private recalculatePriceAsked(entity: IInvRejectEntity, ignoreConfirmed: boolean) {
		entity.AskedForTotal = this.calculationService.roundTo(entity.QuantityAskedFor * entity.PriceAskedFor);
		entity.AskedForTotalOc = this.calculationService.roundTo(entity.QuantityAskedFor * entity.PriceAskedForOc);

		if (entity.AskedForTotal && entity.ConfirmedTotal) {
			entity.NetTotal = this.calculationService.roundTo(entity.ConfirmedTotal - entity.AskedForTotal);
		}
		if (entity.AskedForTotalOc && entity.ConfirmedTotalOc) {
			entity.NetTotalOc = this.calculationService.roundTo(entity.ConfirmedTotalOc - entity.AskedForTotalOc);
		}
		if (entity.PriceConfirmed === 0 && !ignoreConfirmed) {
			entity.PriceConfirmed = entity.PriceAskedFor;
			entity.PriceConfirmedOc = entity.PriceAskedForOc;
		}

		this.recalculateAmountTotal(entity);
	}

	private get exchangeRate() {
		let exchangeRate = 0;
		const invoiceHeader = this.dataService.parentEntity;
		if (invoiceHeader?.Id) {
			exchangeRate = invoiceHeader.ExchangeRate;
		}
		return exchangeRate;
	}

	private get calculationService() {
		return this.dataService.calculationService;
	}
}
