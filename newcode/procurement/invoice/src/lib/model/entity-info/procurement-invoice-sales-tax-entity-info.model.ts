/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementInvoiceSalesTaxDataService } from '../../services/procurement-invoice-sales-tax-data.service';
import { ProcurementInvoiceHeaderDataService } from '../../header/procurement-invoice-header-data.service';
import { ProcurementCommonSalesTaxEntityInfo } from '@libs/procurement/common';

export const PROCUREMENT_INVOICE_SALES_TAX_ENTITY_INFO = ProcurementCommonSalesTaxEntityInfo.create({
	permissionUuid: 'a62055fa1da1409dab412e247acb5508',
	formUuid: 'bbeaec592a974385a48c669c1c21ac09',
	moduleSubModule: 'Procurement.Invoice',
	typeName: 'InvSalesTaxDto',
	dataServiceToken: ProcurementInvoiceSalesTaxDataService,
	parentServiceFn: (ctx) => ctx.injector.get(ProcurementInvoiceHeaderDataService)
});