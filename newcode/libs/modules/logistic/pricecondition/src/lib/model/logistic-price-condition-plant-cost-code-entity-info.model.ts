/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticPriceConditionPlantCostCodeDataService } from '../services/logistic-price-condition-plant-cost-code-data.service';
import { IPlantCostCodeEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { EQUIPMENT_GROUP_LOOKUP_PROVIDER_TOKEN} from '@libs/resource/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';


export const LOGISTIC_PRICE_CONDITION_PLANT_COST_CODE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPlantCostCodeEntity>({
	grid: {
		title: {key: 'logistic.pricecondition' + '.listPlantCostCodeTitle'},
	},
	form: {
		title: {key: 'logistic.pricecondition' + '.detailPlantCostCodeTitle'},
		containerUuid: '28e3bcdb271d40f29c2f1a97683dc1ca',
	},

	dataService: ctx => ctx.injector.get(LogisticPriceConditionPlantCostCodeDataService),
	dtoSchemeId: {moduleSubModule: 'Logistic.PriceCondition', typeName: 'PlantCostCodeDto'},
	permissionUuid: '767c6e762ece45f6bedf133f02e9baa3',
	layoutConfiguration: async (ctx) => {
		const plantGroupLookupProvider = await ctx.lazyInjector.inject(EQUIPMENT_GROUP_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IPlantCostCodeEntity>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['PlantGroupFk', 'IsManual', 'UomDayFk', 'UomHourFk', 'UomMonthFk', 'PlantGroupSpecValueFk',
						'UomIdleFk', 'DayWotFk', 'HourWotFk', 'MonthWotFk', 'IdleWotFk', 'PercentageHour', 'PercentageDay', 'PercentageMonth', 'PercentageIdle'],
				}
			],
			//Todo UomHourFk, UomMonthFk, UomIdleFk,DayWotFk, HourWotFk, MonthWotFk, IdleWotFk
			overloads: {
				UomDayFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				PlantGroupFk: plantGroupLookupProvider.generateEquipmentGroupReadOnlyLookup()
			},
			labels: {
				...prefixAllTranslationKeys('logistic.pricecondition.', {
					PlantGroupFk: {key: 'plantGroupFk'},
					UomDayFk: {key: 'uomDayFk'},
					UomHourFk: {key: 'uomHourFk'},
					UomMonthFk: {key: 'uomMonthFk'},
					PlantGroupSpecValueFk: {key: 'plantGroupSpecValueFK'},
					UomIdleFk: {key: 'uomIdleFk'},
					DayWotFk: {key: 'dayWotFk'},
					HourWotFk: {key: 'hourWotFk'},
					MonthWotFk: {key: 'monthWotFk'},
					IdleWotFk: {key: 'idleWotFk'},
					PercentageHour: {key: 'percentageHour'},
					PercentageDay: {key: 'percentageDay'},
					PercentageMonth: {key: 'percentageMonth'},
					PercentageIdle: {key: 'percentageIdle'},
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					IsManual: {key: 'isManual'},
				})
			}
		};
	},
});