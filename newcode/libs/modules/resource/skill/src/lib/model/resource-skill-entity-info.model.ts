/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { createLookup, FieldType } from '@libs/ui/common';
import { ResourceTypeLookupService } from '@libs/resource/shared';
import { addUserDefinedTextTranslation, prefixAllTranslationKeys } from '@libs/platform/common';
import { IResourceSkillEntity } from '@libs/resource/interfaces';
import { ResourceSkillDataService } from "@libs/resource/skill";


export const RESOURCE_SKILL_ENTITY_INFO:  EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: 'Skill',
			key: 'resource.skill' + '.skillListTitle'
		}
	},
	form: {
		title: {
			text: 'Skill',
			key: 'resource.skill' + '.skillDetailTitle'
		},
		containerUuid: 'c6c4abc54c5b432aa8cdee1b4b4030a3'
	},
	dataService: (ctx) => ctx.injector.get(ResourceSkillDataService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.Skill',
		typeName: 'ResourceSkillDto'
	},
	permissionUuid: '42e6d32d1ea343e5b0558a0394bfd3f7',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: [
					'DescriptionInfo',
					'SkillTypeFk',
					'SkillGroupFk',
					'Remark',
					'IsLive',
					'IsMandatory',
					'IsDefault',
					'TypeFk',
					'Sorting'
				]
			},
			{
				gid: 'userDefTexts',
				attributes: ['UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05']
			},
		],
		overloads: {
			SkillTypeFk: BasicsSharedLookupOverloadProvider.provideResourceSkillTypeLookupOverload(true),
			SkillGroupFk: BasicsSharedLookupOverloadProvider.provideResourceSkillGroupLookupOverload(true),
			TypeFk: {
				lookupOptions: createLookup({
					dataServiceToken: ResourceTypeLookupService
				}),
				type: FieldType.Lookup,
				visible: true
			}
		},
		labels: {
			...prefixAllTranslationKeys('resource.skill.', {
				SkillTypeFk: { key: 'entitySkillType' },
				SkillGroupFk: { key: 'entitySkillGroup' },
				Remark: { key: 'entityRemark' },
				IsLive: { key: 'entityIsLive' },
				IsMandatory: { key: 'entityIsMandatory' },
				IsDefault: { key: 'entityIsDefault' },
				TypeFk: { key: 'entityType' }
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				DescriptionInfo: { key: 'entityDescription' },
			}),
			...addUserDefinedTextTranslation({ UserDefinedText: {key: 'entityUserDefinedText',params: { 'p_0': 1 }} }, 5, 'UserDefinedText', '', 'userDefTextGroup'),
		}
	}
} as IEntityInfo<IResourceSkillEntity>);