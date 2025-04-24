/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMeetingSection } from '@libs/basics/interfaces';
import { BasicsSharedLink2MeetingEntityInfoFactory } from '@libs/basics/shared';
import { HsqeChecklistDataService } from '../../services/hsqe-checklist-data.service';
import { IHsqCheckListEntity } from '@libs/hsqe/interfaces';

export const CHECKLIST_MEETING_ENTITY_INFO: EntityInfo = BasicsSharedLink2MeetingEntityInfoFactory.create<IHsqCheckListEntity>({
	permissionUuid: 'bd9639ffb81fdf4bc81825e3558e4d7c',
	formContainerUuid: '7249f87ff9bf4767a507956298bb98b6',
	sectionId: BasicsMeetingSection.CheckList,
	isParentFn: (pt, t) => pt.Id === t.CheckListFk,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(HsqeChecklistDataService);
	},
	isParentReadonlyFn: (parentService) => {
		const service = parentService as HsqeChecklistDataService;
		return service.isItemReadOnly();
	},
});
