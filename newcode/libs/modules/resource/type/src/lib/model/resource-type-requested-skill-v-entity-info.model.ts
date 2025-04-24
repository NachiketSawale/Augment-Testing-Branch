/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ResourceTypeRequestedSkillVDataService } from '../services/data/resource-type-requested-skill-v-data.service';
import { IRequestedSkillVEntity } from '@libs/resource/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const resourceTypeRequestedSkillVEntityInfo = <IEntityInfo<IRequestedSkillVEntity>>{
		grid: {
			title: { key: 'resource.type' + '.requestedSkillVListTitle' },
		},
		form: {
			title: {key: 'resource.type' + '.requestedSkillVDetailTitle'},
			containerUuid: 'e87b97f59061480b9630a1880c340788',
		},

		dataService: (ctx) =>
			ctx.injector.get(ResourceTypeRequestedSkillVDataService),
		dtoSchemeId: {
			moduleSubModule: 'Resource.Type',
			typeName: 'RequestedSkillVDto',
		},
		permissionUuid: '29e4435b181f41ada329d9c6874867e7',
		layoutConfiguration: {
			groups: [
				{
					gid: 'Requested Skill from Secondary Type Details',
					attributes: [
						'TypeRequestedFk', 'UomDayFk',/*'ResSkillFk',*/ 'IsRequestedEntirePeriod', 'Duration', 'NecessaryOperators',
					],
				},
			],
			overloads: {
				TypeRequestedFk: BasicsSharedLookupOverloadProvider.provideResourceTypeLookupOverload(true),
				UomDayFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			},
			labels: {
				...prefixAllTranslationKeys('resource.type.', {
					TypeRequestedFk: { key: 'entityTypeRequested' },
					//ResSkillFk: { key: 'resSkillFK' },
					IsRequestedEntirePeriod: { key: 'entityIsRequestedEntirePeriod' },
					Duration: { key: 'entityDuration' },
					NecessaryOperators: { key: 'entityNecessaryOperators' },

				}),
				...prefixAllTranslationKeys('cloud.common.', {
					UomDayFk: { key: 'entityUoM' }
				}),
			},
		},
	};

export const RESOURCE_TYPE_REQUESTED_SKILL_V_ENTITY_INFO = EntityInfo.create(resourceTypeRequestedSkillVEntityInfo);