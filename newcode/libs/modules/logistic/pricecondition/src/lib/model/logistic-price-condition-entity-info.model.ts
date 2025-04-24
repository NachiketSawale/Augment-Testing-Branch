/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticPriceConditionDataService } from '../services/logistic-price-condition-data.service';
import { IPriceConditionEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { LogisticPriceConditionValidationService } from '../services/logistic-price-condition-validation.service';
import { BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';


export const LOGISTIC_PRICE_CONDITION_ENTITY_INFO: EntityInfo = EntityInfo.create<IPriceConditionEntity>({
	grid: {
		title: {key: 'logistic.pricecondition' + '.listPriceConditionTitle'},
	},
	form: {
		title: {key: 'logistic.pricecondition' + '.detailPriceConditionTitle'},
		containerUuid: '24c4f1aecb6d4a5aa735201177521649',
	},
	dataService: ctx => ctx.injector.get(LogisticPriceConditionDataService),
	validationService: (ctx) => ctx.injector.get(LogisticPriceConditionValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.PriceCondition', typeName: 'PriceConditionDto'},
	permissionUuid: '5d0e37f033664ce6b0faf2114db0906a',
	layoutConfiguration: async context => {
		const basicsCurrencyLookupProvider = await context.lazyInjector.inject(BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Code', 'LogisticContextFk', 'IsHandlingCharge', 'HandlingChargeFull', 'HandlingChargeReduced', 'HandlingChargeExtern',
						'IsMultiple01', 'IsMultiple02', 'IsMultiple03', 'IsMultiple04', 'HandlingChargeRating01', 'HandlingChargeRating02', 'HandlingChargeRating03',
						'HandlingChargeRating04', 'DepartureRatingPercent', 'IsDefault', 'IsLive' /*, 'MasterDataPriceListFk', 'MasterDataCostCodePriceVersionFk'*/, 'CurrencyFk',
						'VolumeHandlingChargeReduced', 'VolumeHandlingChargeFull', /*'SundryServiceLoadingCostsFk',*/'DescriptionInfo',
						'UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05'],
				}
			],
			overloads: {
				LogisticContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideLogisticsContextReadonlyLookupOverload(),
				//SundryServiceLoadingCostsFk : LogisticSharedLookupOverloadProvider.provideLogisticSundryServiceLookupOverload(), Todo
				CurrencyFk: basicsCurrencyLookupProvider.provideCurrencyLookupOverload({showClearButton: true}),
			},
			labels: {
				...prefixAllTranslationKeys('logistic.pricecondition.', {
					LogisticContextFk: {key: 'entityLogisticContextFk'},
					IsHandlingCharge: {key: 'isHandlingCharge'},
					HandlingChargeFull: {key: 'handlingChargeFull'},
					HandlingChargeReduced: {key: 'handlingChargeReduced'},
					HandlingChargeExtern: {key: 'handlingChargeExtern'},
					IsMultiple01: {key: 'isMultiple01'},
					IsMultiple02: {key: 'isMultiple02'},
					IsMultiple03: {key: 'isMultiple03'},
					IsMultiple04: {key: 'isMultiple04'},
					HandlingChargeRating01: {key: 'handlingChargeRating01'},
					HandlingChargeRating02: {key: 'handlingChargeRating02'},
					HandlingChargeRating03: {key: 'handlingChargeRating03'},
					HandlingChargeRating04: {key: 'handlingChargeRating04'},
					DepartureRatingPercent: {key: 'departureRatingPercent'},
					/*MasterDataPriceListFk: {key: 'entityMasterDataPriceListFk'},*/
					/*MasterDataCostCodePriceVersionFk: {key: 'entityMasterDataCostCodePriceVersionFk'},*/
					VolumeHandlingChargeReduced: {key: 'volumeHandlingChargeReduced'},
					VolumeHandlingChargeFull: {key: 'volumeHandlingChargeFull'},
					SundryServiceLoadingCostsFk: {key: 'entitySundryServiceLoadingCostsFk'},

				}),
				...prefixAllTranslationKeys('cloud.common.', {
					IsDefault: {key: 'entityIsDefault'},
					IsLive: {key: 'entityIsLive'},
					DescriptionInfo: {key: 'entityDescription'},
					Code: {key: 'entityCode'},
					userDefTextGroup: {key: 'UserDefinedText'},
					UserDefinedText01: {key: 'entityUserDefText', params: {'p_0': '1'}},
					UserDefinedText02: {key: 'entityUserDefText', params: {'p_0': '2'}},
					UserDefinedText03: {key: 'entityUserDefText', params: {'p_0': '3'}},
					UserDefinedText04: {key: 'entityUserDefText', params: {'p_0': '4'}},
					UserDefinedText05: {key: 'entityUserDefText', params: {'p_0': '5'}},
					CurrencyFk: {key: 'entityCurrency'}
				})
			}
		};
	},

});