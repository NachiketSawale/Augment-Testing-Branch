/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LogisticCardTemplateJobCardRecordTemplateDataService } from '../services/data/logistic-card-template-job-card-record-template-data.service';
import { LogisticCardTemplateJobCardRecordTemplateValidationService } from '../services/validation/logistic-card-template-job-card-record-template-validation.service';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ILogisticCardTemplateJobCardRecordTemplateEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN } from '@libs/resource/interfaces';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { LogisticCardTemplateJobCardRecordTemplateDataGeneratedService } from '../services/data/generated/logistic-card-template-job-card-record-template-data-generated.service';
import { LOGISTIC_SUNDRY_SERVICE_LOOKUP_PROVIDER_TOKEN } from '@libs/logistic/shared';

export const LOGISTIC_CARD_TEMPLATE_JOB_CARD_RECORD_TEMPLATE_ENTITY_INFO = EntityInfo.create({
	grid: {
		title: {
			text: 'JobCardRecordTemplate',
			key: 'logistic.cardtemplate.cardTemplateRecordListTitle'
		}
	},
	form: {
		title: {
			text: 'JobCardRecordTemplate',
			key: 'logistic.cardtemplate.cardTemplateRecordDetailTitle'
		},
		containerUuid: 'c392eb6e54564b0da8a27a4e67876ea2'
	},
	dataService: (ctx) => ctx.injector.get(LogisticCardTemplateJobCardRecordTemplateDataService),
	validationService: (ctx) => ctx.injector.get(LogisticCardTemplateJobCardRecordTemplateValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Logistic.CardTemplate',
		typeName: 'JobCardRecordTemplateDto'
	},
	permissionUuid: '8614a7a865cb43628c4056226bf5ca52',
	layoutConfiguration: async (ctx) => {
		const resourceEquipmentLookupProvider = await ctx.lazyInjector.inject(RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN);
		const sundryServiceLookupProvider = await ctx.lazyInjector.inject(LOGISTIC_SUNDRY_SERVICE_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<ILogisticCardTemplateJobCardRecordTemplateEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: [
						'Code',
						'DescriptionInfo',
						'Quantity',
						'UomFk',
						'JobCardRecordTypeFk',
						'WorkOperationTypeFk',
						'MaterialFk',
						'PlantFk',
						'SundryServiceFk',
						'Comment',
						'Remark',
						'CardRecordFk',
						'CardRecordDescription',
					]
				},
			],
			overloads: {
				UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				JobCardRecordTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobCardRecordTypeLookupOverload(true),
				WorkOperationTypeFk: ResourceSharedLookupOverloadProvider.provideWorkOperationTypeLookupOverload(true),
				MaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true),
				PlantFk: resourceEquipmentLookupProvider.providePlantLookupOverload(),
				SundryServiceFk: sundryServiceLookupProvider.provideLogisticSundryServiceLookupOverload(),
				CardRecordFk: {
					type: FieldType.Dynamic,
					overload: ctx => {
						LogisticCardTemplateJobCardRecordTemplateDataGeneratedService.updateResultOverload(ctx.entity,resourceEquipmentLookupProvider,sundryServiceLookupProvider );
						return LogisticCardTemplateJobCardRecordTemplateDataGeneratedService.resultOverloadSubject;
					},
				},
			},
			labels: {
				...prefixAllTranslationKeys('logistic.cardtemplate.', {
					Code: { key: 'entityCode' },
					DescriptionInfo: { key: 'entityDescriptionInfo' },
					Quantity: { key: 'entityQuantity' },
					WorkOperationTypeFk: { key: 'workOperationTypeFk' },
					MaterialFk: { key: 'entityMaterial' },
					PlantFk: { key: 'entityPlant' },
					SundryServiceFk: { key: 'entitySundryService' },
					Comment: { key: 'entityComment' },
					Remark: { key: 'entityRemark' },
					CardRecordFk: { key: 'cardRecord' },
					CardRecordDescription: { key: 'cardRecordDescription' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					UomFk: { key: 'entityUoM' }
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					JobCardRecordTypeFk: { key: 'jobcardrecordtype' }
				}),
			 }
		};
	}
});