/*
 * Copyright(c) RIB Software GmbH
 */

import { bignumber } from 'mathjs';
import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { IPrcPaymentScheduleEntity } from '../model/entities';
import { IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementCommonRoundingService } from './helper';
import { ProcurementCommonPaymentScheduleDataService } from './procurement-common-payment-schedule-data.service';
import { AmountFieldsType, BasicsSharedInvoiceTypeLookupService, BasicsSharedPaymentScheduleValidationService } from '@libs/basics/shared';

/**
 * Procurement common payment schedule validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonPaymentScheduleValidationService<
   T extends IPrcPaymentScheduleEntity,
   PT extends IEntityIdentification & { PaymentTermFiFk?: number | null, PaymentTermPaFk?: number | null , ExchangeRate?: number },
   PU extends CompleteIdentification<PT>,
	RT extends IEntityIdentification = PT,
	RU extends CompleteIdentification<RT> = PU>
   extends BasicsSharedPaymentScheduleValidationService<T, PT, PU> {
	protected readonly prcRoundingService = inject(ProcurementCommonRoundingService);
	protected readonly invoiceTypeLookupService = inject(BasicsSharedInvoiceTypeLookupService);

	protected constructor(protected override readonly dataService: ProcurementCommonPaymentScheduleDataService<T, PT, PU, RT, RU>) {
		super(dataService);
	}

	protected override generateValidationFunctions(): IValidationFunctions<T> {
		const baseFunctions = super.generateValidationFunctions();
		return {...baseFunctions, ...{
				InvTypeFk: this.validateInvTypeFk,
				AmountNet: this.validateAmountFields,
				AmountNetOc: this.validateAmountFields,
				AmountGross: this.validateAmountFields,
				AmountGrossOc: this.validateAmountFields,
				PercentOfContract: this.validatePercentOfContract
			}};
	}

	protected async validateInvTypeFk(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = info.value as number;

		if (!value) {
			return this.validationUtils.createSuccessObject();
		}

		const parentSelected = this.dataService.parentService.getSelectedEntity();
		let newBasPaymentTermFk = parentSelected?.PaymentTermFiFk;
		const invType = await firstValueFrom(this.invoiceTypeLookupService.getItemByKey({id: value}));
		if (invType) {
			if (invType.Isprogress) {
				newBasPaymentTermFk = parentSelected?.PaymentTermPaFk;
			}
		}

		if (entity.BasPaymentTermFk !== newBasPaymentTermFk) {
			entity.BasPaymentTermFk = newBasPaymentTermFk;
			return this.validateBasPaymentTermFk({entity: entity, value: newBasPaymentTermFk ?? undefined, field: 'BasPaymentTermFk'});
		}

		return this.validationUtils.createSuccessObject();
	}

	protected validatePercentOfContract(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = (info.value ?? 0) as number;

		const validateRangeResult = this.validatePercentRange(entity, value, info.field);
		if (!validateRangeResult.valid) {
			return validateRangeResult;
		}

		entity.PercentOfContract = value;
		this.dataService.calculateAmountByPercent(entity);
		this.dataService.calculateSumLine();
		this.dataService.calculateRemaining();

		return this.validationUtils.createSuccessObject();
	}

	protected getTargetValue(field: AmountFieldsType) {
		const target = this.dataService.paymentScheduleTarget;
		let targetValue;
		switch (field) {
			case 'AmountNet':
				targetValue = target.net;
				break;
			case 'AmountNetOc':
				targetValue = target.netOc;
				break;
			case 'AmountGross':
				targetValue = target.gross;
				break;
			case 'AmountGrossOc':
				targetValue = target.grossOc;
				break;
		}
		return targetValue;
	}

	protected validateAmountFields(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = (info.value ?? 0) as number;
		const field = info.field as AmountFieldsType;
		this.calculateAmountFields(entity, value, field);

		const targetValue = this.getTargetValue(field);
		entity.PercentOfContract = this.prcRoundingService.roundTo(bignumber(value).div(targetValue).mul(100));
		this.validatePercentRange(entity, entity.PercentOfContract, 'PercentOfContract');

		this.dataService.calculateSumLine();
		this.dataService.calculateRemaining();

		return this.validationUtils.createSuccessObject();
	}
}

