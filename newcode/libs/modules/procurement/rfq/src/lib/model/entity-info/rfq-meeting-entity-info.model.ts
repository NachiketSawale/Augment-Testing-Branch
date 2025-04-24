/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMeetingSection } from '@libs/basics/interfaces';
import { BasicsSharedLink2MeetingEntityInfoFactory } from '@libs/basics/shared';
import { ProcurementRfqHeaderMainDataService } from '../../services/procurement-rfq-header-main-data.service';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';

export const RFQ_MEETING_ENTITY_INFO: EntityInfo = BasicsSharedLink2MeetingEntityInfoFactory.create<IRfqHeaderEntity>({
	permissionUuid: '33673f7dab934a52b285775f96023f43',
	formContainerUuid: '417c44f1960e41fe8923d92a3ba42a74',
	sectionId: BasicsMeetingSection.RfQ,
	isParentFn: (pt, t) => pt.Id === t.RfqHeaderFk,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementRfqHeaderMainDataService);
	},
	isParentReadonlyFn: (parentService) => {
		const service = parentService as ProcurementRfqHeaderMainDataService;
		return service.isEntityReadonly();
	},
});
