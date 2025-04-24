/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILayoutConfiguration} from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IBasicsEfbsheetsEntity } from '@libs/basics/interfaces';

/**
 * Basics Cost Codes Price List layout service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCrewMixesLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IBasicsEfbsheetsEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['Code','DescriptionInfo','AverageStandardWage', 'CrewAverage', 'CrewMixAf', 'CrewMixAfsn', 'CrewSize', 'ExtraPay', 'HoursDay', 'TotalExtraCost', 'TotalHours', 'WageIncrease1', 'WageIncrease2', 'WorkingDaysMonths','TotalSurcharge','CurrencyFk','CommentText']
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.efbsheets.', {
					AverageStandardWage: { key: 'averageStandardWage' },
					CrewAverage: { key: 'crewAverage' },
					CrewMixAf: { key: 'crewMixAf' },
					CrewMixAfsn: { key: 'crewMixAfsn' },
					CrewSize: { key: 'crewSize' },
					ExtraPay: { key: 'extraPay' },
					HoursDay: { key: 'hoursDay' },
					TotalExtraCost: { key: 'totalExtraCost' },
					TotalHours: { key: 'totalHours' },
					WageIncrease1: { key: 'wageIncrease1' },
					WageIncrease2: { key: 'wageIncrease2' },
					WorkingDaysMonths: { key: 'workingDaysMonths'},
					TotalSurcharge: { key: 'totalSurcharge'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CurrencyFk:{ key: 'entityCurrency', text: 'Currency'},
					CommentText: {key: 'entityComment', text: 'Comment'}			
				})
			},
			overloads: {
				CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(true)
			},
		};
	}
}
