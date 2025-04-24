/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedSatusHistoryEntityInfo } from '@libs/basics/shared';
import { ProcurementPackageStatusHistoryDataService } from '../../services/procurement-package-status-history-data.service';

export const PROCUREMENT_PACKAGE_STATUS_HISTORY_ENTITY_INFO = BasicsSharedSatusHistoryEntityInfo.create({
	dataServiceToken: ProcurementPackageStatusHistoryDataService,
});