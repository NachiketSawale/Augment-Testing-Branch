/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, PlatformCommonModule } from '@libs/platform/common';
import { IPrcCommonAccountAssignmentEntity } from '../../model/entities/procurement-common-account-assignment-entity.interface';
import { FieldType, UiCommonModule } from '@libs/ui/common';
import { ProcurementCommonGridCompositeComponentBase } from '../grid-composite-base/grid-composite-base.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ProcurementCommonAccountAssignmentDataService } from '../../services';
import { UiExternalModule } from '@libs/ui/external';
import { IPrcCommonAccountAssignmentTotal, IProcurementCommonAccountAssignmentFieldRow } from '../../model/interfaces';

@Component({
	selector: 'procurement-common-account-assignment-header',
	standalone: true,
	imports: [PlatformCommonModule, UiCommonModule, DecimalPipe, CommonModule, UiExternalModule],
	templateUrl: './account-assignment-header.component.html',
	styleUrl: './account-assignment-header.component.css',
})
export class ProcurementCommonAccountAssignmentHeaderComponent extends ProcurementCommonGridCompositeComponentBase<
	ProcurementCommonAccountAssignmentDataService<IPrcCommonAccountAssignmentEntity, IEntityIdentification, CompleteIdentification<IEntityIdentification>>
> {
	public readonly fieldType = FieldType;
	@Input()
	public headerLabels = ['procurement.common.accountAssigment.Contract', 'procurement.common.accountAssigment.ContractOc'];
	@Input()
	public currencyRows: IProcurementCommonAccountAssignmentFieldRow = {
		headerLabel: 'procurement.common.accountAssigment.Currency',
		useInputControl: true,
		fields: ['conCompanyCurrency', 'conHeaderCurrency'] as (keyof IPrcCommonAccountAssignmentTotal<IPrcCommonAccountAssignmentEntity>)[],
	};
	@Input()
	public totalNetRows: IProcurementCommonAccountAssignmentFieldRow = {
		headerLabel: 'procurement.common.accountAssigment.TotalNet',
		fields: ['conTotalNet', 'conTotalNetOc'] as (keyof IPrcCommonAccountAssignmentTotal<IPrcCommonAccountAssignmentEntity>)[],
	};
	@Input()
	public verificationBreakdownAmountRows: IProcurementCommonAccountAssignmentFieldRow = {
		headerLabel: 'procurement.common.accountAssigment.VerificationBreakdownAmount',
		fields: ['conTotalAmount', 'conTotalAmountOc'] as (keyof IPrcCommonAccountAssignmentTotal<IPrcCommonAccountAssignmentEntity>)[],
	};
	@Input()
	public verificationBreakdownInRows: IProcurementCommonAccountAssignmentFieldRow = {
		headerLabel: 'procurement.common.accountAssigment.VerificationBreakdownIn',
		fields: ['conTotalPercent'] as (keyof IPrcCommonAccountAssignmentTotal<IPrcCommonAccountAssignmentEntity>)[],
	};

	public getTotalInfo() {
		return this.dataService.TotalInfo || this.getDefaultTotalInfo();
	}

	public getFieldValue(field: string): string | number | undefined {
		const totalInfo = this.getTotalInfo();
		if (totalInfo && field in totalInfo) {
			const value = totalInfo[field];
			if (typeof value === 'string' || typeof value === 'number') {
				return value;
			}
		}
		return undefined;
	}
	public calculateRemainingWidth(titlesLength: number, defaultPercentage: number = 15): number {
		const totalWidth = 100;
		const initialWidth = 10;
		const titlesWidth = titlesLength * defaultPercentage;
		return totalWidth - initialWidth - titlesWidth;
	}

	private getDefaultTotalInfo() {
		return {
			dtos: [] as IPrcCommonAccountAssignmentEntity[],
			conCompanyCurrency: '',
			conHeaderCurrency: '',
			conTotalAmount: 0,
			conTotalAmountOc: 0,
			conTotalNet: 0,
			conTotalNetOc: 0,
			conTotalPercent: 0,

			invCompanyCurrency: '',
			invHeaderCurrency: '',
			invoiceTotalAmount: 0,
			invoiceTotalAmountOc: 0,
			invoiceTotalNet: 0,
			invoiceTotalNetOc: 0,
			invoiceTotalPercent: 0,

			previousInvCompanyCurrency: '',
			previousInvHeaderCurrency: '',
			previousInvoiceAmount: 0,
			previousInvoiceAmountOc: 0,
			previousInvoiceNet: 0,
			previousInvoiceNetOc: 0,
		} as IPrcCommonAccountAssignmentTotal<IPrcCommonAccountAssignmentEntity>;
	}
}
