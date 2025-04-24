/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ResourcePlantpricingPricelistDataService } from '../services/resource-plantpricing-pricelist-data.service';
import { IPricelistEntity } from './entities/pricelist-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';


 export const RESOURCE_PLANTPRICING_PRICELIST_ENTITY_INFO: EntityInfo = EntityInfo.create<IPricelistEntity> ({
                grid: {
                    title: {key: 'resource.plantpricing' + '.pricelistListTitle'},
                },
                form: {
			    title: { key: 'resource.plantpricing' + '.pricelistDetailTitle' },
			    containerUuid: 'bb28b8eba1604d95a1d0acc24f7b188d',
		        },
                dataService: ctx => ctx.injector.get(ResourcePlantpricingPricelistDataService),
                dtoSchemeId: {moduleSubModule: 'Resource.Plantpricing', typeName: 'PricelistDto'},
                permissionUuid: 'b3e5fc95b1a6496c9d83fb923abf100b',
	             layoutConfiguration: {
						 groups: [
							 { gid: 'Plant Price List Detail', attributes: ['EquipmentContextFk','CurrencyFk','Percent','IsManualEditPlantMaster','IsManualEditJob','IsManualEditDispatching',
									 'Priceportion1Name', 'Priceportion2Name','Priceportion3Name','Priceportion4Name','Priceportion5Name','Priceportion6Name','CommentText','ValidFrom','ValidTo',
									 'EquipmentCalculationTypeFk','ReferenceYear','UomFk','EquipmentCatalogFk' ] },
									 ],
							 overloads: {
								 EquipmentContextFk : BasicsSharedLookupOverloadProvider.provideEquipmentContextLookupOverload(true),
								 CurrencyFk : BasicsSharedLookupOverloadProvider.provideCurrencyRateTypeLookupOverload(true),
								 EquipmentCalculationTypeFk:BasicsSharedLookupOverloadProvider.provideCalculationTypeLookupOverload(true),
								 UomFk:BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
								 //EquipmentCatalogFk:BasicsSharedLookupOverloadProvider. //Not implemented yet.
						 },
						 labels: {
					 ...prefixAllTranslationKeys('resource.plantpricing.', {
						 EquipmentContextFk: { key: 'equipmentContextFk' },
						 CurrencyFk: { key: 'currencyFk' },
						 Percent: { key: 'percent' },
						 IsManualEditPlantMaster: { key: 'isManualEditPlantMaster' },
						 IsManualEditJob: { key: 'isManualEditJob' },
						 IsManualEditDispatching: { key: 'isManualEditDispatching' },
						 Priceportion1Name: { key: 'priceportion1Name' },
						 Priceportion2Name: { key: 'priceportion2Name' },
						 Priceportion3Name: { key: 'priceportion3Name' },
						 Priceportion4Name: { key: 'priceportion4Name' },
						 Priceportion5Name: { key: 'priceportion5Name' },
						 Priceportion6Name: { key: 'priceportion6Name' },
						 CommentText: { key: 'commentText' },
						 ValidFrom: { key: 'validFrom' },
						 ValidTo: { key: 'validTo' },
						 EquipmentCalculationTypeFk: { key: 'equipmentCalculationTypeFk' },
						 ReferenceYear: { key: 'referenceYear' },
						  UomFk: { key: 'uomFk' },
						 EquipmentCatalogFk: { key: 'equipmentCatalogFk' },

			 }),
					 ...prefixAllTranslationKeys('cloud.common.', {

			 })
		 },
	 }
 });