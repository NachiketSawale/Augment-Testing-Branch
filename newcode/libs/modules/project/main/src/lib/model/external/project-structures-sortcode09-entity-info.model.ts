/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStructuresSortcode09DataService } from '@libs/project/structures';
import { ISortCode09Entity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const PROJECT_STRUCTURES_SORTCODE09_ENTITY_INFO: EntityInfo =
	EntityInfo.create<ISortCode09Entity>({
		grid: {
			title: { key: 'sortCode09List' }
		},
		form: {
			title: { key: 'project.structures' + '.sortCode09Details' },
			containerUuid: 'f38d7efcb775488191ed248bf121f52d',
		},
		dataService: (ctx) =>
			ctx.injector.get(ProjectStructuresSortcode09DataService),
		dtoSchemeId: {
			moduleSubModule: 'Project.Structures',
			typeName: 'SortCode09Dto',
		},
		permissionUuid: '7eb96a183423427c8427f809c658359b',
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