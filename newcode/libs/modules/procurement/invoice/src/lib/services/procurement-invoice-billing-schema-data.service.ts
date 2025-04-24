/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IInvHeaderEntity } from '../model/entities';
import { CommonBillingSchemaDataService, ICommonBillingSchemaEntity } from '@libs/basics/shared';
import { InvComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';

/**
 * inv billing schema data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceBillingSchemaDataService extends CommonBillingSchemaDataService<ICommonBillingSchemaEntity, IInvHeaderEntity, InvComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const invDataService = inject(ProcurementInvoiceHeaderDataService);
		const qualifier = 'procurement.invoice.billingschmema';
		const apiUrl = 'procurement/invoice/billingschema';
		super(invDataService, qualifier, apiUrl);
	}

	protected override provideLoadPayload(): object {
		const invHeaderEntity = this.parentService.getSelectedEntity()!;
		return {
			mainItemId: invHeaderEntity.Id,
		};
	}

	protected override getParentBillingSchemaId(inv: IInvHeaderEntity): number {
		return inv.BillingSchemaFk!;
	}

	protected getRubricCategory(inv: IInvHeaderEntity): number {
		return inv.RubricCategoryFk;
	}

	public getExchangeRate(inv: IInvHeaderEntity): number {
		return inv.ExchangeRate;
	}

	protected async doRecalculateBillingSchema(): Promise<ICommonBillingSchemaEntity[]> {
		const headerEntity = this.parentService.getSelectedEntity();

		if (headerEntity) {
			return this.http.get<ICommonBillingSchemaEntity[]>('procurement/invoice/billingschema/Recalculate', { params: { headerFk: headerEntity.Id } });
		}

		return [];
	}
}
