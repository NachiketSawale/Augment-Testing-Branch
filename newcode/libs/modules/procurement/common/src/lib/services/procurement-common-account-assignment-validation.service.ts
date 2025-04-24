/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ProcurementBaseValidationService } from '@libs/procurement/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { round } from 'mathjs';
import { isNil, sumBy } from 'lodash';
import { IPrcCommonAccountAssignmentEntity } from '../model/entities';
import { ProcurementCommonAccountAssignmentDataService } from './procurement-common-account-assignment-data.service';

/**
 * Procurement common Contact validation service
 */
export abstract class ProcurementCommonAccountAssignmentValidationService<T extends IPrcCommonAccountAssignmentEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementBaseValidationService<T> {

	/**
	 *
	 * @param dataService
	 */
	protected constructor(protected dataService: ProcurementCommonAccountAssignmentDataService<T, PT, PU>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			BreakdownPercent: this.validateBreakdownPercent,
			BreakdownAmount: this.validateBreakdownAmount,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	public validateBreakdownPercent(info: ValidationInfo<T>) {
		const entity = info.entity;
		const value = (isNil(info.value) ? 0 : info.value) as number;
		this.dataService.updateBreakDownPercent(entity, value);

		return this.validateTotalPercent(info);
	}

	private validateBreakdownAmount(info: ValidationInfo<T>) {
		const totalInfo = this.dataService.TotalInfo;
		const entity = info.entity;
		const value = (isNil(info.value) ? 0 : info.value) as number;
		if (totalInfo) {
			if (totalInfo.conTotalAmount === 0) {
				entity.BreakdownPercent = 0;
				entity.BreakdownAmount = value;
			} else {
				entity.BreakdownAmount = value;
				entity.BreakdownPercent = round((value / totalInfo.conTotalNet) * 100, 2);
				entity.BreakdownAmountOc = round((totalInfo.conTotalNetOc * entity.BreakdownPercent) / 100, 2);
			}
		}

		return this.validateTotalPercent(info);
	}

	private validateTotalPercent(info: ValidationInfo<T>) {
		const totalInfo = this.dataService.TotalInfo;
		if (totalInfo) {
			this.dataService.updateBreakDown();

			const totalPercent = sumBy(this.dataService.getList(), (i) => i.BreakdownPercent);
			if (totalPercent !== 100) {
				return this.validationUtils.createErrorObject({
					key: 'cloud.common.emptyOrNullValueErrorMessage',
					params: { object: info.field.toLowerCase() },
				});
			}
		}
		return this.validationUtils.createSuccessObject();
	}
}
