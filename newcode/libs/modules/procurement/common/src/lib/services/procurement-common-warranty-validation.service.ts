/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IPrcWarrantyEntity } from '../model/entities';
import { ProcurementCommonWarrantyDataService } from './procurement-common-warranty-data.service';
import { ProcurementBaseValidationService } from '@libs/procurement/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { addMonths } from 'date-fns';


export class ProcurementCommonWarrantyValidationService<T extends IPrcWarrantyEntity,  PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementBaseValidationService<T> {

	protected constructor(protected dataService: ProcurementCommonWarrantyDataService<T, PT, PU>) {
		super();
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			HandoverDate: this.validateHandoverDate,
			DurationMonths: this.validateDurationMonths,
		};
	}

	private validateHandoverDate(info: ValidationInfo<T>) {
		if (info.value) {
			const handoverDate = info.value;
			//todo.DEV-17861 The format here may be changing,some time return '21/06/2024',Sometimes return standard date
			//if (!isValid(handoverDate)) {
			//	const format = 'dd/MM/yyyy';
			//	handoverDate = parse(info.value.toString(), format, new Date());
			//}
			this.changeEndDate(info.entity, handoverDate as Date, info.entity.DurationMonths);
		}
		return new ValidationResult();
	}

	private validateDurationMonths(info: ValidationInfo<T>) {
		this.changeEndDate(info.entity, info.entity.HandoverDate, info.value as number);
		return new ValidationResult();
	}

	private changeEndDate(entity: T, handoverDate: Date | string , durationMonths: number) {
		const validDate: Date = typeof handoverDate === 'string' ? new Date(handoverDate) : handoverDate;
		entity.WarrantyEnddate = addMonths(validDate, durationMonths).toISOString();
		
	}

}