/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStructuresSortcode07DataService } from '@libs/project/structures';
import { ISortCode07Entity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const PROJECT_STRUCTURES_SORTCODE07_ENTITY_INFO: EntityInfo =
	EntityInfo.create<ISortCode07Entity>({
		grid: {
			title: { key: 'sortCode07List' },
		},
		form: {
			title: { key: 'project.structures' + '.sortCode07Details' },
			containerUuid: 'b788d63109d040ceb43615efaaf050a7',
		},
		dataService: (ctx) =>
			ctx.injector.get(ProjectStructuresSortcode07DataService),
		dtoSchemeId: {
			moduleSubModule: 'Project.Structures',
			typeName: 'SortCode07Dto',
		},
		permissionUuid: '76cf8afdfef64049b7820423d83c24c5',
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
