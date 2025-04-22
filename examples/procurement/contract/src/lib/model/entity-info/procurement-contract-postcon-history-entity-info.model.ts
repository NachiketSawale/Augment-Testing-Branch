/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedPostConHistoryEntityInfo } from '@libs/basics/shared';
import { ProcurementContractPostConHistoryDataService } from '../../services/procurement-contract-postcon-history-data.service';
import { ProcurementContractPostConHistoryBehavior } from '../../behaviors/procurement-contract-postcon-history-behavior.service';

export const PROCUREMENT_CONTRACT_POST_CON_HISTORY_ENTITY_INFO= BasicsSharedPostConHistoryEntityInfo.create({
	permissionUuid: '7255830deaab4be180657d0bceb05bdd',
	formUuid: '5460b6c4365343dd92a8ddd0c1331520',
	dataServiceToken: ProcurementContractPostConHistoryDataService,
	behaviorGrid: ProcurementContractPostConHistoryBehavior,
});