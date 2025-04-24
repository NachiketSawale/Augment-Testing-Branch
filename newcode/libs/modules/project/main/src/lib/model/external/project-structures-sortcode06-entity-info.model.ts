/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStructuresSortcode06DataService } from '@libs/project/structures';
import { ISortCode06Entity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const PROJECT_STRUCTURES_SORTCODE06_ENTITY_INFO: EntityInfo =
	EntityInfo.create<ISortCode06Entity>({
		grid: {
			title: { key: 'sortCode06List' },
		},
		form: {
			title: { key: 'project.structures' + '.sortCode06Details' },
			containerUuid: '2ae50bf1b5074521a66f799b5b2db27b',
		},
		dataService: (ctx) =>
			ctx.injector.get(ProjectStructuresSortcode06DataService),
		dtoSchemeId: {
			moduleSubModule: 'Project.Structures',
			typeName: 'SortCode06Dto',
		},
		permissionUuid: 'bd4aebdaf1fe4a779bb2096946a918a5',
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
