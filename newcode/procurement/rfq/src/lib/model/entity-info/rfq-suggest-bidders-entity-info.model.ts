/*
 * Copyright(c) RIB Software GmbH
 */
import
{
	ProcurementCommonSuggestBidderEntityInfo
} from '@libs/procurement/common';
import { ProcurementRfqSuggestBidderDataService } from '../../services/rfq-suggest-bidders-data.service';
import { ProcurementRfqSuggestBidderBehavior } from '../../behaviors/rfq-suggest-bidder-behavior.service';

const config = {
	permissionUuid: '35f46630f52f45b4877f2028716186f2',
	formUuid: '8750652dd0e5460d81ec0757f63d8144',
	dataServiceToken: ProcurementRfqSuggestBidderDataService,
	behavior: ProcurementRfqSuggestBidderBehavior,
};
export const RFQ_COMMON_SUGGESTED_BIDDERS_INFO = ProcurementCommonSuggestBidderEntityInfo.create(config);