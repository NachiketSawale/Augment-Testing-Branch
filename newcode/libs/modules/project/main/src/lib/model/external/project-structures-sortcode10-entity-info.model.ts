/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ISortCode10Entity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectStructuresSortcode10DataService } from '@libs/project/structures';

export const PROJECT_STRUCTURES_SORTCODE10_ENTITY_INFO: EntityInfo =
	EntityInfo.create<ISortCode10Entity>({
		grid: {
			title: { key: 'sortCode10List' }
		},
		form: {
			title: { key: 'project.structures' + '.sortCode10Details' },
			containerUuid: '9e2d856e32cf4e4aa36a79f29b1ce59f',
		},
		dataService: (ctx) =>
			ctx.injector.get(ProjectStructuresSortcode10DataService),
		dtoSchemeId: {
			moduleSubModule: 'Project.Structures',
			typeName: 'SortCode10Dto',
		},
		permissionUuid: '138e7d85bbc141a29501b08ec1e3d92e',
		layoutConfiguration: {
			groups: [{ gid: 'baseGroup', attributes: ['Code', 'DescriptionInfo'] }],
			overloads: {},
			labels: {
				...prefixAllTranslationKeys('project.structures.', {}),
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: { key: 'entityDescription' },
					Code: { key: 'entityCode' },
				}),
			},
		},
	});
