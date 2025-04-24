/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonDeliveryScheduleDataService } from './procurement-common-deliveryschedule-data.service';
import {IProcurementCommonDeliveryScheduleEntity} from '../model/entities/procurement-common-deliveryschedule-entity.interface';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IReadonlyParentService, ProcurementBaseValidationService } from '@libs/procurement/shared';
import { IValidationFunctions, ValidationInfo,ValidationResult } from '@libs/platform/data-access';
import { differenceInCalendarDays } from 'date-fns';

export abstract class ProcurementCommonDeliveryScheduleValidationService<T extends IProcurementCommonDeliveryScheduleEntity,PT extends IEntityIdentification, PU extends  CompleteIdentification<PT>>extends ProcurementBaseValidationService<T> {
	protected constructor(
		protected dataService: ProcurementCommonDeliveryScheduleDataService<T, PT, PU>,
		protected parentDataService: IReadonlyParentService<PT, PU>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			Quantity:this.validateQuantity,
			DateRequired:this.validateDateRequired,
			RunningNumber:this.validateRunningNumber
		};
	}

	private validateQuantity(info: ValidationInfo<T>){
			if(this.dataService.Scheduled?.openQuantity ===0 || this.dataService.Scheduled?.openQuantity === this.dataService.Scheduled?.totalQuantity){
				return new ValidationResult();
			}else{
				return new ValidationResult('procurement.common.delivery.deliveryScheduleCalculateOpenQuantityError');
			}
	}

	private validateDateRequired(info: ValidationInfo<T>): ValidationResult {
		const DateRequired = this.dataService.calculateDateRequired();
		if (!info.value) {
			return new ValidationResult('procurement.common.delivery.deliveryModifyRequiredByError');
		}
		const durations = Math.round(differenceInCalendarDays(DateRequired, new Date(info.value.toString())));
		if (durations > 0) {
			return new ValidationResult('procurement.common.delivery.deliveryModifyRequiredByError');
		}
		return new ValidationResult();
	}

	private validateRunningNumber(info: ValidationInfo<T>){
		return this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList());
	}
}