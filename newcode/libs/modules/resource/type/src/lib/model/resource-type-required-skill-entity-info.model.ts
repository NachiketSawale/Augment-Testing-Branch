/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ResourceTypeRequiredSkillDataService } from '../services/data/resource-type-required-skill-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IRequiredSkillEntity, RESOURCE_SKILL_LOOKUP_PROVIDER_TOKEN } from '@libs/resource/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';


const resourceRequiredSkillEntityInfo = <IEntityInfo<IRequiredSkillEntity>>{
	grid: {
		title: {key: 'resource.type.requiredSkillListTitle'},
	},
	form: {
		title: {key: 'resource.type.requiredSkillDetailTitle'},
		containerUuid: 'a6e1e8208327420f85aa92585f851aee'
	},
	dataService: ctx => ctx.injector.get(ResourceTypeRequiredSkillDataService),
	dtoSchemeId: {moduleSubModule: 'Resource.Type', typeName: 'RequiredSkillDto'},
	permissionUuid: 'a0b5aa1be8524f48b1796a06b9ce3e77',
	layoutConfiguration: async (ctx) => {
		const resourceSkillLookupProvider = await ctx.lazyInjector.inject(RESOURCE_SKILL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IRequiredSkillEntity>>{
			groups: [{gid: 'baseGroup', attributes: ['SkillFk', 'Comment']}],
			overloads: {
				// TODO: resourceSkillLookupProvider is currently incorrect implemented. In ResourceSkillLookupService, filter function should not be used
				SkillFk: resourceSkillLookupProvider.provideResourceSkillLookupOverload(),
			},
			labels: {
				...prefixAllTranslationKeys('resource.skill.', {
					SkillFk: {key: 'resourceSkillEntity'}
				})
			},
		};
	}
};

export const RESOURCE_TYPE_REQUIRED_SKILL_ENTITY_INFO = EntityInfo.create(resourceRequiredSkillEntityInfo);