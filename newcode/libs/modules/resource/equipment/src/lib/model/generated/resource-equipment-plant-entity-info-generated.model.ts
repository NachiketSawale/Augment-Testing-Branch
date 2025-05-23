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

import { ResourceEquipmentPlantDataService } from '../../services/data/resource-equipment-plant-data.service';
import { ResourceEquipmentPlantValidationService } from '../../services/validation/resource-equipment-plant-validation.service';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IResourceEquipmentPlantEntity } from '@libs/resource/interfaces';
import { IEntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';

export const resourceEquipmentPlantEntityInfoGenerated = <IEntityInfo<IResourceEquipmentPlantEntity>>{
	grid: {
		title: {
			text: 'Plants',
			key: 'resource.equipment.plantListTitle'
		}
	},
	form: {
		title: {
			text: 'Plants Detail',
			key: 'resource.equipment.plantDetailTitle'
		},
		containerUuid: '14744d2f5e004676abfefd1329b6beff'
	},
	dataService: (ctx) => ctx.injector.get(ResourceEquipmentPlantDataService),
	validationService: (ctx) => ctx.injector.get(ResourceEquipmentPlantValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.Equipment',
		typeName: 'EquipmentPlantDto'
	},
	permissionUuid: 'b71b610f564c40ed81dfe5d853bf5fe8',
	layoutConfiguration: async (ctx) => {
		return <ILayoutConfiguration<IResourceEquipmentPlantEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: [
						'PlantStatusFk',
						'IsLive',
						//'PlantGroupFk',
						'Code',
						'AlternativeCode',
						'DescriptionInfo',
						'LongDescriptionInfo',
						'Specification',
						'Matchcode',
						'NfcId',
						'SerialNumber',
						'PlantTypeFk',
						//'ProcurementStructureFk',
						'UoMFk',
						'PlantKindFk',
						'RubricCategoryFk',
						'RegNumber',
						//'CompanyFk',
						'ValidFrom',
						'ValidTo',
						'CommentText',
						'UserDefined01',
						'UserDefined02',
						'UserDefined03',
						'UserDefined04',
						'UserDefined05',
						'SearchPattern',
						'DangerClassFk',
						'PackageTypeFk',
						'DangerCapacity',
						'UomDcFk',
						//'ClerkOwnerFk',
						//'ClerkResponsibleFk',
						'BasUomTranspsizeFk',
						'BasUomTranspweightFk',
						'Transportlength',
						'Transportwidth',
						'Transportheight',
						'Transportweight',
						'HasPoolJob',
						'LoadingCostFk',
						'CardNumber',
					]
				},
			],
			overloads: {
				PlantStatusFk: BasicsSharedCustomizeLookupOverloadProvider.providePlantStatusLookupOverload(true),
				PlantTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePlantTypeLookupOverload(true),
				UoMFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				PlantKindFk: BasicsSharedCustomizeLookupOverloadProvider.providePlantKindLookupOverload(true),
				RubricCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideRubricCategoryLookupOverload(true),
				DangerClassFk: BasicsSharedCustomizeLookupOverloadProvider.provideDangerClassLookupOverload(true),
				PackageTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePackagingTypesLookupOverload(true),
				UomDcFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				BasUomTranspsizeFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				BasUomTranspweightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				LoadingCostFk: BasicsSharedCustomizeLookupOverloadProvider.provideLoadingCostLookupOverload(true)
			},
			labels: { 
				...prefixAllTranslationKeys('resource.equipment.', {
					PlantStatusFk: { key: 'plantStatus' },
					PlantGroupFk: { key: 'entityResourceEquipmentGroup' },
					AlternativeCode: { key: 'entityAlternativeCode' },
					DescriptionInfo: { key: 'entityLongDescription' },
					LongDescriptionInfo: { key: 'entityLongDescription' },
					Specification: { key: 'entitySpecification' },
					Matchcode: { key: 'entityMatchCode' },
					NfcId: { key: 'nfcId' },
					SerialNumber: { key: 'entitySerialNumber' },
					PlantTypeFk: { key: 'planttype' },
					ProcurementStructureFk: { key: 'entityProcurementStructure' },
					UoMFk: { key: 'entityUoM' },
					PlantKindFk: { key: 'plantkind' },
					RubricCategoryFk: { key: 'RubricCategoryFk' },
					RegNumber: { key: 'entityRegNumber' },
					UserDefined01: { key: 'entityUserDefined01' },
					UserDefined02: { key: 'entityUserDefined02' },
					UserDefined03: { key: 'entityUserDefined03' },
					UserDefined04: { key: 'entityUserDefined04' },
					UserDefined05: { key: 'entityUserDefined05' },
					SearchPattern: { key: 'entitySearchPattern' },
					DangerClassFk: { key: 'entityDangerClass' },
					PackageTypeFk: { key: 'entityPackageTypeFk' },
					DangerCapacity: { key: 'entityDangerCapacity' },
					UomDcFk: { key: 'entityUomDcFk' },
					ClerkOwnerFk: { key: 'entityClerkOwner' },
					ClerkResponsibleFk: { key: 'entityClerkResponsible' },
					BasUomTranspsizeFk: { key: 'basUomTranspsizeFk' },
					BasUomTranspweightFk: { key: 'basUomTranspweightFk' },
					Transportlength: { key: 'transportlength' },
					Transportwidth: { key: 'transportwidth' },
					Transportheight: { key: 'transportheight' },
					Transportweight: { key: 'transportweight' },
					HasPoolJob: { key: 'hasPoolJob' },
					LoadingCostFk: { key: 'entityLoadingCostFk' },
					CardNumber: { key: 'cardNumber' }
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					Code: { key: 'costCode' }
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					IsLive: { key: 'entityIsLive' },
					CompanyFk: { key: 'entityCompany' },
					ValidFrom: { key: 'entityValidFrom' },
					ValidTo: { key: 'entityValidTo' },
					CommentText: { key: 'entityComment' }
				}),
			 }
		};
	}
};