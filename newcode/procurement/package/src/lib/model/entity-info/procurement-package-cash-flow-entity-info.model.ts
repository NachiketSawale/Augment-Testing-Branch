/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedCashFlowEntityInfo } from '@libs/basics/shared';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';

export const PROCUREMENT_PACKAGE_CASH_FLOW_ENTITY_INFO = BasicsSharedCashFlowEntityInfo.create<IPrcPackageEntity>({
	permissionUuid: 'ED80D937DC834BA18F916505C7E6CD6D',
	parentDataServiceToken: ProcurementPackageHeaderDataService,
	isParentFn: (pt, t) => pt.CashProjectionFk === t.CashProtectionFk,
	getCashProjectionId: (obj) => obj?.CashProjectionFk ?? null,
});
