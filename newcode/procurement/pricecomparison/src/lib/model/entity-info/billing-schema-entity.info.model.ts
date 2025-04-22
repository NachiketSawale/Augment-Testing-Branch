/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedBillingSchemaEntityInfo } from '@libs/basics/shared';
import { ProcurementPriceComparisonBillingSchemaDataService } from '../../services/billing-schema-data.service';
import { ProcurementPriceComparisonBillingSchemaBehavior } from '../../behaviors/billing-schema-behavior.service';

export const PRICE_COMPARISON_BILLING_SCHEMA_ENTITY_INFO = BasicsSharedBillingSchemaEntityInfo.create({
	permissionUuid: '5627df6ded4242e48ae56e5163320a53',
	dataServiceToken: ProcurementPriceComparisonBillingSchemaDataService,
	behavior: ProcurementPriceComparisonBillingSchemaBehavior,
	//NO project fk for price comparison item return null here
	projectFkGetter: mainEntity => null,
});