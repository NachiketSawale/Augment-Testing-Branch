/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILookupFieldOverload } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IPesTransactionContextEntity } from '../model/entities';
import { ProcurementCommonCreateAccrualTransactionWizardService } from '@libs/procurement/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPesCreateAccrualTransactionWizardService extends ProcurementCommonCreateAccrualTransactionWizardService<IPesTransactionContextEntity> {


	public constructor() {
		super({
			contextUrlSuffix: 'procurement/pes/accrual/transaction/',
			translateSource: 'procurement.pes.wizard.createAccrualTransaction.'
		});
	}

	protected override okBtnDisabled(entity: IPesTransactionContextEntity) {
		if (!entity) {
			return true;
		}

		const isVoucherValid = typeof entity.VoucherNo === 'string' && entity.VoucherNo.trim() !== '';
		const isAccrualModeValid = entity.AccrualModeId != null;
		return !isVoucherValid || !isAccrualModeValid;
	}

	protected override getAccrualModeOptions() {
		return (BasicsSharedCustomizeLookupOverloadProvider.providePesAccrualModeLookupOverload(false) as ILookupFieldOverload<IPesTransactionContextEntity>).lookupOptions;
	}
}
