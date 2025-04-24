/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IInitializationContext } from '@libs/platform/common';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { IActivityEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainBehaviorService } from '../behaviors/scheduling-main-behavior.service';
import { SchedulingMainDataService } from '../services/scheduling-main-data.service';
import { SCHEDULING_MAIN_ACTIVITY_LAYOUT } from './scheduling-main-activity-layout.model';
import { SchedulingMainActivityDragDropService } from '../services/drag-drop/scheduling-main-activity-drag-drop.service';
import { ActivityValidationService } from '../services/validations/activity-validation.service';

export const ACTIVITY_MODEL_ENTITY_INFO: EntityInfo = EntityInfo.create<IActivityEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.hierachicalActivities'},
		behavior: (ctx: IInitializationContext) => ctx.injector.get(SchedulingMainBehaviorService),
		treeConfiguration: ctx => {
			return {
				parent: function (entity: IActivityEntity) {
					const service = ctx.injector.get(SchedulingMainDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IActivityEntity) {
					const service = ctx.injector.get(SchedulingMainDataService);
					return service.childrenOf(entity);
				},
			} as IGridTreeConfiguration<IActivityEntity>;
		},
	},
	form: {
		title: {key: 'scheduling.main' + '.activitydetails'},
		containerUuid: '0b1f0e40da664e4a8081fe8fa6111403',
	},
	dataService: ctx => ctx.injector.get(SchedulingMainDataService),
	dragDropService:  ctx => ctx.injector.get(SchedulingMainActivityDragDropService),
	validationService:  ctx => ctx.injector.get(ActivityValidationService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'ActivityDto'},
	permissionUuid: '0fcbaf8c89ac4493b58695cfa9f104e2',
	layoutConfiguration: SCHEDULING_MAIN_ACTIVITY_LAYOUT
});