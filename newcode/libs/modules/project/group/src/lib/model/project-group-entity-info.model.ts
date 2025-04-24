/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectGroupDataService } from '../services/project-group-data.service';
import { ProjectGroupBehavior } from '../behaviors/project-group-behavior.service';
import { IProjectGroupEntity } from '@libs/project/interfaces';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IGridTreeConfiguration } from '@libs/ui/common';


export const projectGroupEntityInfo: EntityInfo = EntityInfo.create<IProjectGroupEntity>({
	grid: {
		title: {key: 'project.group.projectGroupList'},
		behavior: (ctx: IInitializationContext) => ctx.injector.get(ProjectGroupBehavior),
		treeConfiguration: ctx => {
			return {
				parent: function (entity: IProjectGroupEntity) {
					const service = ctx.injector.get(ProjectGroupDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IProjectGroupEntity) {
					const service = ctx.injector.get(ProjectGroupDataService);
					return service.childrenOf(entity);
				},
			} as IGridTreeConfiguration<IProjectGroupEntity>;
		}
	},
	form: {
		title: {key: 'project.group.projectGroupDetail'},
		containerUuid: 'c1592f6e58514d3e904e9e5a4a046e35',
	},
	dataService: (ctx: IInitializationContext) => ctx.injector.get(ProjectGroupDataService),
	dtoSchemeId: {moduleSubModule: 'Project.Group', typeName: 'ProjectGroupDto'},
	permissionUuid: '5f2c8f5b4d24470f8ff69e81a129f5b8',
	layoutConfiguration: {
		groups:[
			{
				gid: 'baseGroup',
				attributes: ['InstanceAction','Code','IsAutoIntegration','ProjectGroupStatusFk',
					'DescriptionInfo','ITwoBaselineServerFk','UncPath','CommentText','IsActive','IsDefault']
			}
		],
		overloads:{
			ProjectGroupStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectGroupStatusReadonlyLookupOverload(),
			ITwoBaselineServerFk: BasicsSharedCustomizeLookupOverloadProvider.provideItwoBaselineServerLookupOverload(true)
		},
		labels:{
			...prefixAllTranslationKeys('basics.customize.', {
				InstanceAction: {key: 'action'},
				ITwoBaselineServerFk: { key: 'itwobaselineserver'},
				UncPath: { key: 'uncpath'},
			}),
			...prefixAllTranslationKeys('project.group.', {
				Code: {key: 'entityCode'},
				IsAutoIntegration: {key: 'isAutoIntegration'},
				ProjectGroupStatusFk: {key: 'entityProjectGroupStatus'},
				DescriptionInfo: {key: 'entityDescriptionInfo'},
				CommentText: { key: 'entityCommentText'},
				IsActive: { key: 'entityIsActive'},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				IsDefault: { key: 'entityIsDefault'},
			}),
		}
	}
});