/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStructuresSortcode01DataService } from '@libs/project/structures';

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ISortCode01Entity } from '@libs/project/interfaces';

export const PROJECT_STRUCTURES_SORTCODE01_ENTITY_INFO: EntityInfo =
	EntityInfo.create<ISortCode01Entity>({
		grid: {
			title: { key: 'sortCode01List' },
		},
		form: {
			title: { key: 'project.structures' + '.sortCode01Details' },
			containerUuid: 'b5b27ff9adae4de09deb1e765b53bff9',
		},
		dataService: (ctx) =>
			ctx.injector.get(ProjectStructuresSortcode01DataService),
		dtoSchemeId: {
			moduleSubModule: 'Project.Structures',
			typeName: 'SortCode01Dto',
		},
		permissionUuid: '9ae8c2111f354edea6c775fb64469de3',
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