/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStructuresSortcode05DataService } from '@libs/project/structures';
import { ISortCode05Entity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const PROJECT_STRUCTURES_SORTCODE05_ENTITY_INFO: EntityInfo =
	EntityInfo.create<ISortCode05Entity>({
		grid: {
			title: { key: 'sortCode05List' },

		},
		form: {
			title: { key: 'project.structures' + '.sortCode05Details' },
			containerUuid: 'e5c93bd4eba44faeb922d79718f9d69e',
		},
		dataService: (ctx) =>
			ctx.injector.get(ProjectStructuresSortcode05DataService),
		dtoSchemeId: {
			moduleSubModule: 'Project.Structures',
			typeName: 'SortCode05Dto',
		},
		permissionUuid: '5d796e309aeb45318236d806a34f0028',
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
