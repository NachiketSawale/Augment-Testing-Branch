/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStockDowntimeService, ProjectStockDowntimeValidationService } from '@libs/project/stock';
import { IProjectStockDownTimeEntity } from '@libs/project/interfaces';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';


export const projectStockDowntimeEntityInfo: EntityInfo = EntityInfo.create<IProjectStockDownTimeEntity>({
	grid: {
		title: {key: 'project.stock.downtimeListContainerTitle'},
	},
	form: {
		title: {key: 'project.stock.downtimeDetailContainerTitle'},
		containerUuid: '2b7ed018e6a240918f5bb791c337468a',
	},
	dataService: (ctx: IInitializationContext) => ctx.injector.get(ProjectStockDowntimeService),
	validationService: (ctx: IInitializationContext) => ctx.injector.get(ProjectStockDowntimeValidationService),
	dtoSchemeId: {moduleSubModule: 'Project.Stock', typeName: 'ProjectStockDownTimeDto'},
	permissionUuid: '585cdb266f5a4fdb82f1fd22ca6a44c7',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['StartDate', 'EndDate', 'Description', 'BasClerkFk'],
			}
		],
		overloads: {
			BasClerkFk:BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.',{
				BasClerkFk :{ key: 'entityClerk'},
				DescriptionInfo: { key: 'entityDescription'},
			}),
			...prefixAllTranslationKeys('basics.customize.',{
				StartDate :{ key: 'startdate'},
				EndDate: { key: 'enddate'},
			})
		}
	},
});