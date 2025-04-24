/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStructuresSortcode04DataService } from '@libs/project/structures';
import { ISortCode04Entity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const PROJECT_STRUCTURES_SORTCODE04_ENTITY_INFO: EntityInfo =
	EntityInfo.create<ISortCode04Entity>({
		grid: {
			title: { key: 'sortCode04List' },
		},
		form: {
			title: { key: 'project.structures' + '.sortCode04Details' },
			containerUuid: 'b47caaaecb014b9cabbbcc547eeb83f8',
		},
		dataService: (ctx) =>
			ctx.injector.get(ProjectStructuresSortcode04DataService),
		dtoSchemeId: {
			moduleSubModule: 'Project.Structures',
			typeName: 'SortCode04Dto',
		},
		permissionUuid: '4232f7b7aa174dc9b9b1cbfb2d92e61b',
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
