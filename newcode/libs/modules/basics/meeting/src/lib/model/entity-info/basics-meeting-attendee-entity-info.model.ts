/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMeetingAttendeeDataService } from '../../services/basics-meeting-attendee-data.service';
import { IMtgAttendeeEntity } from '@libs/basics/interfaces';
import { BasicsMeetingAttendeeLayoutService } from '../../services/layouts/basics-meeting-attendee-layout.service';
import { BasicsMeetingAttendeeValidationService } from '../../services/validations/basics-meeting-attendee-validation.service';

export const BASICS_MEETING_ATTENDEE_ENTITY_INFO: EntityInfo = EntityInfo.create<IMtgAttendeeEntity>({
	grid: {
		title: { key: 'basics.meeting' + '.attendeeTitle' },
	},
	form: {
		containerUuid: 'bb7dd4434019422fba91ff89d53a5e7a',
		title: { text: 'Attendee Details', key: 'basics.meeting.attendeeDetailTitle' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsMeetingAttendeeDataService),
	validationService: (ctx) => ctx.injector.get(BasicsMeetingAttendeeValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.Meeting', typeName: 'MtgAttendeeDto' },
	permissionUuid: '58ed4703a9e242e8a2dae2e6a823a822',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsMeetingAttendeeLayoutService).generateLayout();
	},
});
