import { ProcurementCommonOverviewEntityInfo } from '@libs/procurement/common';
import { RequisitionOverviewDataService } from '../../services/requisition-overview-data.service';

export const PROCUREMENT_REQUISITION_OVERVIEW_ENTITY_INFO = ProcurementCommonOverviewEntityInfo.create({
	permissionUuid: '3B00687C0B074929931931A4B75A45DB',
	dataServiceToken: RequisitionOverviewDataService,
});
