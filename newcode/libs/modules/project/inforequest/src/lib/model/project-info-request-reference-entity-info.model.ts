/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectInfoRequestReferenceDataService } from '../services/project-info-request-reference-data.service';
import { ProjectInfoRequestReferenceValidationService } from '../services/project-info-request-reference-validation.service';
import { IEntityInfo, EntityInfo } from '@libs/ui/business-base';
import { IProjectInfoRequestReferenceEntity } from '@libs/project/interfaces';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';


export const PROJECT_INFO_REQUEST_REFERENCE_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {

		title: {
			text: '',
			key: 'project.inforequest.projectInfoRequestReferenceListTitle'
		}
	},
	form: {
		title: {
			text: '',
			key: 'project.inforequest.projectInfoRequestReferenceDetailTitle'
		},
		containerUuid: '6a7b8a7849e74634afc484437d30ab60'
	},
	dataService: (ctx) => ctx.injector.get(ProjectInfoRequestReferenceDataService),
	validationService: (ctx) => ctx.injector.get(ProjectInfoRequestReferenceValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Project.InfoRequest',
		typeName: 'InfoRequestReferenceDto'
	},
	permissionUuid: '251358b08bbf48cdb9ed586711fbabb1',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: [
					'RequestToFk',
					'ReferenceTypeFk',
				]
			},
		],
		overloads: {
			RequestToFk: ProjectSharedLookupOverloadProvider.providerProjectInfoRequestLookupOverload(true),
			ReferenceTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideModelAnnotationReferenceTypeLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('project.inforequest.', {
				RequestFromFk: {key: 'entityRequestFromFk'},
				RequestToFk: {key: 'entityRequestToFk'},
				ReferenceTypeFk: {key: 'entityReferenceTypeFk'}
			}),
		}
	}
} as IEntityInfo<IProjectInfoRequestReferenceEntity>);