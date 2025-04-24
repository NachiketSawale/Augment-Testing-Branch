/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsEfbSheetsSurchargeLookupService } from '../../basics-efbsheets-lookup/basics-efb-sheets-surcharge-lookup-data.service';
import { IEstCrewMixAfEntity } from '@libs/basics/interfaces';

/**
 * Basics efbsheets crew mix Af layout service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCrewMixesAfLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IEstCrewMixAfEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['MarkupRate', 'PercentHour', 'RateHour']
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.efbsheets.', {
					EstCrewMixFk: { key: 'entityWageGroup' },
					MarkupRate: { key: 'markupRate' },
					PercentHour: { key: 'percentHour' },
					RateHour: { key: 'rateHour' }
				})
			},
			overloads: {
				MdcWageGroupFk: {
					lookupOptions: createLookup({
						dataServiceToken: BasicsEfbSheetsSurchargeLookupService,
					}),
					type: FieldType.Lookup,
					visible: true
				}
			}
			
		};
	}
}
