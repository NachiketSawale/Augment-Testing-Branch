/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, ProviderToken } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IInvAccountAssignmentEntity, IInvHeaderEntity, InvComplete } from '../../model';
import { ProcurementCommonAccountAssignmentDataService, ProcurementCommonAccountAssignmentLayoutService } from '@libs/procurement/common';
import { mergeLayout } from '@libs/basics/shared';


@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceAccountAssignmentLayoutService extends ProcurementCommonAccountAssignmentLayoutService<IInvAccountAssignmentEntity, IInvHeaderEntity, InvComplete> {

	public override async generateLayout(config: {
		dataServiceToken: ProviderToken<ProcurementCommonAccountAssignmentDataService<IInvAccountAssignmentEntity, IInvHeaderEntity, InvComplete>>
	}): Promise<ILayoutConfiguration<IInvAccountAssignmentEntity>> {
		return mergeLayout(await super.generateLayout(config), {
			groups: [{
				gid: 'basicData',
				attributes: [
					'InvBreakdownPercent',
					'InvBreakdownAmount',
					'InvBreakdownAmountOc',
					'PreviousInvoiceAmount',
					'PreviousInvoiceAmountOc',
				]
			}],
			labels: {
				...prefixAllTranslationKeys('procurement.invoice.', {
					InvBreakdownPercent: {key: 'EntityInvoiceBreakdownPercent'},
					InvBreakdownAmount: {key: 'EntityInvoiceBreakdownAmount'},
					InvBreakdownAmountOc: {key: 'EntityInvoiceBreakdownAmountOc'},
					PreviousInvoiceAmount: {key: 'EntityPreviousInvoicesAmount'},
					PreviousInvoiceAmountOc: {key: 'EntityPreviousInvoicesAmountOc'},
				}),
			},
		});
	}
}
