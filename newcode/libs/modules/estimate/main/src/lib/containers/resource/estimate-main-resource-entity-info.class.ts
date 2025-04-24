/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { EstimateMainResourceService } from './estimate-main-resource-data.service';
import { EstimateMainResourceLayoutService } from './estimate-main-resource-layout.service';
import { EstimateMainResourceBehaviorService } from './estimate-main-resource-behavior.service';

/**
 * Estimate Resource Entity Info
 */
export const ESTIMATE_RESOURCE_ENTITY_INFO = EntityInfo.create<IEstResourceEntity>({
	grid: {
		title: { text: 'Resources', key: 'estimate.main.resourceContainer' },
		containerUuid: 'bedd392f0e2a44c8a294df34b1f9ce44',
		treeConfiguration: ctx => {
			return {
				parent: function (entity: IEstResourceEntity) {
					const service = ctx.injector.get(EstimateMainResourceService);
					return service.parentOf(entity);
				},
				children: function (entity: IEstResourceEntity) {
					const service = ctx.injector.get(EstimateMainResourceService);
					return service.childrenOf(entity);
				}
			} as IGridTreeConfiguration<IEstResourceEntity>;
		}
	},
	form: {
		containerUuid: '9ddb004429ab4d58a8e778eecaa877db',
		title: { text: 'Resource Details', key: 'estimate.main.resourceDetailContainer' },
	},
	dataService: ctx => ctx.injector.get(EstimateMainResourceService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstResourceDto' },
	permissionUuid: '681223e37d524ce0b9bfa2294e18d650',
	layoutConfiguration: context => {
		return context.injector.get(EstimateMainResourceLayoutService).generateLayout();
	},
	containerBehavior:ctx => ctx.injector.get(EstimateMainResourceBehaviorService)
});