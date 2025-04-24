import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IGeneratePaymentSchedule } from '../../model/interfaces/wizard/generate-payment-schedule.interface';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { gt, round } from 'lodash';
import { differenceInDays, differenceInMonths, differenceInQuarters, differenceInWeeks } from 'date-fns';


export class ProcurementCommonGeneratePaymentScheduleValidationService {
	public constructor(
		private readonly validationUtils: BasicsSharedDataValidationService,
		private readonly vatPercent: number,
	) {}

	public validateTotalOcGross = (info: ValidationInfo<IGeneratePaymentSchedule>) => {
		const value = info.value as number;
		if (value > 0 || value < 0) {
			new ValidationResult();
		}
		return this.validationUtils.createErrorObject('procurement.common.wizard.generatePaymentSchedule.noZero');
	};

	public validateStartWork = (info: ValidationInfo<IGeneratePaymentSchedule>) => {
		let validateResult = new ValidationResult();
		const result = this.validationUtils.isMandatory(info);
		if (!result.valid) {
			validateResult = result;
		}

		if (info.entity.EndWork && info.value) {
			if (info.value >= info.entity.EndWork) {
				return this.validationUtils.createErrorObject('cloud.common.Error_EndDateTooEarlier');
			}
		}

		if (gt(info.entity.RadioType, '0')) {
			return this.calculatetion(info.entity, info.value as Date, info.entity.EndWork);
		}

		return validateResult;
	};

	public validateEndWork = (info: ValidationInfo<IGeneratePaymentSchedule>) => {
		let validateResult = new ValidationResult();
		const result = this.validationUtils.isMandatory(info);
		if (!result.valid) {
			validateResult = result;
		}

		if (info.entity.StartWork && info.value) {
			if (info.value <= info.entity.StartWork) {
				return this.validationUtils.createErrorObject('cloud.common.Error_EndDateTooEarlier');
			}
		}
		if (gt(info.entity.RadioType, '0')) {
			return this.calculatetion(info.entity, info.entity.StartWork, info.value as Date);
		}

		return validateResult;
	};

	public validateScurveFk = (info: ValidationInfo<IGeneratePaymentSchedule>) => {
		return this.validationUtils.isMandatory(info);
	};

	public validateTotalCost = (info: ValidationInfo<IGeneratePaymentSchedule>, isInclude?: boolean, grossOc?: number) => {
		if (info.value) {
			const value = info.value as number;
			if (value > 0 || value < 0) {
				if (isInclude && grossOc) {
					info.entity.TotalOcGross = grossOc;
				}
				if (isInclude === false) {
					info.entity.TotalOcGross = parseFloat((value * (1 + this.vatPercent / 100)).toFixed(2));
				}
				return new ValidationResult();
			}
		}
		return this.validationUtils.createErrorObject('procurement.common.wizard.generatePaymentSchedule.noZero');
	};

	private calculatetion(entity: IGeneratePaymentSchedule, startWork: Date | null, endWork: Date | null) {
		if (startWork && endWork) {
			if (entity.Repeat === '4') {
				const _duration = round(differenceInDays(endWork, startWork), 0) + 1;
				if (_duration > 0 && _duration < entity.Occurence) {
					return this.validationUtils.createErrorObject('procurement.common.wizard.generateDeliverySchedule.deliveryModifyOccurenceByError');
				}
			} else {
				const repeat = entity.Repeat;
				let occurence = 1;
				if (repeat === '1') {
					// weekly
					occurence = differenceInWeeks(startWork, endWork) + 1;
				} else if (repeat === '2') {
					// monthly
					occurence = differenceInMonths(startWork, endWork) + 1;
				} else {
					// quarterly
					occurence = differenceInQuarters(startWork, endWork) + 1;
				}
				entity.Occurence = occurence;
			}
		}
		return new ValidationResult();
	}
}
