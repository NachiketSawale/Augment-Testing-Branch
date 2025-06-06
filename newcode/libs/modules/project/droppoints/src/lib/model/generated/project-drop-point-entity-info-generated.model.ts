/*
 * Copyright(c) RIB Software GmbH
 * ----------------------------------------------------------------------
 * This is auto-generated code by ClientTypeScriptModuleInfoGenerator.
 * ----------------------------------------------------------------------
 * This code was generated by RIB Model Generator tool.
 *
 * Changes to this file may cause incorrect behavior and will be lost if
 * the code is regenerated.
 * ----------------------------------------------------------------------
 */

import { ProjectDropPointDataService } from '../../services/data/project-drop-point-data.service';
import { ProjectDropPointValidationService } from '../../services/validation/project-drop-point-validation.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IProjectDropPointEntity } from '@libs/project/interfaces';
import { IEntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';

export const projectDropPointEntityInfoGenerated = <IEntityInfo<IProjectDropPointEntity>>{
	grid: {
		title: {
			text: 'Drop Points',
			key: 'project.droppoints.dropPointsDropPointList'
		}
	},
	form: {
		title: {
			text: 'Drop Points',
			key: 'project.droppoints.dropPointsDropPointDetail'
		},
		containerUuid: 'b485c4cb24344d54aef27530cc7d7563'
	},
	dataService: (ctx) => ctx.injector.get(ProjectDropPointDataService),
	validationService: (ctx) => ctx.injector.get(ProjectDropPointValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Project.DropPoints',
		typeName: 'DropPointDto'
	},
	permissionUuid: '21b52f02742f4796a8e165d8ead4f9d5',
	layoutConfiguration: async (ctx) => {
		return <ILayoutConfiguration<IProjectDropPointEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: [
						'Code',
						'GLNCode',
						//'DropPointTypeFk',
						'IsActive',
						'HidInPubApi',
						'IsManual',
						//'ControllingUnitFk',
						//'PrjAddressFk',
						//'ClerkRespFk',
						'Comment',
					]
				},
			],
			overloads: {},
			labels: {
				...prefixAllTranslationKeys('project.droppoints.', {
					Code: { key: 'entityCode' },
					GLNCode: { key: 'entityGLNCode' },
					DropPointTypeFk: { key: 'entityDropPointType' },
					IsActive: { key: 'entityIsActive' },
					HidInPubApi: { key: 'entityHidInPubApi' },
					IsManual: { key: 'entityIsManual' },
					ControllingUnitFk: { key: 'entityControllingUnit' },
					PrjAddressFk: { key: 'entityPrjAddress' },
					ClerkRespFk: { key: 'entityClerkResp' },
					Comment: { key: 'entityComment' }
				}),
			 }
		};
	}
};