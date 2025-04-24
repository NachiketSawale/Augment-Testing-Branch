/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStructuresSortcode08DataService } from '@libs/project/structures';
import { ISortCode08Entity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const PROJECT_STRUCTURES_SORTCODE08_ENTITY_INFO: EntityInfo =
	EntityInfo.create<ISortCode08Entity>({
		grid: {
			title: { key: 'sortCode08List' },
		},
		form: {
			title: { key: 'project.structures' + '.sortCode08Details' },
			containerUuid: 'f4055b7677cb48609b5346cf1c52c480',
		},
		dataService: (ctx) =>
			ctx.injector.get(ProjectStructuresSortcode08DataService),
		dtoSchemeId: {
			moduleSubModule: 'Project.Structures',
			typeName: 'SortCode08Dto',
		},
		permissionUuid: '3a86e227a1d245148a04d0da26162ac4',
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
