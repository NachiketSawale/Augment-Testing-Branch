/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EstimateParameterPrjParamDataService } from '../services/estimate-parameter-prj-param-data.service';
import { IEstimateParameterPrjEntity } from './entities/estimate-parameter-prj-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { FieldType } from '@libs/ui/common';

/**
 * Provides basic information about the container
 */
export const ESTIMATE_PARAMETER_PRJ_PARAM_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstimateParameterPrjEntity>({
	grid: {
		containerUuid: '0f73eafb75614d60bb5334d6586fd539',
		title: { key: 'estimate.parameter.prjParamContainer' }		
	},

	dataService: ctx => ctx.injector.get(EstimateParameterPrjParamDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Parameter', typeName: 'EstPrjParamDto' },
	permissionUuid: '0f73eafb75614d60bb5334d6586fd539',
	layoutConfiguration: {
		groups: [
			{
				gid: 'estimate.parameter.detailform',
				title: {
					text: 'Basic Data',
					key: 'estimate.parameter.detailform',
				},
				attributes: ['Code', 'DescriptionInfo', 'ValueDetail', 'ParameterValue', 'IsLookup', 'DefaultValue', 'ValueType', 'EstRuleParamValueFk', 'UoMFk', 'EstParameterGroupFk'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Code: { key: 'entityCode' },
				DescriptionInfo: { key: 'entityDescription' },
				UoMFk: { key: 'entityUoM' },
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				ParameterValue: { key: 'parametervalue' },
				EstParameterGroupFk: { key: 'estparametergroup' },
			}),
			...prefixAllTranslationKeys('estimate.parameter.', {
				ValueDetail: { key: 'valueDetail' },
				IsLookup: { key: 'isLookup' },
				DefaultValue: { key: 'defaultValue' },
				ValueType: { key: 'valueType' },
				EstRuleParamValueFk: { key: 'estRuleParamValueFk' },
			}),
		},
		overloads: {
			UoMFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			DescriptionInfo: {
				type: FieldType.Translation,
			},
			Code: BasicsSharedCustomizeLookupOverloadProvider.provideEstParameterLookupOverload(true),
			EstParameterGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideEstParameterGroupLookupOverload(true),
			EstRuleParamValueFk: BasicsSharedCustomizeLookupOverloadProvider.provideEstParameterValueTypeLookupOverload(true),
		},
	},
});
