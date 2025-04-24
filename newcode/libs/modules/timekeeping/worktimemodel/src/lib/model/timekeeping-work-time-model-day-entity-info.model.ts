/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TimekeepingWorkTimeModelDayDataService } from '../services/timekeeping-work-time-model-day-data.service';
import { IWorkTimeModelDayEntity } from './entities/work-time-model-day-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { SchedulingCalendarWeekdayLookup } from '@libs/scheduling/shared';
import { TimekeepingWorkTimeModelDayValidationService } from '../services/timekeeping-work-time-model-day-validation.service';


export const TIMEKEEPING_WORK_TIME_MODEL_DAY_ENTITY_INFO: EntityInfo = EntityInfo.create<IWorkTimeModelDayEntity>({
	grid: {
		title: {key: 'timekeeping.worktimemodel.workTimeModelDayListTitle'},
	},
	form: {
		title: {key: 'timekeeping.worktimemodel.workTimeModelDayDetailTitle'},
		containerUuid: 'e31e2637059e41d4a32856fb2126bdd5',
	},
	dataService: ctx => ctx.injector.get(TimekeepingWorkTimeModelDayDataService),
	validationService:  ctx => ctx.injector.get(TimekeepingWorkTimeModelDayValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.WorkTimeModel', typeName: 'WorkTimeModelDayDto'},
	permissionUuid: '2c97189d84574b82a555e20301529c1c',
	layoutConfiguration: {
		groups: [
			//TODO TargetHours not editable
			{gid: 'default', attributes: [ 'ValidFrom', 'TargetHours', 'WeekDayIndex']},],
		overloads: {
			WeekDayIndex: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SchedulingCalendarWeekdayLookup
				}),
				additionalFields: [
					{
						displayMember: 'DescriptionInfo',
						label: {
							key: 'timekeeping.worktimemodel.entityWeekEndsOnDescription',
						},
						column: true,
						singleRow: true
					}
				]
			},
		},
		labels: {
			...prefixAllTranslationKeys('timekeeping.worktimemodel.', {
				TargetHours: {key: 'entityTargetHours'},
				ValidFrom: {key: 'entityValidFrom'},
				WeekDayIndex: {key: 'entityWeekDayIndex'},

			})
		}
	},
});