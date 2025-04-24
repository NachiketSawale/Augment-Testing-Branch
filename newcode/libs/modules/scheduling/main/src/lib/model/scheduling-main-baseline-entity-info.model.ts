/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IBaselineEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainBaselineDataService } from '../services/scheduling-main-baseline-data.service';

export const SCHEDULING_MAIN_BASELINE_ENTITY_INFO: EntityInfo = EntityInfo.create<IBaselineEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.baselineListTitle'},
		containerUuid: '74887808563a4d7b91ca70a4204d2b88',
	},
	form: {
		title: { key: 'scheduling.main' + '.detailBaseLineTitle' },
		containerUuid: '543ad8a521fe45cfa857bba39f822650',
	},
	dataService: ctx => ctx.injector.get(SchedulingMainBaselineDataService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'BaselineDto'},
	permissionUuid: '5fc7ccd1f42f4aa7b8b2edeb2bde9d96',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['Description','Remark']
			}
		],
		overloads: {
		},
		labels: {
		}
	}
});