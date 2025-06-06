/*
 * Copyright(c) RIB Software GmbH
 * ----------------------------------------------------------------------
 * This is auto-generated code by ClientTSEntityInfoGenerator.
 * ----------------------------------------------------------------------
 * This code was generated by RIB Model Generator tool.
 *
 * Changes to this file may cause incorrect behavior and will be lost if
 * the code is regenerated.
 * ----------------------------------------------------------------------
 */

import { ResourceEquipmentPlantMeterReadingDataService } from '../../services/data/resource-equipment-plant-meter-reading-data.service';
import { ResourceEquipmentPlantMeterReadingValidationService } from '../../services/validation/resource-equipment-plant-meter-reading-validation.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IResourceEquipmentPlantMeterReadingEntity } from '@libs/resource/interfaces';
import { IEntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';

export const resourceEquipmentPlantMeterReadingEntityInfoGenerated = <IEntityInfo<IResourceEquipmentPlantMeterReadingEntity>>{
	grid: {
		title: {
			text: 'Meter Readings',
			key: 'resource.equipment.meterReadingListTitle'
		}
	},
	form: {
		title: {
			text: 'Meter Readings Detail',
			key: 'resource.equipment.meterReadingDetailTitle'
		},
		containerUuid: '4e5a48e1ff614608841430ce1a19101c'
	},
	dataService: (ctx) => ctx.injector.get(ResourceEquipmentPlantMeterReadingDataService),
	validationService: (ctx) => ctx.injector.get(ResourceEquipmentPlantMeterReadingValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.Equipment',
		typeName: 'PlantMeterReadingDto'
	},
	permissionUuid: '0c898f4872c244e599379151ebd8830f',
	layoutConfiguration: async (ctx) => {
		return <ILayoutConfiguration<IResourceEquipmentPlantMeterReadingEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: [
						'Recorded',
						'Quantity',
						'Comment',
						'UserDefinedText01',
						'UserDefinedText02',
						'UserDefinedText03',
						'UserDefinedText04',
						'UserDefinedText05',
						'UserDefinedInt01',
						'UserDefinedInt02',
						'UserDefinedInt03',
						'UserDefinedInt04',
						'UserDefinedInt05',
						'UserDefinedDate01',
						'UserDefinedDate02',
						'UserDefinedDate03',
						'UserDefinedDate04',
						'UserDefinedDate05',
						'UserDefinedNumber01',
						'UserDefinedNumber02',
						'UserDefinedNumber03',
						'UserDefinedNumber04',
						'UserDefinedNumber05',
						'Longitude',
						'Latitude',
						'PlantFk',
					]
				},
			],
			overloads: {},
			labels: { 
				...prefixAllTranslationKeys('resource.equipment.', {
					Recorded: { key: 'recorded' },
					Quantity: { key: 'entityItemQuantity' },
					UserDefinedText01: { key: 'entityUserDefinedText01' },
					UserDefinedText02: { key: 'entityUserDefinedText02' },
					UserDefinedText03: { key: 'entityUserDefinedText03' },
					UserDefinedText04: { key: 'entityUserDefinedText04' },
					UserDefinedText05: { key: 'entityUserDefinedText05' },
					UserDefinedInt01: { key: 'entityUserDefinedInt01' },
					UserDefinedInt02: { key: 'entityUserDefinedInt02' },
					UserDefinedInt03: { key: 'entityUserDefinedInt03' },
					UserDefinedInt04: { key: 'entityUserDefinedInt04' },
					UserDefinedInt05: { key: 'entityUserDefinedInt05' },
					UserDefinedDate01: { key: 'entityUserDefinedDate01' },
					UserDefinedDate02: { key: 'entityUserDefinedDate02' },
					UserDefinedDate03: { key: 'entityUserDefinedDate03' },
					UserDefinedDate04: { key: 'entityUserDefinedDate04' },
					UserDefinedDate05: { key: 'entityUserDefinedDate05' },
					UserDefinedNumber01: { key: 'entityUserDefinedNumber01' },
					UserDefinedNumber02: { key: 'entityUserDefinedNumber02' },
					UserDefinedNumber03: { key: 'entityUserDefinedNumber03' },
					UserDefinedNumber04: { key: 'entityUserDefinedNumber04' },
					UserDefinedNumber05: { key: 'entityUserDefinedNumber05' },
					Longitude: { key: 'longitude' },
					Latitude: { key: 'latitude' },
					PlantFk: { key: 'entityPlant' }
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Comment: { key: 'entityComment' }
				}),
			 }
		};
	}
};