/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectMainCostGroupCatalogDataService } from '../services/project-main-cost-group-catalog-data.service';
import { ProjectMainCostGroupCatalogEntity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectMainCostGroupCatalogValidationService } from '../services/project-main-cost-group-catalog-validation.service';


export const projectMainCostGroupCatalogEntityInfo: EntityInfo =
	EntityInfo.create<ProjectMainCostGroupCatalogEntity>({
		grid: {
			title: { key:  'project.main' + '.listCostGroupCatalogTitle' }
		},
		form: {
			title: { key: 'project.main' + '.detailCostGroupCatalogTitle' },
			containerUuid: '9ff91fd62965439d95102a1a62b48741',
		},
		dataService: (ctx) =>
			ctx.injector.get(ProjectMainCostGroupCatalogDataService),
		validationService: (ctx) => ctx.injector.get(ProjectMainCostGroupCatalogValidationService),
		dtoSchemeId: {
			moduleSubModule: 'Project.Main',
			typeName: 'CostGroupCatalogDto',
		},
		permissionUuid: '02a8e37bada946f9939ce17f551cab6d',
		layoutConfiguration: {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Code', 'DescriptionInfo'],
				},
			],
			overloads: {
			},
			labels: {
				...prefixAllTranslationKeys('project.main.', {

				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: { key: 'entityDescription' },
					Code: { key: 'entityCode' },
				}),
			},
		},
	});
