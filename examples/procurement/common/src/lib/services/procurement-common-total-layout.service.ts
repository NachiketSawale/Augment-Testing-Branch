/*
 * Copyright(c) RIB Software GmbH
 */

import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import { IReadonlyRootService, PrcSharedPrcConfigLookupService, PrcSharedTotalTypeLookupService } from '@libs/procurement/shared';
import { inject, Injectable, Injector, ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, prefixAllTranslationKeys } from '@libs/platform/common';
import { ProcurementCommonTotalDataService } from './procurement-common-total-data.service';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';
import { IPrcHeaderDataService } from '../model/interfaces';

/**
 * Common procurement total layout service
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementCommonTotalLayoutService {
	private readonly injector = inject(Injector);
	private readonly prcConfigLookup = inject(PrcSharedPrcConfigLookupService);

	public async generateLayout<T extends IPrcCommonTotalEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
		dataServiceToken?: ProviderToken<ProcurementCommonTotalDataService<T, PT, PU>>,
		parentService?: IPrcHeaderDataService<PT, PU> & IReadonlyRootService<PT, PU>
	}): Promise<ILayoutConfiguration<T>> {				
		let headerService: IPrcHeaderDataService<PT, PU> & IReadonlyRootService<PT, PU>;
		if(config.parentService) {
			headerService = config.parentService;
		} else if(config.dataServiceToken) {
			const dataService = this.injector.get(config.dataServiceToken);
			headerService = dataService.parentService;
		}
		
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['TotalTypeFk', 'ValueNet', 'ValueTax', 'Gross', 'ValueNetOc', 'ValueTaxOc', 'GrossOc', 'CommentText']
				}
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					TotalTypeFk: {text: 'Total Type', key: 'reqTotalTotalTypeFk'},
					ValueNet: {text: 'ValueNet', key: 'reqTotalValueNet'},
					ValueTax: {text: 'ValueTax', key: 'reqTotalValueTax'},
					Gross: {text: 'Gross', key: 'reqTotalGross'},
					ValueNetOc: {text: 'ValueNetOc', key: 'reqTotalValueNetOc'},
					ValueTaxOc: {text: 'ValueTaxOc', key: 'reqTotalValueTaxOc'},
					GrossOc: {text: 'GrossOc', key: 'reqTotalGrossOC'},
					CommentText: {text: 'Comment', key: 'reqTotalCommentText'},
				})
			},
			overloads: {
				TotalTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: PrcSharedTotalTypeLookupService,
						serverSideFilter: {
							key: 'procurement-common-total-type-filter',
							execute: context => {
								const header = headerService.getHeaderEntity();
								return new Promise(resolve => {
									this.prcConfigLookup.getItemByKey({
										id: header.ConfigurationFk
									}).subscribe(e => {
										resolve('PrcConfigHeaderFk=' + e.PrcConfigHeaderFk);
									});
								});
							}
						},
					}),
					additionalFields: [
						{
							id: 'description',
							displayMember: 'DescriptionInfo.Translated',
							label: {
								key: 'procurement.common.totalTypeDes',
							},
							column: true,
							singleRow: true,
						},
					]
				}
			}
		};
	}
}