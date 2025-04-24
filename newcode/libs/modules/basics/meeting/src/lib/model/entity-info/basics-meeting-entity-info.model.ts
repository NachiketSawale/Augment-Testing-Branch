/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BASICS_MEETING_BEHAVIOR_TOKEN } from '../../behaviors/basics-meeting-behavior.service';
import { BasicsMeetingDataService } from '../../services/basics-meeting-data.service';
import { BasicsSharedMeetingLayoutService, BasicsSharedMeetingStatusLookupService, BasicsSharedMeetingTypeLookupService, BasicsSharedNumberGenerationService } from '@libs/basics/shared';
import { IMtgHeaderEntity } from '@libs/basics/interfaces';
import { BasicsMeetingValidationService } from '../../services/validations/basics-meeting-validation.service';

export const BASICS_MEETING_ENTITY_INFO: EntityInfo = EntityInfo.create<IMtgHeaderEntity>({
	grid: {
		title: { key: 'basics.meeting' + '.entityMeetingTitle' },
		behavior: BASICS_MEETING_BEHAVIOR_TOKEN,
	},
	form: {
		containerUuid: '6457E5D68CA64A00A34D0E83E935773F',
		title: { text: 'Meeting Details', key: 'basics.meeting.entityMeetingDetailTitle' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsMeetingDataService),
	validationService: (ctx) => ctx.injector.get(BasicsMeetingValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.Meeting', typeName: 'MtgHeaderDto' },
	permissionUuid: '32e3c17bcd3f40d29772070f69e563c7',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsSharedMeetingLayoutService).generateLayout();
	},
	prepareEntityContainer: async (ctx) => {
		const statusService = ctx.injector.get(BasicsSharedMeetingStatusLookupService);
		const typeService = ctx.injector.get(BasicsSharedMeetingTypeLookupService);
		const prcNumGenSrv = ctx.injector.get(BasicsSharedNumberGenerationService);
		await Promise.all([statusService.getList(), typeService.getList(), prcNumGenSrv.getNumberGenerateConfig('basics/meeting/numbergeneration')]);
	},
});
