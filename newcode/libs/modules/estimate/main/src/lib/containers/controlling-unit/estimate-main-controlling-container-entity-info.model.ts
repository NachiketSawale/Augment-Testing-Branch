/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EstimateMainControllingContainerBehavior } from './estimate-main-controlling-container-behavior.service';
import { EstimateMainControllingContainerDataService } from './estimate-main-controlling-container-data.service';
import { IControllingUnitEntity } from '@libs/basics/shared';
import { EstimateMainControllingUnitLayoutService } from './estimate-main-controlling-layout.service';
import { IGridTreeConfiguration } from '@libs/ui/common';



/**
 * @brief Entity information configuration for the Estimate Main Controlling Container.
 *
 * This constant configures various properties and services related to the
 * Estimate Main Controlling Container entity, including grid settings, data services,
 * and layout configurations.
 */
export const ESTIMATE_MAIN_CONTROLLING_CONTAINER_ENTITY_INFO: EntityInfo = EntityInfo.create<IControllingUnitEntity>({
	grid: {
		title: { key: 'estimate.main' + '.controllingContainer' },
		 behavior: (ctx) => ctx.injector.get(EstimateMainControllingContainerBehavior),

		treeConfiguration: (ctx) => {
			return {
				parent: function (entity: IControllingUnitEntity) {
					const service = ctx.injector.get(EstimateMainControllingContainerDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IControllingUnitEntity) {
					const service = ctx.injector.get(EstimateMainControllingContainerDataService);
					return service.childrenOf(entity);
				},
			} as IGridTreeConfiguration<IControllingUnitEntity>;
		},
	},

	dataService: (ctx) => ctx.injector.get(EstimateMainControllingContainerDataService),
	dtoSchemeId: { moduleSubModule: 'Controlling.Structure', typeName: 'ControllingUnitDto' },
	permissionUuid: '72E7C6850EEC42E9ACA9A0FD831CB7CC',

	layoutConfiguration: (context) => {
		return context.injector.get(EstimateMainControllingUnitLayoutService).generateConfig();
	},
});
