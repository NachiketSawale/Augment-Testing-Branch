/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ResourceTypePlanningBoardFilterDataService } from '../services/data/resource-type-planning-board-filter-data.service';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { IPlanningBoardFilterEntity } from '@libs/resource/interfaces';
import { ResourceTypePlanningboardFilterValidationService } from '../services/validation/resource-type-planningboard-filter-validation.service';

const resourceTypePlanningBoardFilterEntityInfo = <IEntityInfo<IPlanningBoardFilterEntity>>{
		grid: {
			title: { key: 'resource.type' + '.planningBoardFilterListTitle' },
		},
		form: {
			title: { key: 'resource.type' + '.planningBoardFilterDetailTitle' },
			containerUuid: '1d92b58b87834e8b825380b75c9ca796',
		},
		dataService: (ctx) =>
			ctx.injector.get(ResourceTypePlanningBoardFilterDataService),
		validationService: (ctx: IInitializationContext) => ctx.injector.get(ResourceTypePlanningboardFilterValidationService),
		dtoSchemeId: {
			moduleSubModule: 'Resource.Type',
			typeName: 'PlanningBoardFilterDto',
		},
		permissionUuid: '9a86db998dad47b6bf7e96fe48c6f0b7',
		layoutConfiguration: {
			groups: [
				{
					gid: 'Planning Board Filter Details',
					attributes: [/*'ModuleFk',*/'Comment'],
				},
			],
			overloads: {
				//ModuleFk: BasicsSharedLookupOverloadProvider.providePlanningBoardFilterLookupOverload(true) //to be discuss
			},
			labels: {
				...prefixAllTranslationKeys('resource.type.', {}),
				...prefixAllTranslationKeys('cloud.common.', {
					Comment: { key: 'entityComment' },
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					ModuleFk: { key: 'ModuleFk' },
				}),
			},
		},
	};

export const RESOURCE_TYPE_PLANNING_BOARD_FILTER_ENTITY_INFO = EntityInfo.create(resourceTypePlanningBoardFilterEntityInfo);

