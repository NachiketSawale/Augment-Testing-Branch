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

import { ResourceEquipmentPlantPictureDataService } from '../../services/data/resource-equipment-plant-picture-data.service';
import { ResourceEquipmentPlantPictureValidationService } from '../../services/validation/resource-equipment-plant-picture-validation.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IResourceEquipmentPlantPictureEntity } from '@libs/resource/interfaces';
import { IEntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';

export const resourceEquipmentPlantPictureEntityInfoGenerated = <IEntityInfo<IResourceEquipmentPlantPictureEntity>>{
	grid: {
		title: {
			text: 'Photo List',
			key: 'resource.equipment.photoList'
		}
	},
	form: {
		title: {
			text: 'Photo List Detail',
			key: 'resource.equipment.photoList'
		},
		containerUuid: '2fbaff7c97954ea2a3a0846b35dad584'
	},
	dataService: (ctx) => ctx.injector.get(ResourceEquipmentPlantPictureDataService),
	validationService: (ctx) => ctx.injector.get(ResourceEquipmentPlantPictureValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.Equipment',
		typeName: 'PlantPictureDto'
	},
	permissionUuid: 'eebaa9c4e6c747b3b6fb477d8e285d69',
	layoutConfiguration: async (ctx) => {
		return <ILayoutConfiguration<IResourceEquipmentPlantPictureEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: [
						'BlobsFk',
						'PictureDate',
						'CommentText',
						'Sorting',
						'IsDefault',
						'IsHiddenInPublicApi',
					]
				},
			],
			overloads: {},
			labels: { 
				...prefixAllTranslationKeys('resource.equipment.', {
					BlobsFk: { key: 'entityBlobs' },
					PictureDate: { key: 'entityPictureData' },
					Sorting: { key: 'entitySorting' },
					IsDefault: { key: 'entityIsDefault' },
					IsHiddenInPublicApi: { key: 'isHiddenInPublicApi' }
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: { key: 'entityComment' }
				}),
			 }
		};
	}
};