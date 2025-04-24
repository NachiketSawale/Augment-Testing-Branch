/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { UsermanagementGroupLogDataService } from '../services/usermanagement-group-log-data.service';
import { IJobEntity } from './entities/job-entity.interface';
import { EntityInfo } from '@libs/ui/business-base';

/**
 * Usermanagement Group Log info model class
 */
export const USERMANAGEMENT_GROUP_LOG_ENTITY_INFO: EntityInfo = EntityInfo.create<IJobEntity>({
	grid: {
		title: { key: 'usermanagement.group.logContainer.logContainerTitle' },
	},

	dataService: (ctx) => ctx.injector.get(UsermanagementGroupLogDataService),
	dtoSchemeId: { moduleSubModule: 'Services.Scheduler', typeName: 'JobDto' },
	permissionUuid: '3782c1e6085d409ebc01122159c2e462',
	layoutConfiguration:  {
		groups: [
			{
				gid: 'default-group',
				title: {
					text: 'Basic Data',
					key: 'cloud.common.entityProperties',
				},
				attributes: ['JobState', 'Name', 'StartTime', 'ExecutionStartTime', 'ExecutionEndTime', 'LoggingMessage'],
			}

		],
		labels: {
			...prefixAllTranslationKeys('usermanagement.group.', {
				JobState: {
					key: 'logContainer.jobstate',
				},
				Name: {
					key: 'groupName',
				},
				StartTime: {
					key: 'logContainer.starttime',
				},
				ExecutionStartTime: {
					key: 'logContainer.exstarttime',
				},
				ExecutionEndTime: {
					key: 'logContainer.exendtime',
				},
				LoggingMessage: {
					key: 'logContainer.log',
				},
			}),
		},
		overloads: {
			JobState: {
				readonly: true,
			},
			Name: {
				readonly: true,
			},
			StartTime: {
				readonly: true,
			},
			ExecutionStartTime: {
				readonly: true,
			},
			ExecutionEndTime: {
				readonly: true,
			},
			LoggingMessage: {
				readonly: true,
			},
		},
	},
});
