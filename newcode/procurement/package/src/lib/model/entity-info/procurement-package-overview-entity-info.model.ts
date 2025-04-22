import { ProcurementCommonOverviewEntityInfo } from '@libs/procurement/common';
import { ProcurementPackageOverviewDataService } from '../../services/procurement-package-overview-data.service';

export const PROCUREMENT_PACKAGE_OVERVIEW_ENTITY_INFO = ProcurementCommonOverviewEntityInfo.create({
	permissionUuid: 'D0744D56872147899ED68B3533DF8442',
	dataServiceToken: ProcurementPackageOverviewDataService,
});
