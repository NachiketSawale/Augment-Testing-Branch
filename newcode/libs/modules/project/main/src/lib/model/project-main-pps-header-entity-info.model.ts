/*
 * Copyright(c) RIB Software GmbH
 */

import { ProductionplanningSharedPpsHeaderEntityInfoFactory } from '@libs/productionplanning/shared';
import { IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
import { EntityInfo } from '@libs/ui/business-base';

export const PROJECT_MAIN_PPS_HEADER_ENTITY_INFO: EntityInfo = ProductionplanningSharedPpsHeaderEntityInfoFactory.create<IProjectEntity>({
	containerUuid: '66ed2d9c263c4ed694332ee7fb6744f1',
	formContainerUuid:'d79451397250476a96f666fb7dbd9ed2',
	permissionUuid: '66ed2d9c263c4ed694332ee7fb6744f1',
	foreignKey: 'PrjProjectFk',
	parentServiceFn: (ctx) => ctx.injector.get(ProjectMainDataService),
});

