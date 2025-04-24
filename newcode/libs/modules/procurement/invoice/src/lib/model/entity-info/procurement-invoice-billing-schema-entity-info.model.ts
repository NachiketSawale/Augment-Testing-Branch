/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedBillingSchemaEntityInfo } from '@libs/basics/shared';
import { ProcurementInvoiceBillingSchemaDataService } from '../../services/procurement-invoice-billing-schema-data.service';

export const PROCUREMENT_INVOICE_BILLING_SCHEMA_ENTITY_INFO =BasicsSharedBillingSchemaEntityInfo.create({
	permissionUuid: '1ec2793fb7854c209eb128810298fa89',
	dataServiceToken: ProcurementInvoiceBillingSchemaDataService,
	projectFkGetter: mainEntity => mainEntity.ProjectFk,
});
