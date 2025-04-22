/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementModule } from '@libs/procurement/shared';
import { ProcurementInvoicePaymentDataService } from './procurement-invoice-payment-data.service';
import { ProcurementInvoicePaymentLayoutService } from './procurement-invoice-payment-layout.service';
import { ProcurementInvoicePaymentValidationService } from './procurement-invoice-payment-validation.service';

export const PROCUREMENT_INVOICE_PAYMENT_ENTITY_INFO = EntityInfo.create({
	grid: {
		title: {
			key: 'procurement.invoice.title.payment',
		},
	},
	form: {
		containerUuid: '8bf8e35c862a4bf48951fbc7da8825e9',
		title: {
			key: 'procurement.invoice.title.paymentDetail',
		},
	},
	permissionUuid: '94147a35ceba4d4a87141e154c7ec326',
	dtoSchemeId: { moduleSubModule: ProcurementModule.Invoice, typeName: 'InvPaymentDto' },
	layoutConfiguration: async (context) => await context.injector.get(ProcurementInvoicePaymentLayoutService).generateLayout(context),
	dataService: (context) => context.injector.get(ProcurementInvoicePaymentDataService),
	validationService: (context) => context.injector.get(ProcurementInvoicePaymentValidationService),
});
