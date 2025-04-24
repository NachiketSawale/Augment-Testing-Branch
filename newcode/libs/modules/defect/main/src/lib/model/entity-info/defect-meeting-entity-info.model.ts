/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMeetingSection } from '@libs/basics/interfaces';
import { BasicsSharedLink2MeetingEntityInfoFactory } from '@libs/basics/shared';
import { DefectMainHeaderDataService } from '../../services/defect-main-header-data.service';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { DefectMainComplete } from '../defect-main-complete.class';

export const DEFECT_MEETING_ENTITY_INFO: EntityInfo = BasicsSharedLink2MeetingEntityInfoFactory.create<IDfmDefectEntity, DefectMainComplete>({
	permissionUuid: '6f89ce4b413fd47b29e0ec49a0ab6785',
	formContainerUuid: 'ad3844c5fd994d1db22e507f7c36a481',
	sectionId: BasicsMeetingSection.Defect,
	isParentFn: (pt, t) => pt.Id === t.DefectFk,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(DefectMainHeaderDataService);
	},
	isParentReadonlyFn: (parentService) => {
		const service = parentService as DefectMainHeaderDataService;
		return service.getReadonlyStatus();
	},
});
