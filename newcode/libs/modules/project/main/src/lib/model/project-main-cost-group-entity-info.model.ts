/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectMainCostGroupDataService } from '../services/project-main-cost-group-data.service';
import { ProjectMainCostGroupEntityGenerated } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ProjectMainCostGroupValidationService } from '../services/project-main-cost-group-validation.service';



export const  projectMainCostGroupEntityInfo: EntityInfo = EntityInfo.create<ProjectMainCostGroupEntityGenerated> ({
	grid: {
		title: {key: 'project.main' + '.listCostGroupTitle'},
	},
	form: {
		title: { key: 'project.main' + '.detailCostGroupTitle' },
		containerUuid: '138ba13460d6421dac6566fb65076b2b',
	},
	dataService: ctx => ctx.injector.get(ProjectMainCostGroupDataService),
	validationService: (ctx) => ctx.injector.get(ProjectMainCostGroupValidationService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'CostGroupDto'},
	permissionUuid: 'e1f73b4dbf484db98db890921790c6d6',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['Code', 'DescriptionInfo','LeadQuantityCalc','ReferenceQuantityCode','UomFk','NoLeadQuantity'],
			},],
		overloads: {
			UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('project.main.', {
				LeadQuantityCalc: { key: 'entityLeadQuantityCalc' },
				ReferenceQuantityCode: { key: 'entityReferenceQuantityCode' },
				NoLeadQuantity : {key: 'entityNoLeadQuantity'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				DescriptionInfo: { key: 'entityDescription' },
				Code: { key: 'entityCode' },
				UomFk: {key: 'entityUoM'},
			}),
		},
	},

});