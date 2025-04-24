/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStockLocationBehavior, ProjectStockLocationDataService, ProjectStockLocationValidationService } from '@libs/project/stock';
import { IProjectStockLocationEntity } from '@libs/project/interfaces';
import { IInitializationContext } from '@libs/platform/common';
import { IGridTreeConfiguration } from '@libs/ui/common';


export const projectStockLocationEntityInfo: EntityInfo = EntityInfo.create<IProjectStockLocationEntity>({
	grid: {
		title: {key: 'project.stock.stockLocationListContainerTitle'},
		behavior: (ctx: IInitializationContext )=> ctx.injector.get(ProjectStockLocationBehavior),
		treeConfiguration: ctx => {
			return {
				parent: function (entity: IProjectStockLocationEntity) {
					const service = ctx.injector.get(ProjectStockLocationDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IProjectStockLocationEntity) {
					const service = ctx.injector.get(ProjectStockLocationDataService);
					return service.childrenOf(entity);
				}
			} as IGridTreeConfiguration<IProjectStockLocationEntity>;
		}
	},
	form: {
		title: {key: 'project.stock.stockLocationDetailContainerTitle'},
		containerUuid: '90b9dd6abb7c40c1b4f8f17d8919ac88',
	},
	dataService: (ctx: IInitializationContext) => ctx.injector.get(ProjectStockLocationDataService),
	validationService:(ctx: IInitializationContext) => ctx.injector.get(ProjectStockLocationValidationService),
	dtoSchemeId: {moduleSubModule: 'Project.Stock', typeName: 'ProjectStockLocationDto'},
	permissionUuid: '55f6ac464f67460882c719f035091290',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['Code', 'DescriptionInfo'],
			}
		],
	},
});