/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TimekeepingWorkTimeModelDataService } from '../services/timekeeping-work-time-model-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IWorkTimeModelEntity } from './entities/work-time-model-entity.interface';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { SchedulingCalendarWeekdayLookup } from '@libs/scheduling/shared';
import { WORK_TIME_MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';
import { TimekeepingWorkTimeModelValidationService } from '../services/timekeeping-work-time-model-validation.service';


export const TIMEKEEPING_WORK_TIME_MODEL_ENTITY_INFO: EntityInfo = EntityInfo.create<IWorkTimeModelEntity>({
	grid: {
		title: {key: 'timekeeping.worktimemodel.workTimeModelListTitle'},
	},
	form: {
		title: {key: 'timekeeping.worktimemodel.workTimeModelDetailTitle'},
		containerUuid: 'ad495e8fb0ff4cf09296789ee58fd6af',
	},
	dataService: ctx => ctx.injector.get(TimekeepingWorkTimeModelDataService),
	validationService: ctx => ctx.injector.get(TimekeepingWorkTimeModelValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.WorkTimeModel', typeName: 'WorkTimeModelDto'},
	permissionUuid: '990a46ae64d74fa4ae226a74730c5ccf',
	layoutConfiguration: async ctx=> {
		const timekeepingWorkTimeModelFbLookupProvider = await ctx.lazyInjector.inject(WORK_TIME_MODEL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IWorkTimeModelEntity>>{
			groups: [
				{gid: 'default', attributes: ['IsDefault', 'DescriptionInfo', 'Sorting', 'WeekEndsOn', 'CommentText', 'Isstatussensitive', 'VactionYearStart', 'VactionExpiryDate', 'IsFallback', 'WorkingTimeModelFbFk']},],
			overloads: {
				WeekEndsOn: {
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
				WorkingTimeModelFbFk: timekeepingWorkTimeModelFbLookupProvider.generateWorkTimeModelLookup({
					IsFallback: true
				})
			},
			labels: {
				...prefixAllTranslationKeys('timekeeping.worktimemodel.', {
					IsFallback: {key: 'entityisfallback'},
					WeekEndsOn: {key: 'entityWeekEndsOn'},
					CommentText: {key: 'entityCommentText'},
					Isstatussensitive: {key: 'entityIsstatussensitive'},
					VactionExpiryDate: {key: 'entityVactionExpiryDate'},
					VactionYearStart: {key: 'entityVactionYearStart'},
					WorkingTimeModelFbFk: {key: 'entityworkingtimemodelfbfk'}
				})
			}
		};
	}
});