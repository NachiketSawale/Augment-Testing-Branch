/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonGeneralsEntityInfo } from '@libs/procurement/common';
import { ProcurementInvoiceGeneralsDataService } from '../../services/procurement-invoice-generals-data.service';
import { ProcurementInvoiceGeneralsValidationService } from '../../services/procurement-invoice-generals-validation.service';

export const PROCUREMENT_INVOICE_GENERALS_ENTITY_INFO = ProcurementCommonGeneralsEntityInfo.create({
	permissionUuid: 'b6f91e1d615d4501a546e1e999fe6153',
	formUuid: '81d1f21fed6f47ae82d1ed8abe850142',
	dataServiceToken: ProcurementInvoiceGeneralsDataService,
	validationServiceToken: ProcurementInvoiceGeneralsValidationService,
	moduleSubModule: 'Procurement.Invoice',
	typeName: 'InvGeneralsDto'

});