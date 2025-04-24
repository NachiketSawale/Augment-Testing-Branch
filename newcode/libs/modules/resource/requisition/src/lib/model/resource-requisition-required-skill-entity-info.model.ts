/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ResourceRequisitionRequiredSkillDataService } from '../services/resource-requisition-required-skill-data.service';
import { IRequisitionRequiredSkillEntity } from '@libs/resource/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ResourceRequisitionRequiredSkillValidationService } from '../services/resource-requisition-required-skill-validation.service';


export const RESOURCE_REQUISITION_REQUIRED_SKILL_ENTITY_INFO: EntityInfo = EntityInfo.create<IRequisitionRequiredSkillEntity>({
	grid: {
		title: {key: 'resource.requisition' + '.requiredSkillListTitle'},
	},
	form: {
		title: {key: 'resource.requisition' + '.requiredSkillDetailTitle'},
		containerUuid: '1667e74599424c6db3ab8f8b8454808a',
	},
	dataService: ctx => ctx.injector.get(ResourceRequisitionRequiredSkillDataService),
	validationService: (ctx) => ctx.injector.get(ResourceRequisitionRequiredSkillValidationService),
	dtoSchemeId: {moduleSubModule: 'Resource.Requisition', typeName: 'RequisitionRequiredSkillDto'},
	permissionUuid: '21d18723fae447ef9f1e00f4c323e61a',
	layoutConfiguration: {
		//TODO: The SkillFk lookup is not available, so we have created Ticket DEV-25388
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['CommentText'],
			},
			{
				gid: 'User-Defined Texts',
				attributes: ['UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05'],
			},
			{
				gid: 'User-Defined Numbers',
				attributes: ['UserDefinedNumber01', 'UserDefinedNumber02', 'UserDefinedNumber03', 'UserDefinedNumber04', 'UserDefinedNumber05'],
			},
			{
				gid: 'User-Defined Dates',
				attributes: ['UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05'],
			}
		],
		overloads: {},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				CommentText: {key: 'entityComment'},
				UserDefinedText01: {
					key: 'entityUserDefText',
					params: {p_0: '1'},
				},
				UserDefinedText02: {
					key: 'entityUserDefText',
					params: {p_0: '2'},
				},
				UserDefinedText03: {
					key: 'entityUserDefText',
					params: {p_0: '3'},
				},
				UserDefinedText04: {
					key: 'entityUserDefText',
					params: {p_0: '4'},
				},
				UserDefinedText05: {
					key: 'entityUserDefText',
					params: {p_0: '5'},
				},
				UserDefinedNumber01: {
					key: 'entityUserDefNumber',
					params: {p_0: '1'},
				},
				UserDefinedNumber02: {
					key: 'entityUserDefNumber',
					params: {p_0: '2'},
				},
				UserDefinedNumber03: {
					key: 'entityUserDefNumber',
					params: {p_0: '3'},
				},
				UserDefinedNumber04: {
					key: 'entityUserDefNumber',
					params: {p_0: '4'},
				},
				UserDefinedNumber05: {
					key: 'entityUserDefNumber',
					params: {p_0: '5'},
				},
				UserDefinedDate01: {
					key: 'entityUserDefDate',
					params: {p_0: '1'},
				},
				UserDefinedDate02: {
					key: 'entityUserDefDate',
					params: {p_0: '2'},
				},
				UserDefinedDate03: {
					key: 'entityUserDefDate',
					params: {p_0: '3'},
				},
				UserDefinedDate04: {
					key: 'entityUserDefDate',
					params: {p_0: '4'},
				},
				UserDefinedDate05: {
					key: 'entityUserDefDate',
					params: {p_0: '5'},
				},


			}),
		}
	},
});