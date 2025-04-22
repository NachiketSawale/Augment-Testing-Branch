/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementInvoiceAccountAssignmentDataService } from './procurement-invoice-account-assignment-data.service';
import { IInvAccountAssignmentEntity, IInvHeaderEntity, InvComplete } from '../model';
import { ProcurementCommonAccountAssignmentValidationService } from '@libs/procurement/common';
import { IReadOnlyField, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { isNil, sumBy } from 'lodash';
import { round } from 'mathjs';
import { BasicsSharedAccountAssignmentAccountTypeLookupService } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceAccountAssignmentValidationService extends ProcurementCommonAccountAssignmentValidationService<IInvAccountAssignmentEntity, IInvHeaderEntity, InvComplete> {
	private readonly accountAssignmentAccountTypeLookup = inject(BasicsSharedAccountAssignmentAccountTypeLookupService);

	public constructor(protected override readonly dataService: ProcurementInvoiceAccountAssignmentDataService) {
		super(dataService);
	}

	public validateInvBreakdownPercent(info: ValidationInfo<IInvAccountAssignmentEntity>) {
		const entity = info.entity;
		const value = (isNil(info.value) ? 0 : info.value) as number;
		this.dataService.updateInvBreakDownPercent(entity, value);

		return this.validateInvTotalPercent(info);
	}

	public validateBasAccAssignAccTypeFk(info: ValidationInfo<IInvAccountAssignmentEntity>) {
		const type = this.accountAssignmentAccountTypeLookup.syncService?.getListSync().find((i) => i.Id === info.entity.BasAccAssignAccTypeFk);
		const is2Fields = type?.Is2Fields ?? false;
		const readonlyFields: IReadOnlyField<IInvAccountAssignmentEntity>[] = [
			{field: 'AccountAssignment01', readOnly: is2Fields},
			{field: 'AccountAssignment02', readOnly: !is2Fields},
			{field: 'AccountAssignment03', readOnly: !is2Fields},
		];

		if (type) {
			this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, readonlyFields);
		} else {
			readonlyFields.forEach((field) => (field.readOnly = true));
			this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, readonlyFields);
		}
		return this.validationUtils.createSuccessObject();
	}

	protected override generateValidationFunctions(): IValidationFunctions<IInvAccountAssignmentEntity> {
		const baseFunctions = super.generateValidationFunctions();
		return {
			...baseFunctions,
			...{
				InvBreakdownPercent: this.validateInvBreakdownPercent,
				InvBreakdownAmount: this.validateInvBreakdownAmount,
				InvBreakdownAmountOc: this.validateInvBreakdownAmountOc,
				BasAccAssignAccTypeFk: this.validateBasAccAssignAccTypeFk,
			},
		};
	}

	private validateInvBreakdownAmount(info: ValidationInfo<IInvAccountAssignmentEntity>) {
		const totalInfo = this.dataService.TotalInfo;
		const entity = info.entity;
		const value = (isNil(info.value) ? 0 : info.value) as number;
		if (totalInfo) {
			if (totalInfo.invoiceTotalNet === 0) {
				entity.InvBreakdownPercent = 0;
				entity.InvBreakdownAmount = value;
			} else {
				entity.InvBreakdownAmount = value;
				entity.InvBreakdownPercent = round((value / totalInfo.invoiceTotalNet) * 100, 2);
				entity.InvBreakdownAmountOc = round((totalInfo.invoiceTotalNetOc * entity.InvBreakdownPercent) / 100, 2);
			}
		}

		return this.validateInvTotalPercent(info);
	}

	private validateInvBreakdownAmountOc(info: ValidationInfo<IInvAccountAssignmentEntity>) {
		const totalInfo = this.dataService.TotalInfo;
		const entity = info.entity;
		const value = (isNil(info.value) ? 0 : info.value) as number;
		if (totalInfo) {
			if (totalInfo.invoiceTotalNetOc === 0) {
				entity.InvBreakdownPercent = 0;
				entity.InvBreakdownAmountOc = value;
			} else {
				entity.InvBreakdownAmountOc = value;
				entity.InvBreakdownPercent = round((value / totalInfo.invoiceTotalNetOc) * 100, 2);
				entity.InvBreakdownAmount = round((totalInfo.invoiceTotalNet * entity.InvBreakdownPercent) / 100, 2);
			}
		}

		return this.validateInvTotalPercent(info);
	}

	private validateInvTotalPercent(info: ValidationInfo<IInvAccountAssignmentEntity>) {
		const totalInfo = this.dataService.TotalInfo;
		if (totalInfo) {
			this.dataService.updateInvBreakDown();
			const totalPercent = sumBy(this.dataService.getList(), (i) => i.InvBreakdownPercent);
			if (totalPercent !== 100) {
				return this.validationUtils.createErrorObject({
					key: 'cloud.common.emptyOrNullValueErrorMessage',
					params: {object: info.field.toLowerCase()},
				});
			}
		}
		return this.validationUtils.createSuccessObject();
	}
}
