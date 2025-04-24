/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { ServicesSchedulerUIJobDataService } from '../services/services-scheduler-uijob-data.service';
import { ServicesSchedulerUIJobBehavior } from '../behaviors/services-scheduler-uijob-behavior.service';
import { ServicesSchedulerUITaskTypeLookupService } from '../services/lookup/services-scheduler-ui-task-type-lookup.service';

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType, createLookup } from '@libs/ui/common';

import { ISchedulerUITaskTypeLookup } from './entities/scheduler-ui-task-type-lookup.interface';
import { IJobEntity } from './entities/job-entity.interface';

import { JobStateValues } from './values/services-schedulerui-jobstate-values';
import { RepeatUnitValues } from './values/services-schedulerui-jobs-repeat-unit-values';
import { PriorityValues } from './values/services-schedulerui-jobs-priority-values';
import { LogLevelValues } from './values/services-schedulerui-jobs-log-level-values';
import { ServicesSchedulerUIJobDetailBehavior } from '../behaviors/services-scheduler-uijob-detail-behavior.service';

export const SERVICES_SCHEDULER_UIJOB_ENTITY_INFO: EntityInfo = EntityInfo.create<IJobEntity>({
	grid: {
		title: { key: 'services.schedulerui.jobListContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ServicesSchedulerUIJobBehavior),
	},
	form: {
		title: { key: 'services.schedulerui' + '.jobDetailContainerTitle' },
		containerUuid: '1587d52539e346e89cffaaea211ab644',
		behavior: (ctx) => ctx.injector.get(ServicesSchedulerUIJobDetailBehavior),
	},
	dataService: (ctx) => ctx.injector.get(ServicesSchedulerUIJobDataService),
	dtoSchemeId: { moduleSubModule: 'Services.Schedulerui', typeName: 'JobDto' },
	permissionUuid: '77f863ec4d5748d2a534addd53ecfc50',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data',
				},
				attributes: [
					'Name',
					'JobState',
					'StartTime',
					'ExecutionStartTime',
					'TaskType',
					'RepeatUnit',
					'RepeatCount',
					'LoggingLevel',
					'KeepDuration',
					'KeepCount',
					'ExecutionMachine',
					'Description',
					'ExecutionEndTime',
					'Log',
					'Parameter',
					'Priority',
					'RunInUserContext',
				],
			},
		],
		labels: {
			...prefixAllTranslationKeys('services.schedulerui.columns.', {
				Name: {
					key: 'name',
				},
				JobState: {
					key: 'jobstate',
				},
				StartTime: {
					key: 'starttime',
				},
				ExecutionStartTime: {
					key: 'executionstarttime',
				},
				TaskType: {
					key: 'tasktype',
				},
				RepeatUnit: {
					key: 'repeatunit',
				},
				RepeatCount: {
					key: 'repeatcount',
				},
				LoggingLevel: {
					key: 'logginglevel',
				},
				KeepDuration: {
					key: 'keepduration',
				},
				KeepCount: {
					key: 'keepcount',
				},
				ExecutionMachine: {
					key: 'executionmachine',
				},
				Description: {
					key: 'description',
				},
				ExecutionEndTime: {
					key: 'executionendtime',
				},
				Log: {
					key: 'log',
				},
				Parameter: {
					key: 'parameter',
				},
				Priority: {
					key: 'priority',
				},
				RunInUserContext: {
					key: 'runinusercontext',
				},
			}),
		},
		overloads: {
			Name: {
				type: FieldType.Description,
				readonly: true,
				//ToDO: Need to add formatter function
				//formatter: function (row, cell, value, columnDef, dataContext)
			},
			JobState: {
				grid: {
					type: FieldType.Select,
					readonly: true,
					itemsSource: {
						items: JobStateValues,
					},
				},
				//TODO: Need to add formatter function
				//formatter: function (row, cell, value, columnDef, dataContext)
			},
			RepeatUnit: {
				type: FieldType.Select,
				itemsSource: {
					items: RepeatUnitValues,
				},
			},
			Priority: {
				type: FieldType.Select,
				itemsSource: {
					items: PriorityValues,
				},
			},
			LoggingLevel: {
				type: FieldType.Select,
				itemsSource: {
					items: LogLevelValues,
				},
			},
			ExecutionStartTime: {
				readonly: true,
			},
			ExecutionEndTime: {
				readonly: true,
			},
			TaskType: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ServicesSchedulerUITaskTypeLookupService,
					clientSideFilter: {
						execute(item: ISchedulerUITaskTypeLookup): boolean {
							return item.UiCreate === true;
						},
					},
				}),
			},
			ExecutionMachine: {
				readonly: true,
			},
			Parameter: {
				grid: {
					exclude: true,
				},
				form: {
					//TODO: Need to add Parameter in job
					//details form
					//once development complete for
					//ticket 6192
				},
			},

			Log: {
				//TODO:Need to add log field in form and grid.
				//dependes on ticket 6193
			},
		},
	},
});
