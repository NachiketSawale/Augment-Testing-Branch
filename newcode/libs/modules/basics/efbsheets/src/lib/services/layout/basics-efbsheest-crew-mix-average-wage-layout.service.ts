/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsEfbSheetsWageGroupLookupService } from '../../basics-efbsheets-lookup/basics-efb-sheets-wage-group-lookup.service';
import { IBasicsEfbsheetsAverageWageEntity } from '@libs/basics/interfaces';
/**
 * Basics efbsheets crew mix Af layout service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCrewMixesAverageWageLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IBasicsEfbsheetsAverageWageEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					attributes: ['Count', 'Supervisory', 'MdcWageGroupFk', 'MarkupRate']
				}
			],
			overloads: {
				MdcWageGroupFk: {
					lookupOptions: createLookup({
						dataServiceToken: BasicsEfbSheetsWageGroupLookupService,
					}),
					type: FieldType.Lookup,
					visible: true
				}
			},
			labels: {
				...prefixAllTranslationKeys('basics.efbsheets.', {
					Count: { key: 'count' },
					Supervisory: { key: 'supervisory' },
					MdcWageGroupFk: { key: 'entityWageGroup' },
					MarkupRate: { key: 'markupRate' }
				})
			}
			
		};
	}
}
