/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from "@libs/ui/business-base";
import { ResourceSkillChainDataService } from "../services/resource-skill-chain-data.service";
import { ILayoutConfiguration } from "@libs/ui/common";
import { prefixAllTranslationKeys } from "@libs/platform/common";
import { IResourceSkillChainEntity, RESOURCE_SKILL_LOOKUP_PROVIDER_TOKEN } from "@libs/resource/interfaces";

export const RESOURCE_SKILL_CHAIN_ENTITY_INFO:   EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: 'Skill Chain',
			key: 'resource.skill' + '.skillChainListTitle'
		}
	},
	form: {
		title: {
			text: 'Skill Chain',
			key: 'resource.skill' + '.skillChainDetailTitle'
		},
		containerUuid: '41057af6965043cfaab9bb267b239061'
	},
	dataService: (ctx) => ctx.injector.get(ResourceSkillChainDataService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.Skill',
		typeName: 'ResourceSkillChainDto'
	},
	permissionUuid: '0aa9dbc6d88744e2adc1d08e85e9361b',
	layoutConfiguration: async (ctx) => {
		const resourceSkillLookupProvider = await ctx.lazyInjector.inject(RESOURCE_SKILL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IResourceSkillChainEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: [
						'ChainedSkillFk',
					]
				},
			],
			overloads: {
				ChainedSkillFk: resourceSkillLookupProvider.provideResourceSkillLookupOverload(),
			},
			labels: {
				...prefixAllTranslationKeys('resource.skill.', {
					ChainedSkillFk: { key: 'entityChainedSkill' }
				}),
			}
		};
	}
} as IEntityInfo<IResourceSkillChainEntity>);