/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedBillingSchemaEntityInfo } from '@libs/basics/shared';
import { ProcurementPesBillingSchemaBehavior } from '../../behaviors/procurement-pes-billing-schema-behavior.service';
import { ProcurementPesBillingSchemaDataService } from '../../services/procurement-pes-billing-schema-data.service';

export const PROCUREMENT_PES_BILLING_SCHEMA_ENTITY_INFO =BasicsSharedBillingSchemaEntityInfo.create({
	permissionUuid: '1874ebe007244248a77952dc2ebb3f4e',
	dataServiceToken: ProcurementPesBillingSchemaDataService,
	behavior:ProcurementPesBillingSchemaBehavior,
	projectFkGetter: mainEntity => mainEntity.ProjectFk,
});
