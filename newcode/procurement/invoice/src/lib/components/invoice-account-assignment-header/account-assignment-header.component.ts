/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit } from '@angular/core';
import { IPrcCommonAccountAssignmentEntity, IPrcCommonAccountAssignmentTotal, ProcurementCommonAccountAssignmentHeaderComponent, ProcurementCommonModule } from '@libs/procurement/common';

@Component({
	selector: 'procurement-invoice-account-assignment-header',
	standalone: true,
	templateUrl: './account-assignment-header.component.html',
	imports: [ProcurementCommonModule, ProcurementCommonAccountAssignmentHeaderComponent],
})
export class ProcurementInvoiceAccountAssignmentHeaderComponent extends ProcurementCommonAccountAssignmentHeaderComponent implements OnInit {
	public ngOnInit() {
		this.headerLabels = [
			'procurement.common.accountAssigment.Invoice',
			'procurement.common.accountAssigment.InvoiceOc',
			'procurement.common.accountAssigment.Contract',
			'procurement.common.accountAssigment.ContractOc',
			'procurement.common.accountAssigment.PreviousInvoices',
			'procurement.common.accountAssigment.PreviousInvoicesOc',
		];
		this.currencyRows = {
			headerLabel: 'procurement.common.accountAssigment.Currency',
			useInputControl: true,
			fields: ['invCompanyCurrency', 'invHeaderCurrency', 'conCompanyCurrency', 'conHeaderCurrency', 'previousInvCompanyCurrency', 'previousInvHeaderCurrency'] as (keyof IPrcCommonAccountAssignmentTotal<IPrcCommonAccountAssignmentEntity>)[],
		};
		this.totalNetRows = {
			headerLabel: 'procurement.common.accountAssigment.TotalNet',
			fields: ['invoiceTotalNet', 'invoiceTotalNetOc', 'conTotalNet', 'conTotalNetOc', 'previousInvoiceNet', 'previousInvoiceNetOc'] as (keyof IPrcCommonAccountAssignmentTotal<IPrcCommonAccountAssignmentEntity>)[],
		};
		this.verificationBreakdownAmountRows = {
			headerLabel: 'procurement.common.accountAssigment.VerificationBreakdownAmount',
			fields: ['invoiceTotalAmount', 'invoiceTotalAmountOc', 'conTotalAmount', 'conTotalAmountOc', 'previousInvoiceAmount', 'previousInvoiceAmountOc'] as (keyof IPrcCommonAccountAssignmentTotal<IPrcCommonAccountAssignmentEntity>)[],
		};
		this.verificationBreakdownInRows = {
			headerLabel: 'procurement.common.accountAssigment.VerificationBreakdownIn',
			fields: ['invoiceTotalPercent', 'conTotalPercent'] as (keyof IPrcCommonAccountAssignmentTotal<IPrcCommonAccountAssignmentEntity>)[],
		};
	}
}
