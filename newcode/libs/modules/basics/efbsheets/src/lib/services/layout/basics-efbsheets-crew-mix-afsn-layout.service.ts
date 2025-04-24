/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsEfbSheetsAdditionalCostLookupService } from '../../basics-efbsheets-lookup/basics-efb-sheets-additional-cost-lookup-data.service';
import { IEstCrewMixAfsnEntity } from '@libs/basics/interfaces';

/**
 * Basics efbsheets crew mix Af layout service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCrewMixesAfsnLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IEstCrewMixAfsnEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					attributes: ['MdcWageGroupFk', 'MarkupRate', 'RateHour']
				}
			],
			overloads: {
				MdcWageGroupFk: {
					lookupOptions: createLookup({
						dataServiceToken: BasicsEfbSheetsAdditionalCostLookupService,
					}),
					type: FieldType.Lookup,
					visible: true,
				}
			},
			labels: {
				...prefixAllTranslationKeys('basics.efbsheets.', {
					MdcWageGroupFk: { key: 'entityWageGroup' },
					MarkupRate: { key: 'markupRate' },
					RateHour: { key: 'rateHour' }
				})
			}
		};
	}
}
