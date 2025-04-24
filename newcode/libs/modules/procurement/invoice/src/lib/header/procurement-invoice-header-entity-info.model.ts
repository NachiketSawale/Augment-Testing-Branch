/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementInvoiceHeaderLayoutService } from './procurement-invoice-header-layout.service';
import { ProcurementInvoiceHeaderDataService } from './procurement-invoice-header-data.service';
import {
	BasicsSharedAccountAssignmentAccountTypeLookupService,
	BasicsSharedCompanyDeferaltypeLookupService,
	BasicsSharedInvoiceTypeLookupService,
	BasicsSharedNumberGenerationService,
	BasicsSharedPlainTextContainerComponent,
	BasicsSharedPrcStockTransactionTypeLookupService,
	BasicsShareProcurementConfigurationToBillingSchemaLookupService,
	IPlainTextAccessor,
	PLAIN_TEXT_ACCESSOR,
} from '@libs/basics/shared';
import { PROCUREMENT_INVOICE_HEADER_SCHEME_ID } from './procurement-invoice-header-scheme-id.model';
import { PrcInvoiceStatusLookupService } from '@libs/procurement/shared';
import { IInvHeaderEntity } from '../model/entities/inv-header-entity.interface';
import { ProcurementInvoiceHeaderBehavior } from '../behaviors/procurement-invoice-header-behavior.service';

export const PROCUREMENT_INVOICE_HEADER_ENTITY_INFO = EntityInfo.create({
	grid: {
		title: {
			key: 'procurement.invoice.title.header'
		},
		behavior: (ctx) => ctx.injector.get(ProcurementInvoiceHeaderBehavior),
	},
	form: {
		containerUuid: '295fe4ee5c974e0ttt3cfd5473574d2b',
		title: {
			key: 'procurement.invoice.title.headerDetail',
		},
	},
	permissionUuid: 'da419bc1b8ee4a2299cf1dde81cf1884',
	dtoSchemeId: PROCUREMENT_INVOICE_HEADER_SCHEME_ID,
	layoutConfiguration: async (context) => await context.injector.get(ProcurementInvoiceHeaderLayoutService).generateLayout(context),
	dataService: (context) => context.injector.get(ProcurementInvoiceHeaderDataService),
	prepareEntityContainer: async (context) => {
		const prcNumGenSrv = context.injector.get(BasicsSharedNumberGenerationService);
		await Promise.all([
			context.injector.get(BasicsSharedInvoiceTypeLookupService).getListAsync(),
			context.injector.get(PrcInvoiceStatusLookupService).getListAsync(),
			context.injector.get(BasicsSharedPrcStockTransactionTypeLookupService).getListAsync(),
			context.injector.get(BasicsSharedAccountAssignmentAccountTypeLookupService).getListAsync(),
			context.injector.get(BasicsSharedCompanyDeferaltypeLookupService).getListAsync(),
			context.injector.get(BasicsShareProcurementConfigurationToBillingSchemaLookupService).getListAsync(),
			prcNumGenSrv.getNumberGenerateConfig('procurement/invoice/numbergeneration/list'),
		]);
	},
	additionalEntityContainers: [
		// rejection remark container
		{
			uuid: '49D1400580C74AB99C88C73B744DFDAA',
			permission: 'da419bc1b8ee4a2299cf1dde81cf1884',
			title: 'procurement.invoice.title.rejectionremarkDetail',
			containerType: BasicsSharedPlainTextContainerComponent,
			providers: [
				{
					provide: PLAIN_TEXT_ACCESSOR,
					useValue: <IPlainTextAccessor<IInvHeaderEntity>>{
						getText(entity: IInvHeaderEntity): string | undefined {
							return entity.RejectionRemark === null ? undefined : entity.RejectionRemark;
						},
						setText(entity: IInvHeaderEntity, value?: string) {
							if (value) {
								entity.RejectionRemark = value;
							}
							//TODO: set disabled if parent InvStatus IsReadOnly
						},
					},
				},
			],
		},
	],
});
