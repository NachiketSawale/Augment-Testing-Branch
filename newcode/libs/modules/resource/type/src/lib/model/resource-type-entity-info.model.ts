/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { IResourceTypeEntity } from '@libs/resource/interfaces';
import { ResourceTypeDataService } from '../services/data/resource-type-data.service';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { ResourceTypeValidationService } from '../services/validation/resource-type-validation.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

const resourceTypeEntityInfo = <IEntityInfo<IResourceTypeEntity>>{

	grid: {
		title: {key: 'resource.type.typeListTitle'},
		treeConfiguration: ctx => {
			return {
				parent: function (entity: IResourceTypeEntity) {
					const service = ctx.injector.get(ResourceTypeDataService);
					return service.parentOf(entity);
				},
				children: entity => entity.SubResources
			} as IGridTreeConfiguration<IResourceTypeEntity>;
		}
	},
	form: {
		title: {key: 'resource.type.typeDetailTitle'},
		containerUuid: '02941383fd24429f9ba46df30b2f6d6c'
	},
	dataService: ctx => ctx.injector.get(ResourceTypeDataService),
	validationService: (ctx: IInitializationContext) => ctx.injector.get(ResourceTypeValidationService),
	dtoSchemeId: {moduleSubModule: 'Resource.Type', typeName: 'ResourceTypeDto'},
	permissionUuid: 'b881141e03c14ddfb1aa965c0cb9ea2c',
	layoutConfiguration: {
		groups: [{
			gid: 'baseGroup',
			attributes: ['DescriptionInfo', 'DispatcherGroupFk', 'UoMFk', 'IsPlant','IsCrane','IsTruck','IsDriver','IsDetailer', 'IsStructuralEngineer',
				'CommentText', 'Specification', /*'PrcStructureFk', 'MdcMaterialFk',*/ 'IsSmallTools', 'CreateTemporaryResource', 'IsBulk']
		},{
			gid: 'userDefTexts',
			attributes: ['UserDefinedText01','UserDefinedText02','UserDefinedText03','UserDefinedText04','UserDefinedText05']
		},{
			gid: 'userDefNumbers',
			attributes: ['UserDefinedNumber01','UserDefinedNumber02','UserDefinedNumber03','UserDefinedNumber04','UserDefinedNumber05']
		},{
			gid: 'userDefDates',
			attributes: ['UserDefinedDate01','UserDefinedDate02','UserDefinedDate03','UserDefinedDate04','UserDefinedDate05']
		},{
			gid: 'userDefBooleans',
			attributes: ['UserDefinedBool01','UserDefinedBool02','UserDefinedBool03','UserDefinedBool04','UserDefinedBool05']
		}
		],
		overloads: {
			DispatcherGroupFk: BasicsSharedLookupOverloadProvider.provideLogisticsDispatcherGroupLookupOverload(true)
			//PrcStructureFk: BasicsSharedLookupOverloadProvider.providePrcStructureLookupOverload(true),
			//MdcMaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('resource.type.', {
				IsCrane: {key: 'IsCrane'},
				IsTruck: {key: 'IsTruck'},
				IsDriver: {key: 'IsDriver'},
				IsDetailer: {key: 'entityIsDetailer'},
				IsStructuralEngineer: {key: 'entityIsStructuralEngineer'},
				IsPlant: {key: 'entityIsPlant'},
				/*PrcStructureFk: {key: 'entityProcurementStructure'},
				MdcMaterialFk: {key: 'entityMaterial'},*/
				IsSmallTools: {key: 'entityIsSmallTools'},
				CreateTemporaryResource: {key: 'entityCreateTemporaryResource'},
				IsBulk: {key: 'entityIsBulk'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				DescriptionInfo: {key: 'entityDescription'},
				UoMFk: {key: 'entityUoM'},
				CommentText: {key: 'entityComment'},
				Specification: {key: 'EntitySpec'},
				userDefTexts: {key: 'UserdefTexts'},
				userDefNumbers: {key: 'UserdefNumbers'},
				userDefDates: {key: 'UserdefDates'},
				userDefBooleans: {key: 'UserdefBools'}
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				DispatcherGroupFk: {key: 'logisticsdispatchergroup'}
			})
		}
	}
};

export const RESOURCE_TYPE_ENTITY_INFO = EntityInfo.create(resourceTypeEntityInfo);