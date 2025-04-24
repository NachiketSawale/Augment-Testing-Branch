/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ResourceComponentTypeDataService } from '../services/resource-component-type-data.service';
import { IResourcePlantComponentTypeEntity } from '@libs/resource/interfaces';
import { prefixAllTranslationKeys } from "@libs/platform/common";


 export const RESOURCE_COMPONENT_TYPE_ENTITY_INFO: EntityInfo = EntityInfo.create<IResourcePlantComponentTypeEntity> ({
                grid: {
                    title: {key: 'resource.componenttype' + '.componentTypeListTitle'},
                },
                form: {
			    title: { key: 'resource.componenttype' + '.componentTypeDetailTitle' },
			    containerUuid: 'e7b2aa01dab8439cae84f3f5258d4e23',
		        },
                dataService: ctx => ctx.injector.get(ResourceComponentTypeDataService),
                dtoSchemeId: {moduleSubModule: 'Resource.ComponentType', typeName: 'PlantComponentTypeDto'},
                permissionUuid: '7b66904e63404334a7c1930a1f6ffd82',
					 layoutConfiguration: {
						 groups: [
									 {gid: 'baseGroup', attributes: ['DescriptionInfo','IsBaseComponent','IsDefault','Sorting','IsLive'] },
						 ],
		 overloads: {

		 },
		 labels: {
			 ...prefixAllTranslationKeys('resource.componenttype.', {
				 IsBaseComponent: { key: 'IsBaseComponent' },
				 IsDefault: { key: 'IsDefault' },
				 Sorting: { key: 'Sorting' },
				 IsLive: {key:'entityIsLive'},

			 }),
			 ...prefixAllTranslationKeys('cloud.common.', {

			 })
		 },
	 }

 });
