/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IActivityObservationEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainObservationDataService } from '../services/scheduling-main-observation-data.service';
import { ILayoutConfiguration } from '@libs/ui/common';
import { SchedulingActivityLookupProviderService } from '../services/scheduling-activity-lookup-provider.service';

export const SCHEDULING_MAIN_OBSERVATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IActivityObservationEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.observationListTitle'},
	},
	form: {
		title: { key: 'scheduling.main' + '.observationDetailTitle' },
		containerUuid: '862d78af1fc44012bacc390290715b4a',
	},
	dataService: ctx => ctx.injector.get(SchedulingMainObservationDataService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'ActivityObservationDto'},
	permissionUuid: 'f49169c661b34fe8b73e41b4481de43c',

	layoutConfiguration: async ctx=> {
		const activityLookupProvider = ctx.injector.get(SchedulingActivityLookupProviderService);
		return <ILayoutConfiguration<IActivityObservationEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['ActivityObservedFk','Description', 'PlannedStart', 'PlannedFinish', 'PlannedDuration', 'ActualStart', 'ActualFinish', 'ActualDuration',  'CurrentStart','CurrentFinish','CurrentDuration',
						'ScheduleCode', 'ScheduleDescription', 'ProjectNo','ProjectName', 'CommentText']
				}
			],
			overloads: {
				ActivityObservedFk: activityLookupProvider.generateActivityLookup({
					showClearButton: true
				})
			},
			labels: {
				...prefixAllTranslationKeys('scheduling.main.', {
					ActivityObservedFk: {key:'activityObserved'},
					PlannedStart: {key:'plannedStart'},
					PlannedFinish: {key:'plannedFinish'},
					PlannedDuration: {key:'plannedDuration'},
					ActualStart: {key:'actualStart'},
					ActualFinish: {key:'actualFinish'},
					ActualDuration: {key:'actualDuration'},
					CurrentStart: {key:'currentStart'},
					CurrentFinish: {key:'currentFinish'},
					CurrentDuration: {key:'currentDuration'},
					ScheduleCode: {key:'scheduleCode'},
					ScheduleDescription: {key: 'scheduleDescription'},
					ProjectNo: {key:'projectNo'},
					ProjectName: {key:'projectName'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: {key: 'entityCommentText'}
				})
			}
		};
	}
});