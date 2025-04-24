/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICertificatedPlantEntity, RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN } from '@libs/resource/interfaces';
import { ResourceCertificatedPlantDataService } from '../services/resource-certificated-plant-data.service';


export const RESOURCE_CERTIFICATE_PLANT_ENTITY_INFO: EntityInfo = EntityInfo.create<ICertificatedPlantEntity> ({
		grid: {
			title: {key:'resource.certificate' + '.resourceCertificatedPlantListTitle'},
		},
		form: {
			title: {key:'resource.certificate' + '.resourceCertificatedPlantDetailTitle' },
			containerUuid:'055f01dd049d4ae3a1f00ff58444e176'
		},
		dataService: (ctx) => ctx.injector.get(ResourceCertificatedPlantDataService),
		dtoSchemeId: { moduleSubModule: 'Resource.Certificate', typeName: 'CertificatedPlantDto' },
		permissionUuid: '43d1291116b641858c78ad23732e4e60',
	   layoutConfiguration: async ctx => {
		   const LookupProvider = await ctx.lazyInjector.inject(RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN);
		   return {
			   groups: [
				   {
					   gid: 'baseGroup',
					   attributes: ['PlantFk', 'Comment', 'ValidFrom', 'ValidTo'],
				   }
			   ],
			   overloads: {
				   PlantFk: LookupProvider.providePlantLookupOverload({showClearButton: true}),
				   /*CertificateFk: await resourceEquipmentLookupProvider.generateEquipmentLookup(ctx, {
						  checkIsAccountingElement: true,
						 // plantGetter: e => e.CertificateFk,
						  //certificateGetter: e => e.PlantFk,
						  lookupOptions: {
							  showClearButton: true,
							  showDescription: true,
							  descriptionMember: 'DescriptionInfo.Translated',
							  serverSideFilter: {
								  key: 'resource.certificate.plant.context.filter',
								  execute: (context: ILookupContext<ICertificateEntity, ICertificatedPlantEntity>) => {
									  return {
										  ByStructure: true,
										  ExtraFilter: false,
										  PlantFk: context.entity?.PlantFk,
										  CertificateFk:  context.entity?.CertificateFk
									  };
								  },
							  }
						  }
					  })*/
			   },
			   labels: {
				   ...prefixAllTranslationKeys('resource.certificate.', {
					   Comment: {key: 'entityComment'},
				   }),
				   ...prefixAllTranslationKeys('resource.common.', {
					   Comment: {key: 'entityPlant'},
				   }),
				   ...prefixAllTranslationKeys('cloud.common.', {
					   ValidFrom: {key: 'entityValidFrom'},
					   ValidTo: {key: 'entityValidTo'},
				   })
			   }
		   };
	   },

});