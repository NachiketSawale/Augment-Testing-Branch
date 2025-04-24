/*
 * Copyright(c) RIB Software GmbH
 */
import { get } from 'lodash';
import { Injectable } from '@angular/core';
import {
	FieldType,
	ILookupSearchRequest,
	UiCommonLookupEndpointDataService,
	createLookup
} from '@libs/ui/common';
import { BasicsSharedPriceListLookupService } from './customize';
import {  IBasicsCustomizePriceListEntity, ICostcodePriceListEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesPriceListSelectionLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<ICostcodePriceListEntity, TEntity> {

	private mdcCostCodeId: number = 1;

	public constructor() {
		super(
			{
				httpRead: {
					route: 'basics/costcodes/version/list/',
					endPointRead: 'getpricelistbymdccostcodeid',
					usePostForRead: false,
				},
				filterParam:true,
				prepareListFilter :()=>{
						return 'mdcCostCodeId=' +  this.mdcCostCodeId;
				}
			},
			{
				uuid: '9559CE85EE5B4D67A899F0C38A6D9D05',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				gridConfig: {
					columns: [
						{
							id: 'priceverdesc',
							model: 'DescriptionInfo.Translated',
							width: 150,
							type: FieldType.Translation,
							label: {
								text: 'Price Version Description',
								key: 'basics.costcodes.priceList.priceVersionDescription'
							},
							sortable: true,
							visible: true,
							readonly: true
						},
						{
							id: 'pricelistfk',
							model: 'mdcPriceListFK',
							type: FieldType.Lookup,
							label: { text: 'Price List Description', key: 'basics.costcodes.priceList.priceListDescription' },
							lookupOptions:  createLookup<ICostcodePriceListEntity, IBasicsCustomizePriceListEntity>( {
								dataServiceToken: BasicsSharedPriceListLookupService,
								showClearButton: true
							}),
							sortable: true,
							visible: true,
							readonly: true,
							width: 150
						},
					]
				},
				showDialog: false,
				showGrid: true
			});
	}

	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		const mdcCostCodeId = get(request.additionalParameters, 'costCodeId');
		this.mdcCostCodeId = mdcCostCodeId ?? 1;
		return 'mdcCostCodeId='+ this.mdcCostCodeId;
	}
}