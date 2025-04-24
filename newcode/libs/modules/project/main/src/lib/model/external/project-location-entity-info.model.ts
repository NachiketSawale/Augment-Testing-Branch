/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectLocationDataService, ProjectLocationBehavior } from '@libs/project/shared';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IGridTreeConfiguration } from '@libs/ui/common';


export const PROJECT_LOCATION_ENTITY_INFO = EntityInfo.create<IProjectLocationEntity>({
	grid: {
		title: {key:'project.location.listContainerTitle'},
		behavior: ctx => ctx.injector.get(ProjectLocationBehavior),
		treeConfiguration: ctx => {
			return {
				parent: function (entity: IProjectLocationEntity) {
					const service = ctx.injector.get(ProjectLocationDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IProjectLocationEntity) {
					const service = ctx.injector.get(ProjectLocationDataService);
					return service.childrenOf(entity);
				}
			} as IGridTreeConfiguration<IProjectLocationEntity>;
		}
	},
	form: {
		title: {key:'project.location.detailContainerTitle' },
		containerUuid:'33761e17bfb84451bd226bf2882bc11d'
	},
	dtoSchemeId: {
		moduleSubModule: 'Project.Location',
		typeName: 'LocationDto'
	},
	permissionUuid: '42ff27d7f0ea40eaba389d669be3a1df',
	dataService: ctx => ctx.injector.get(ProjectLocationDataService),
	layoutConfiguration: {
		groups: [{
			gid: 'baseGroup',
			attributes: ['Code', 'DescriptionInfo', 'QuantityPercent', 'Sorting', 'ExternalCode']
		}],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				QuantityPercent: { key: 'entityPercent' },
			}),
			...prefixAllTranslationKeys('project.location.', {
				ExternalCode: { key: 'externalCode' },
			})
		}
	}
});
