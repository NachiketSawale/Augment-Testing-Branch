/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { EstimateMainLocationDataService } from './estimate-main-location-data.service';
import { EstimateMainLocationLayoutService } from './estimate-main-location-layout.service';

/**
 * @brief Configuration information for the Estimate Location entity.
 */
export const ESTIMATE_LOCATION_ENTITY_INFO = EntityInfo.create<IProjectLocationEntity>({
	grid: {
		title: {key:'estimate.main.locationContainer'},
		treeConfiguration: ctx => {
			return {
				parent: function (entity: IProjectLocationEntity) {
					const service = ctx.injector.get(EstimateMainLocationDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IProjectLocationEntity) {
					const service = ctx.injector.get(EstimateMainLocationDataService);
					return service.childrenOf(entity);
				}
			} as IGridTreeConfiguration<IProjectLocationEntity>;
		}
	},
    dtoSchemeId: {
		moduleSubModule: 'Project.Location',
		typeName: 'LocationDto'
	},
    permissionUuid: '1DD77E2E10B54F2392870A53FCB44982',
	dataService: ctx => ctx.injector.get(EstimateMainLocationDataService),

	layoutConfiguration: (context) => {
		return context.injector.get(EstimateMainLocationLayoutService).generateConfig();
	},

});