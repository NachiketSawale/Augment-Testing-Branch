import { RequisitionSuggestedBidderDataService } from '../../services/requisition-suggested-bidder-data.service';
import { ReqSuggestedBidderBehavior } from '../../behaviors/req-suggested-bidder-behavior.service';
import { ProcurementCommonSuggestBidderEntityInfo } from '@libs/procurement/common';

const config = {
	permissionUuid: 'df5c94984af84ff49c7310eac5e25fff',
	formUuid: '429170ac0eaf4822a56bda7d21d1480f',
	dataServiceToken: RequisitionSuggestedBidderDataService,
	behavior: ReqSuggestedBidderBehavior,
};

export const REQ_COMMON_SUGGESTED_BIDDERS_INFO = ProcurementCommonSuggestBidderEntityInfo.create(config);
