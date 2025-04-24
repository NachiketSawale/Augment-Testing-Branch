/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemMainJobDataService } from '../../services/construction-system-main-job-data.service';
import { ConstructionSystemMainJobGridBehavior } from '../../behaviors/construction-system-main-job-grid-behavior.service';
import { ICosJobEntity } from '../entities/cos-job-entity.interface';
import { ConstructionSystemMainJobListLayoutService } from '../../services/layouts/construction-system-main-job-list-layout.service';
import { ConstructionSystemMainJobDetailComponent } from '../../components/job-detail/job-detail.component';

export const CONSTRUCTION_SYSTEM_MAIN_JOB_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosJobEntity>({
	grid: {
		title: { key: 'constructionsystem.main.JobListContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ConstructionSystemMainJobGridBehavior),
	},
	form: {
		title: { key: 'constructionsystem.main.JobDetailContainerTitle' },
		containerUuid: 'd82ba7fd72074234bfe557aea29a2a17',
		containerType: ConstructionSystemMainJobDetailComponent,
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMainJobDataService),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Main', typeName: 'CosJobDto' },
	permissionUuid: '269814dc59664536bfec35409c9852a1',
	layoutConfiguration: (context) => {
		return context.injector.get(ConstructionSystemMainJobListLayoutService).generateLayout();
	},
});
