/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { BasicsSharedCalculateOverGrossService } from '@libs/basics/shared';
import { IPrcCommonPaymentScheduleTotalSourceContextEntity, PRC_PAYMENT_SCHEDULE_TOTAL_SOURCE_CONTEXT_ENTITY } from '../../model/entities/prc-payment-schedule-total-source-entity.interface';
import { getCustomDialogDataToken, ILookupViewResult, StandardDialogButtonId } from '@libs/ui/common';

/**
 * Procurement common payment schedule create target component
 */
@Component({
	selector: 'procurement-common-payment-schedule-create-target',
	templateUrl: './payment-schedule-create-target.component.html',
	styleUrl: './payment-schedule-create-target.component.scss'
})
export class ProcurementCommonPaymentScheduleCreateTargetComponent {
	private readonly dialogWrapper = inject(getCustomDialogDataToken<ILookupViewResult<IPrcCommonPaymentScheduleTotalSourceContextEntity>, ProcurementCommonPaymentScheduleCreateTargetComponent>());
	public readonly contextEntity = inject(PRC_PAYMENT_SCHEDULE_TOTAL_SOURCE_CONTEXT_ENTITY);
	public readonly isOverGross = inject(BasicsSharedCalculateOverGrossService).isOverGross;
	public readonly totalSourceTextTr = this.isOverGross ?
		'procurement.common.paymentSchedule.totalSourceGrossOC' :
		'procurement.common.paymentSchedule.totalSourceNetOC';
	private totalNetOc = 0;
	private totalGrossOc = 0;


	/**
	 * handle total source value change
	 * @param totalSourceEntity
	 */
	public onTotalSourceChanged(totalSourceEntity: IPrcCommonPaymentScheduleTotalSourceContextEntity) {
		this.totalNetOc = totalSourceEntity.SourceNetOc;
		this.totalGrossOc = totalSourceEntity.SourceGrossOc;
	}

	/**
	 * Whether disable ok button
	 */
	public disableOkButton(): boolean {
		return this.totalNetOc === 0 || this.totalGrossOc === 0;
	}

	/**
	 * return total source value
	 */
	public ok() {
		this.contextEntity.SourceNetOc = this.totalNetOc;
		this.contextEntity.SourceGrossOc = this.totalGrossOc;
		this.dialogWrapper.value = {
			apply: true,
			result: this.contextEntity
		};
		this.dialogWrapper.close(StandardDialogButtonId.Ok);
	}
}