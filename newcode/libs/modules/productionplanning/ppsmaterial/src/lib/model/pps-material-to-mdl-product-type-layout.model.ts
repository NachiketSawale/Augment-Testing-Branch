/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration, ILookupEvent } from '@libs/ui/common';
import { isNil } from 'lodash';
import { PpsMaterialLookupService } from '../services/pps-material-lookup.service';
import { IPpsMaterialLookupEntity } from './entities/pps-material-lookup-entity.interface';
import { IPpsMaterial2MdlProductTypeEntity } from './models';
import { PPS_MATERIAL_PRODUCTIONMODES_TOKEN } from './pps-material-production-modes';



export const PPS_MATERIAL_TO_MDL_PRODUCT_TYPE_LAYOUT: ILayoutConfiguration<IPpsMaterial2MdlProductTypeEntity> = {
	groups: [
		{
			gid: 'basicData',
			attributes: ['Description', 'PpsMaterialFk', 'ProductCategory', 'ProductType', 'ProductionMode', 'IsLive']
		},

	],
	labels: {
		...prefixAllTranslationKeys('cloud.common.', {
			basicData: { key: 'entityProperties' },
			IsLive: { key: 'entityIsLive', text: '*IsLive' },
		}),
		...prefixAllTranslationKeys('basics.material.', {
			MdcMaterialFk: { key: 'record.material', text: '*Material' },
		}),
		...prefixAllTranslationKeys('productionplanning.ppsmaterial.', {
			Description: { key: 'ppsMaterialToMdlProductType.description', text: '*3D Object Type' },
			PpsMaterialFk: { key: 'mapping.ppsmaterialfk', text: '*Pps Material' },
			ProductCategory: { key: 'ppsMaterialToMdlProductType.productCategory', text: '*5D Tracking Criteria' },
			ProductType: { key: 'ppsMaterialToMdlProductType.productType', text: '*Product Type' },
			ProductionMode: { key: 'ppsMaterialToMdlProductType.productionMode', text: '*Auto/Manual Production' },
		}),

	},
	overloads: {
		PpsMaterialFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup<IPpsMaterial2MdlProductTypeEntity, IPpsMaterialLookupEntity>({
				dataServiceToken: PpsMaterialLookupService,
				events: [{
					name: 'onSelectedItemChanged',
					handler: (e: ILookupEvent<IPpsMaterialLookupEntity, IPpsMaterial2MdlProductTypeEntity>) => {
						if ( !isNil(e.context.entity) && !isNil(e.selectedItem)) {
							e.context.entity.ProductionMode = e.selectedItem.IsSerialProduction ? 'MP' : 'AP';
						}
					}
				}]
			})
		},
		// ProductionMode: PpsMaterialLookupOverloadProvider.provideProductionModeReadonlyLookupOverload()
		ProductionMode: {
			readonly: true,
			type: FieldType.Select,
			itemsSource: {
				items: ServiceLocator.injector.get(PPS_MATERIAL_PRODUCTIONMODES_TOKEN)
			}
		}
	}

};
