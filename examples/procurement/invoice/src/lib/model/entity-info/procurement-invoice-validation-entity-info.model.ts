/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementInvoiceValidationGridDataService } from '../../services/procurement-invoice-validation-grid-data.service';
import { IInvValidationEntity } from '../entities/inv-validation-entity.interface';
import { ProcurementInvoiceValidationLayoutService } from '../../services/layouts/procurement-invoice-validation-layout.service';

export const PROCUREMENT_INVOICE_VALIDATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IInvValidationEntity>({
	grid: {
		title: { key: 'procurement.invoice.title.validation' },
	},
	form: {
		title: { key: 'procurement.invoice.title.validationDetail' },
		containerUuid: 'c1aa10a264b04e5fbf9468a4b19e4764',
	},
	dataService: (ctx) => ctx.injector.get(ProcurementInvoiceValidationGridDataService),
	dtoSchemeId: { moduleSubModule: 'Procurement.Invoice', typeName: 'InvValidationDto' },
	permissionUuid: '842dd38c610d4501851750a6e14e2b19',
	layoutConfiguration: (context) => context.injector.get(ProcurementInvoiceValidationLayoutService).generateLayout(context),
});
