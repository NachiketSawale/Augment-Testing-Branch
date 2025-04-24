/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { PlantGroupSpecificValueDataService } from '../services/plant-group-specific-value-data.service';
import { PlantGroupSpecificValueValidationService } from '../services/plant-group-specific-value-validation.service';
import { IEntityInfo, EntityInfo } from '@libs/ui/business-base';
import { IPlantGroupSpecificValueEntity } from '@libs/resource/interfaces';
import { BasicsSharedLookupOverloadProvider } from "@libs/basics/shared";

export const resourceEquipmentGroupPlantGroupSpecificValueModuleInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.specificValueList'
		}
	},
	form: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.specificValueDetail'
		},
		containerUuid: '64181b7641994080b6cf3cbecc12f832'
	},
	dataService: (ctx) => ctx.injector.get(PlantGroupSpecificValueDataService),
	validationService: (ctx) => ctx.injector.get(PlantGroupSpecificValueValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.EquipmentGroup',
		typeName: 'PlantGroupSpecificValueDto'
	},
	permissionUuid: '20cd31beb1a34ec8b7d300095139221b',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: [
					'PlantGroupFk',
					'DescriptionInfo',
					'SpecificValueTypeFk',
					'UomFromTypeFk',
					'UomFk',
					'IsInherited',
					'IsManual',
					'CommentText',
					'Value',
					'Factor',
					'CostCodeFk',
					'PlantAssemblyTypeFk',
				]
			},
		],
		overloads: {
			SpecificValueTypeFk: BasicsSharedLookupOverloadProvider.provideSpecificValueTypeLookupOverload(false),
			UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			UomFromTypeFk: BasicsSharedLookupOverloadProvider.provideUoMReadonlyLookupOverload(),
			CostCodeFk: BasicsSharedLookupOverloadProvider.provideCostCodeLookupOverload(true),
			PlantAssemblyTypeFk: BasicsSharedLookupOverloadProvider.provideEstAssemblyTypeLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('resource.equipmentgroup.', {
				PlantGroupFk: { key: 'entityPlantGroup' },
				DescriptionInfo: { key: 'entityDescriptionInfo' },
				UomFromTypeFk: { key: 'uomFromType' },
				IsInherited: { key: 'isInherited' },
				PlantGroupSpecificValueFk: { key: 'entityPlantGroupSpecificValue' }
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				SpecificValueTypeFk: { key: 'specificvaluetype' },
				IsManual: { key: 'isManual' },
				Value: { key: 'specificvaluetype' },
				Factor: { key: 'factor' },
				CostCodeFk: { key: 'costCode' },
				PlantAssemblyTypeFk: { key: 'plantassemblytype' }
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				UomFk: { key: 'entityUoM' },
				CommentText: { key: 'entityComment' }
			}),
		}
	}
} as IEntityInfo<IPlantGroupSpecificValueEntity>);