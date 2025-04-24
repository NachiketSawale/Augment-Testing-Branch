/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectInfoRequest2ExternalDataService } from '../services/project-info-request-2-external-data.service';
import { ProjectInfoRequest2ExternalValidationService } from '../services/project-info-request-2-external-data-validation.service';
import { IEntityInfo, EntityInfo } from '@libs/ui/business-base';
import { IProjectInfoRequest2ExternalEntity } from '@libs/project/interfaces';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';


import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';

export const PROJECT_INFO_REQUEST_2_EXTERNAL_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: '',
			key: 'project.inforequest.projectInfoRequest2ExternalListTitle'
		}
	},
	form: {
		title: {
			text: '',
			key: 'project.inforequest.projectInfoRequest2ExternalDetailTitle'
		},
		containerUuid: 'a22ab80151dc4a8f8f0914cc2e550811'
	},
	dataService: (ctx) => ctx.injector.get(ProjectInfoRequest2ExternalDataService),
	validationService: (ctx) => ctx.injector.get(ProjectInfoRequest2ExternalValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Project.InfoRequest',
		typeName: 'InfoRequest2ExternalDto'
	},
	permissionUuid: '52a1f2237b1f476995cc9e78b79e9a68',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: [
					'ProjectFk',
					'ExternalSourceFk',
					'ExtGuid',
					'ExtName',
					'ExtPath',
				]
			},
		],
		overloads: {
			ProjectFk: ProjectSharedLookupOverloadProvider.provideProjectLookupOverload(false),
			//InfoRequestFk: ProjectSharedLookupOverloadProvider.providerProjectInfoRequestLookupOverload(true),
			ExternalSourceFk: BasicsSharedCustomizeLookupOverloadProvider.provideExternalSourceLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('project.inforequest.', {
				InfoRequestFk: { key: 'entityInfoRequestFk' },
				ExternalSourceFk: { key: 'entityExternalSourceFk' },
				ExtGuid: { key: 'entityExtGuid' },
				ExtName: { key: 'entityExtName' },
				ExtPath: { key: 'entityExtPath' }
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				ProjectFk: {key: 'entityProject'}
			}),
		}
	}
} as IEntityInfo<IProjectInfoRequest2ExternalEntity>);