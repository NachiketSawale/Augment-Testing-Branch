/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStructuresSortcode03DataService } from '@libs/project/structures';
import { ISortCode03Entity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const PROJECT_STRUCTURES_SORTCODE03_ENTITY_INFO: EntityInfo =
	EntityInfo.create<ISortCode03Entity>({
		grid: {
			title: { key: 'sortCode03List' },
		},
		form: {
			title: { key: 'project.structures' + '.sortCode03Details' },
			containerUuid: '67f570d0ac7c4ee7b0049f7bd2069eaa',
		},
		dataService: (ctx) =>
			ctx.injector.get(ProjectStructuresSortcode03DataService),
		dtoSchemeId: {
			moduleSubModule: 'Project.Structures',
			typeName: 'SortCode03Dto',
		},
		permissionUuid: '8b8070460f8c477382a3f4ca0eccecf0',
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
