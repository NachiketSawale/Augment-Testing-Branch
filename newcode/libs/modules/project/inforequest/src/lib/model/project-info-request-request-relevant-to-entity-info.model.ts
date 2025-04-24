/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectInfoRequestRelevantToDataService } from '../services/project-info-request-relevant-to-data.service';
import { ProjectInfoRequestRelevantToValidationService } from '../services/project-info-request-relevant-to-data-validation.service';
import { IEntityInfo, EntityInfo } from '@libs/ui/business-base';
import { IProjectInfoRequestRelevantToEntity } from '@libs/project/interfaces';
import { createLookup, FieldType } from '@libs/ui/common';
import { BusinessPartnerLookupService, BusinesspartnerSharedContactLookupService } from '@libs/businesspartner/shared';


export const PROJECT_INFO_REQUEST_RELEVANT_TO_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: '',
			key: 'project.inforequest.projectInfoRequestRelevantToListTitle'
		}
	},
	form: {
		title: {
			text: '',
			key: 'project.inforequest.projectInfoRequestRelevantToDetailTitle'
		},
		containerUuid: 'a5779e8fa1d543febfdf92832d44a9e8'
	},
	dataService: (ctx) => ctx.injector.get(ProjectInfoRequestRelevantToDataService),
	validationService: (ctx) => ctx.injector.get(ProjectInfoRequestRelevantToValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Project.InfoRequest',
		typeName: 'RequestRelevantToDto'
	},
	permissionUuid: '55f24a16454c4b8ab9fbf2e4fe2e90e6',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: [
					'BusinesspartnerFk',
					'ContactFk',
					'CommentText',
				]
			},
		],
		overloads: {
			BusinesspartnerFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService
				})
			},
			ContactFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedContactLookupService,
					showClearButton: true
				})
			},
		},
		labels: {
			...prefixAllTranslationKeys('project.inforequest.', {
				InfoRequestFk: { key: 'entityInfoRequestFk' }
			}),
			...prefixAllTranslationKeys('sales.contract.', {
				BusinesspartnerFk: { key: 'entityBusinesspartnerFk'},
				ContactFk: {key:'entityContactFk'},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
					CommentText: { key: 'entityCommentText'}
			})
		}
	}
} as IEntityInfo<IProjectInfoRequestRelevantToEntity>);