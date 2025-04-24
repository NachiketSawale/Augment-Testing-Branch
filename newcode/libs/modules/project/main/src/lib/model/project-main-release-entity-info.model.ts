/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectMainReleaseDataService } from '../services/project-main-release-data.service';
import { IProjectMainProjectReleaseEntity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectMainReleaseValidationService } from '../services/project-main-release-validation.service';



export const projectMainReleaseEntityInfo: EntityInfo =
	EntityInfo.create<IProjectMainProjectReleaseEntity>({
		grid: {
			title: { key: 'project.main' + '.releaseListTitle' },
		},
		form: {
			title: { key: 'project.main' + '.releaseDetailTitle' },
			containerUuid: '3447b10db17548e496012f8871b7fdea',
		},
		dataService: (ctx) => ctx.injector.get(ProjectMainReleaseDataService),
		validationService: (ctx) => ctx.injector.get(ProjectMainReleaseValidationService),
		dtoSchemeId: {
			moduleSubModule: 'Project.Main',
			typeName: 'ProjectReleaseDto',
		},
		permissionUuid: 'fa709a78d4f94faaaf224d31ec05093f',
		layoutConfiguration: {
			groups: [
				{
					gid: 'Releases Details',
					attributes: ['CommentText', 'ReleaseDate'],
				},
				{
					gid: 'userDefTexts',
					attributes: ['UserDefinedNumber01', 'UserDefinedNumber02', 'UserDefinedNumber03', 'UserDefinedNumber04', 'UserDefinedNumber05',],
				},
			],
			overloads: {

			},
			labels: {
				...prefixAllTranslationKeys('Project.Main', {
					ReleaseDate: { key: 'ReleaseDate' },
					UserDefinedText01: { key: 'ReleaseDate' },
					UserDefinedText02: { key: 'ReleaseDate' },
					UserDefinedText03: { key: 'ReleaseDate' },
					UserDefinedText04: { key: 'ReleaseDate' },
					UserDefinedText05: { key: 'ReleaseDate' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: { key: 'entityComment' },
				}),
				...prefixAllTranslationKeys('basics.customize.', {}),
			},
		},
	});
