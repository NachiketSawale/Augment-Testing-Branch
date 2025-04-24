/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStructuresSortcode02DataService } from '@libs/project/structures';
import { ISortCode02Entity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const PROJECT_STRUCTURES_SORTCODE02_ENTITY_INFO: EntityInfo =
	EntityInfo.create<ISortCode02Entity>({
		grid: {
			title: { key: 'sortCode02List' },
		},
		form: {
			title: { key: 'project.structures' + '.sortCode02Details' },
			containerUuid: '77058c67284b412e92a65bfab55f8beb',
		},
		dataService: (ctx) =>
			ctx.injector.get(ProjectStructuresSortcode02DataService),
		dtoSchemeId: {
			moduleSubModule: 'Project.Structures',
			typeName: 'SortCode02Dto',
		},
		permissionUuid: '8a747d2e83ab42ed8c918f9840af2b2e',
		layoutConfiguration: {
			groups: [{ gid: 'baseGroup', attributes: ['Code', 'DescriptionInfo'] }],
			overloads: {

			},
			labels: {
				...prefixAllTranslationKeys('project.structures.', {

				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: { key: 'entityDescription' },
					Code: { key: 'entityCode' },
				}),
			},
		},
	});
