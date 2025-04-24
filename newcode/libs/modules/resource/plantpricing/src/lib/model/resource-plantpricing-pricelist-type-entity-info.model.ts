/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { EntityInfo } from '@libs/ui/business-base';
import { ResourcePlantpricingPricelistTypeDataService } from '../services/resource-plantpricing-pricelist-type-data.service';
import { IPricelistEntity } from './entities/pricelist-entity.interface';

import { prefixAllTranslationKeys } from '@libs/platform/common';


 export const RESOURCE_PLANTPRICING_PRICELIST_TYPE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPricelistEntity> ({
                grid: {
                    title: {key: 'resource.plantpricing' + '.pricelistTypeListTitle'}
                },
                form: {
			    title: { key: 'resource.plantpricing' + '.pricelistTypeDetailTitle' },
			    containerUuid: 'eed809fca1ab4cb9ab3df7964dd2d28c',
		        },
                dataService: ctx => ctx.injector.get(ResourcePlantpricingPricelistTypeDataService),
                dtoSchemeId: {moduleSubModule: 'Resource.Plantpricing', typeName: 'PricelistTypeDto'},
                permissionUuid: '03d826201fda4a318c0ac1d7937b3a81',
				 layoutConfiguration: {
				 groups: [
							 {gid: 'Plant Pricelist Type Detail', attributes: ['DescriptionInfo','IsDefault','Sorting','IsLive'] },
				 ],
		 overloads: {

		 },
		 labels: {
			 ...prefixAllTranslationKeys('resource.plantpricing.', {
				 IsDefault: { key: 'IsDefault' },
				 Sorting: { key: 'Sorting' },
				 IsLive: { key: 'IsLive' },

			 }),
			 ...prefixAllTranslationKeys('cloud.common.', {

			 })
		 },
	 }

 });