/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedBillingSchemaEntityInfo } from '@libs/basics/shared';
import { ProcurementQuoteBillingSchemaDataService } from '../../services/quote-billing-schema-data.service';
import { ProcurementQuoteBillingSchemaBehavior } from '../../behaviors/quote-billing-schema-behavior.service';

export const QUOTE_BILLING_SCHEMA_ENTITY_INFO = BasicsSharedBillingSchemaEntityInfo.create({
	permissionUuid: '5627df6ded4242e48ae56e5163320a53',
	dataServiceToken: ProcurementQuoteBillingSchemaDataService,
	behavior: ProcurementQuoteBillingSchemaBehavior,
	projectFkGetter: mainEntity => mainEntity.ProjectFk,
});