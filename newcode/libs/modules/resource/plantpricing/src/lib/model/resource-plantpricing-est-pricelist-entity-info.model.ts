/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ResourcePlantpricingEstPricelistDataService } from '../services/resource-plantpricing-est-pricelist-data.service';
import { IEstPricelistEntity } from './entities/est-pricelist-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';


 export const RESOURCE_PLANTPRICING_EST_PRICELIST_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstPricelistEntity> ({
                grid: {
                    title: {key: 'resource.plantpricing' + '.estPricelistListTitle'}
                },
                form: {
			    title: { key: 'resource.plantpricing' + '.estPricelistDetailTitle' },
			    containerUuid: '69fc598b3b3645279ff52a862f4e0b45',
		        },
                dataService: ctx => ctx.injector.get(ResourcePlantpricingEstPricelistDataService),
                dtoSchemeId: {moduleSubModule: 'Resource.Plantpricing', typeName: 'EstPricelistDto'},
                permissionUuid: 'fb0d5f61d72e426c847cd01b0d74008d',

	             layoutConfiguration: {
						 groups: [
								 {gid: 'Estimate Plant Pricelist Detail', attributes: ['MasterDataLineItemContextFk','MasterDataContextFk','EquipmentDivisionFk','Percent',
										'EquipmentCalculationTypeFk', 'EquipmentCatalogFk','UomFk','CommentText','IsDefault','IsLive','Sorting','ReferenceYear' ] },
		                     ],
						 overloads: {
										 MasterDataLineItemContextFk : BasicsSharedLookupOverloadProvider.provideLineItemContextLookupOverload(true),
							          MasterDataContextFk : BasicsSharedLookupOverloadProvider.provideMasterDataContextLookupOverload(true),
							          EquipmentDivisionFk : BasicsSharedLookupOverloadProvider.provideDivisionTypeLookupOverload(true),
										 EquipmentCalculationTypeFk : BasicsSharedLookupOverloadProvider.provideCalculationTypeLookupOverload(true),
										///TO DO EquipmentCatalogFk : BasicsSharedLookupOverloadProvider.provideEquipmentCatalogLookupOverload(true),
										 UomFk : BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),

									 },
						 labels: {
							 ...prefixAllTranslationKeys('resource.plantpricing.', {
								 MasterDataLineItemContextFk: { key: 'MasterDataLineItemContextFk' },
								 MasterDataContextFk: { key: 'MasterDataContextFk' },
								 EquipmentDivisionFk: { key: 'EquipmentDivisionFk' },
								 Percent: { key: 'percent' },
								 EquipmentCalculationTypeFk: { key: 'EquipmentCalculationTypeFk' },
								EquipmentCatalogFk: { key: 'equipmentCatalogFk' },
								 UomFk: { key: 'uomFk' },
								 CommentText: { key: 'commentText' },
								 IsDefault: { key: 'IsDefault' },
								 IsLive: { key: 'IsLive' },
								 Sorting: { key: 'Sorting' },
								 ReferenceYear: { key: 'referenceYear' },

							 }),
			            ...prefixAllTranslationKeys('cloud.common.', {



						 })
		         },}

            });