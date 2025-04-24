/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ProcurementCommonCreateAccrualTransactionWizardService } from '@libs/procurement/common';
import { ILookupFieldOverload } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IInvTransactionContextEntity } from '../model/entities/inv-accrual-transaction-param.interface';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceCreateAccrualTransactionWizardService extends ProcurementCommonCreateAccrualTransactionWizardService<IInvTransactionContextEntity> {
	public constructor() {
		super({
			contextUrlSuffix: 'procurement/invoice/accrual/transaction/',
			translateSource: 'procurement.invoice.wizard.createAccrualTransaction.'
		});
	}

	protected override okBtnDisabled(entity: IInvTransactionContextEntity) {
		if (!entity) {
			return true;
		}
		const isVoucherValid = typeof entity.VoucherNo === 'string' && entity.VoucherNo.trim() !== '';
		return !isVoucherValid;
	}

	protected override getAccrualModeOptions() {
		return (BasicsSharedCustomizeLookupOverloadProvider.provideInvoiceAccrualModeLookupOverload(false) as ILookupFieldOverload<IInvTransactionContextEntity>).lookupOptions;
	}
}
