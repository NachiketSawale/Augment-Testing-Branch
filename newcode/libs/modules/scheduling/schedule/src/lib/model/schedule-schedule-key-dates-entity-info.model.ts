/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ITimelineEntity } from '../model/entities/timeline-entity.interface';
import { SchedulingScheduleKeyDatesDataService } from './services/scheduling-schedule-key-dates-data.service';

export const SchedulingScheduleKeyDatesEntityInfo: EntityInfo = EntityInfo.create<ITimelineEntity> ({
	grid: {
		title: {key: 'scheduling.schedule' + '.entityTimeline'},
		containerUuid: 'c52d50394a4945c587540467798a2c6f',
	},
	form: {
		title: { key: 'scheduling.schedule' + '.entityDetailTimeline' },
		containerUuid: '7F2C6C99ACB84BA8B1D455C2ACF93051',
	},
	dataService: ctx => ctx.injector.get(SchedulingScheduleKeyDatesDataService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Schedule', typeName: 'TimelineDto'},
	permissionUuid: '7447B8DF191C45118F56DD84D25D1B41',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['Color', 'Date', 'IsActive', 'Remark','Text']
			}
		],
		overloads: {},
		labels: {
			...prefixAllTranslationKeys('scheduling.schedule.', {
				Color: {key:'entityColor'},
				IsActive: {key:'isactive'},
				Text: {key:'entityText'},
			})
		}
	}
});