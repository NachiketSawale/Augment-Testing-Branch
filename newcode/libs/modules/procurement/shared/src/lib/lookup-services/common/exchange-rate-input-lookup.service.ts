/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, LookupFreeInputModelType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { BasicsSharedCurrencyLookupService, BasicsSharedCurrencyRateTypeLookupService } from '@libs/basics/shared';
import { IExchangeRateLookupEntity } from '@libs/procurement/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProcurementSharedExchangeRateInputLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IExchangeRateLookupEntity, TEntity> {
	public constructor() {
		super(
			{
				httpRead: {
					route: 'procurement/common/exchangerate/',
					endPointRead: 'exchangeratelookup',
					usePostForRead: false,
				},
				filterParam: true,
				prepareListFilter: (context) => {
					const tempEntity = context?.entity as unknown as {
						ProjectFk: number;
						CurrencyFk?: number;
						BasCurrencyFk?: number;
						CompanyFk: number;
					};
					return 'projectFk=' + tempEntity?.ProjectFk + '&currencyForeignFk=' + (tempEntity?.CurrencyFk || tempEntity?.BasCurrencyFk) + '&companyFk=' + tempEntity?.CompanyFk;
				},
			},
			{
				uuid: '7f3f3fd519a24c73994223f45b6e90ba',
				idProperty: 'Id',
				valueMember: 'Rate',
				displayMember: 'Rate',
				freeValueMember: 'Rate',
				freeInputType: LookupFreeInputModelType.Number,
				gridConfig: {
					columns: [
						{
							id: 'currencyForeignFk',
							model: 'CurrencyForeignFk',
							label: 'basics.currency.ForeignCurrency',
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedCurrencyLookupService,
							}),
							sortable: true,
							readonly: true,
							visible: true,
						},
						{
							id: 'currencyRateTypeFk',
							model: 'CurrencyRateTypeFk',
							label: 'basics.currency.RateType',
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedCurrencyRateTypeLookupService,
								displayMember: 'DescriptionInfo.Translated',
							}),
							sortable: true,
							readonly: true,
							visible: true,
						},
						{
							id: 'rate',
							model: 'Rate',
							label: 'cloud.common.entityRate',
							type: FieldType.ExchangeRate,
							sortable: true,
							readonly: true,
							visible: true,
						},
						{
							id: 'comment',
							model: 'CommentText',
							label: 'cloud.common.entityComment',
							type: FieldType.Comment,
							sortable: true,
							readonly: true,
							visible: true,
						},
						{
							id: 'rateDate',
							model: 'RateDate',
							label: 'basics.currency.RateDate',
							type: FieldType.DateUtc,
							sortable: true,
							readonly: true,
							visible: true,
						},
						{
							id: 'projectNo',
							model: 'ProjectNo',
							label: 'cloud.common.entityProjectNo',
							type: FieldType.Description,
							sortable: true,
							readonly: true,
							visible: true,
						},
					],
				},
			},
		);
	}
}