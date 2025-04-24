/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticJobPrj2MaterialDataService } from '../services/logistic-job-prj2-material-data.service';
import { IProject2MaterialEntity } from '@libs/logistic/interfaces';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const LOGISTIC_JOB_PRJ2_MATERIAL_ENTITY_INFO: EntityInfo = EntityInfo.create<IProject2MaterialEntity>({
	grid: {
		title: {key: 'logistic.job' + '.prjMaterialListTitle'},
	},
	form: {
		title: {key: 'logistic.job' + '.prjMaterialDetailTitle'},
		containerUuid: '34673772740a46fda71000928bf0eb7d',
	},
	dataService: ctx => ctx.injector.get(LogisticJobPrj2MaterialDataService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Job', typeName: 'Project2MaterialDto'},
	permissionUuid: '36d8fdec018141e6b4b3a450425849b0',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['MaterialDiscountGrpFk', 'TaxCodeFk', 'CurrencyFk', 'ProjectFk', 'MaterialFk', 'MaterialGroupFk',
					'UomFk', 'RetailPrice', 'ListPrice', 'Discount', 'Charges', 'Cost', 'PriceConditionFk', 'PriceExtra', 'EstimatePrice',
					'PriceUnit', 'UomPriceUnitFk', 'FactorPriceUnit', 'CommentText', 'CostTypeFk', 'FactorHour', 'DayWorkRate', 'Co2Source', 'Co2SourceFk',
					'Co2Project'],
			},
		],
		overloads: {
			//TODO: MaterialDiscountGrpFk
			TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
			CurrencyFk: BasicsSharedCustomizeLookupOverloadProvider.provideCurrencyRateTypeLookupOverload(true),
			ProjectFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectModeLookupOverload(true),
			MaterialFk: BasicsSharedCustomizeLookupOverloadProvider.provideMaterialCatalogTypeLookupOverload(true),
			//TODo:MaterialGroupFk
			UomFk: BasicsSharedCustomizeLookupOverloadProvider.provideUoMTypeLookupOverload(true),
			PriceConditionFk: BasicsSharedCustomizeLookupOverloadProvider.providePriceConditionTypeLookupOverload(true),
			//TODO:UomPriceUnitFk
			CostTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCostTypeLookupOverload(true),
			Co2SourceFk: BasicsSharedCustomizeLookupOverloadProvider.provideCo2SourceLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('logistic.job', {
				JobPerformingFk: {key: 'entityJobPerforming'},
				EquipmentPriceListFk: {key: 'equipmentPriceList'},
				EvaluationOrder: {key: 'evaluationOrder'},
				FactorPriceUnit: {key: 'factorPriceUnit'},
				FactorHour: {key: 'factorHour'},
				DayWorkRate: {key: 'entityDayWorkRate'},
				Co2Source: {key: 'entityCo2Source'},
				Co2SourceFk: {key: 'entityCo2SourceFk'},
				Co2Project: {key: 'entityCo2Project'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				TaxCodeFk: {key: 'entityTaxCode'},
				CurrencyFk: {key: 'entityCurrency'},
				ProjectFk: {key: 'entityProject'},
				UomFk: {key: 'entityUoM'},
				PriceConditionFk: {key: 'entityPriceCondition'},
				PriceUnit: {key: 'entityPriceUnit'},
				UomPriceUnitFk: {key: 'entityPriceUnitUoM'},
				CommentText: {key: 'entityCommentText'},
			}),
			...prefixAllTranslationKeys('basics.material.', {
				MaterialDiscountGrpFk: {key: 'record.discountGroup'},
				MaterialGroupFk: {key: 'record.materialGroup'},
				MaterialFk: {key: 'record.material'},
				RetailPrice: {key: 'record.retailPrice'},
				ListPrice: {key: 'record.listPrice'},
				Discount: {key: 'record.discount'},
				Charges: {key: 'record.charges'},
				Cost: {key: 'record.costPrice'},
				PriceExtra: {key: 'record.priceExtras'},
				EstimatePrice: {key: 'record.estimatePrice'},
				CostTypeFk: {key: 'record.estCostTypeFk'},


			})
		},
	},

});