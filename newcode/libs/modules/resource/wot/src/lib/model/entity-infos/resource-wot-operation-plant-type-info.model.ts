/*
 * Copyright(c) RIB Software GmbH
 */

import {  prefixAllTranslationKeys } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { ResourceWotOperationPlantTypeDataService } from '../../services/resource-wot-operation-plant-type-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IResourceOperationPlantTypeEntity } from '@libs/resource/interfaces';


export const resourceWotPlantTypeEntityInfo = EntityInfo.create<IResourceOperationPlantTypeEntity>({
	grid: {
		title: {
			text: 'Plant Types',
			key: 'resource.wot.operationPlantTypeListTitle'
		}
	},
	form: {
		title: {
			text: 'Plant Type Details',
			key: 'resource.wot.operationPlantTypeDetailTitle'
		},
		containerUuid: '84f1b6d1a8d44840a5c13965dd32e411'
	},
	dataService: (ctx) => ctx.injector.get(ResourceWotOperationPlantTypeDataService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.Wot',
		typeName: 'Operation2PlantTypeDto'
	},
	permissionUuid: '8bf3d2a2d03a4ae99aab2ad090c77a53',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: [
					'PlantTypeFk', 'Comment', 'IsDefault', 'IsTimekeepingDefault'
				]
			},
		],
		overloads: {
			PlantTypeFk: BasicsSharedLookupOverloadProvider.providePlantTypeLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('resource.wot.', {
				IsTimekeepingDefault: { key: 'isTimekeepingDefault'}
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				PlantTypeFk: { key: 'planttype'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				basicData: {key: 'entityProperties'},
				Comment: {key: 'entityComment'},
				IsDefault: { key: 'entityIsDefault'}
			})
		}
	}
});

