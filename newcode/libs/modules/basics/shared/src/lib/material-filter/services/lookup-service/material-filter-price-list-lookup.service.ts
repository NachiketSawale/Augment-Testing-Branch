/*
 * Copyright(c) RIB Software GmbH
 */

import { isNil } from 'lodash';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IMaterialSearchEntity } from '../../../material-search';
import { IEntityContext, IIdentificationData } from '@libs/platform/common';
import { IMaterialSearchPriceList } from '../../../material-search/model/interfaces/material-search-price-list.interface';
import { createLookup, FieldType, ILookupEvent, ILookupMultiSelectEvent, ILookupSearchRequest, ILookupSearchResponse, LookupEvent, LookupEventType, UiCommonLookupReadonlyDataService } from '@libs/ui/common';
import { BasicsSharedCurrencyLookupService } from '../../../lookup-services/currency-lookup.service';
import { BasicsSharedCo2SourceLookupService } from '../../../lookup-services/customize/basics/basics-shared-co2-source-lookup.service';
import { BasicsSharedMaterialPriceVersionLookupService } from '../../../lookup-services/basics/material/basics-material-price-version-lookup.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedMaterialFilterPriceListLookupService extends UiCommonLookupReadonlyDataService<IMaterialSearchPriceList, IMaterialSearchEntity> {
	private readonly currencyLookupService = inject(BasicsSharedCurrencyLookupService);
	private readonly co2SourceLookupService = inject(BasicsSharedCo2SourceLookupService);

	public constructor() {
		super({
			uuid: 'd57e7bf580b2439ab8455b4d8cbaa364',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Cost',
			showGrid: true,
			disableDataCaching: true,
			disableInput: true,
			events: [{
				name: LookupEventType.SelectedItemChanged,
				handler: (e: ILookupEvent<IMaterialSearchPriceList, IMaterialSearchEntity> | ILookupMultiSelectEvent<IMaterialSearchPriceList, IMaterialSearchEntity>) => {
					const event = e as LookupEvent<IMaterialSearchPriceList, IMaterialSearchEntity>;
					const material = event.context.entity;
					const priceList = event.selectedItem as IMaterialSearchPriceList;
					if (material && priceList) {
						this.overridePrice(material, priceList);
					}
				}
			}],
			gridConfig: {
				columns: [{
					id: 'PriceVersion',
					model: 'MaterialPriceVersionFk',
					label: {key: 'basics.material.priceList.materialPriceVersion'},
					sortable: true,
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialPriceVersionLookupService,
						displayMember: 'MaterialPriceVersionDescriptionInfo.Translated'
					})
				},
				{
					id: 'PriceList',
					model: 'MaterialPriceVersionFk',
					label: {key: 'basics.material.priceList.priceList'},
					sortable: true,
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialPriceVersionLookupService,
						displayMember: 'PriceListDescriptionInfo.Translated'
					})
				},
				{
					id: 'Cost',
					model: 'Cost',
					label: {key: 'basics.material.record.costPrice'},
					sortable: true,
					readonly: true,
					type: FieldType.Money
				},
				{
					id: 'EstimatePrice',
					model: 'EstimatePrice',
					width: 120,
					label: {key: 'basics.material.record.estimatePrice'},
					sortable: true,
					readonly: true,
					type: FieldType.Money
				},
				{
					id: 'CurrencyFk',
					model: 'CurrencyFk',
					label: {key: 'cloud.common.entityCurrency'},
					sortable: true,
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCurrencyLookupService
					})
				}]
			},
		});

		this.currencyLookupService.getList();
		this.co2SourceLookupService.getList();
	}

	public getList(context?: IEntityContext<IMaterialSearchEntity>): Observable<IMaterialSearchPriceList[]> {
		return of(context?.entity?.PriceLists ?? []);
	}

	public getSearchList(request: ILookupSearchRequest, context?: IEntityContext<IMaterialSearchEntity>): Observable<ILookupSearchResponse<IMaterialSearchPriceList>> {
		const items = context?.entity?.PriceLists ?? [];
		return of({items: items, itemsFound: items.length, itemsRetrieved: items.length});
	}

	public getItemByKey(key: IIdentificationData, context?: IEntityContext<IMaterialSearchEntity>): Observable<IMaterialSearchPriceList> {
		const items = context?.entity?.PriceLists ?? [];
		const item = items.find(i => i.Id === key.id) ?? items[0];
		return of(item);
	}

	private overridePrice(material: IMaterialSearchEntity, priceList: IMaterialSearchPriceList) {
		material.Cost = priceList.Cost;
		material.PriceForShow = priceList.Cost;
		material.EstimatePrice = priceList.EstimatePrice;
		material.PriceReferenceForShow = priceList.EstimatePrice;
		material.PrcPriceconditionFk = priceList.PrcPriceConditionFk;
		material.LeadTime = priceList.LeadTime;
		material.MinQuantity = priceList.MinQuantity;
		material.SellUnit = priceList.SellUnit;
		material.PriceExtra = priceList.PriceExtras;
		material.MdcTaxCodeFk = priceList.TaxCodeFk;
		material.RetailPrice = priceList.RetailPrice;
		material.ListPrice = priceList.ListPrice;
		material.Discount = priceList.Discount;
		material.Charges = priceList.Charges;
		material.Co2Project = priceList.Co2Project;
		material.Co2Source = priceList.Co2Source;
		material.DayworkRate = priceList.DayworkRate;

		this.setRequireQuantityAfterChangePriceList(material);
		this.setCurrencyAfterChangePriceList(material, priceList);
		this.setCo2SourceAfterChangePriceList(material, priceList);
	}

	private setRequireQuantityAfterChangePriceList(material: IMaterialSearchEntity) {
		if (material.MinQuantity === 0 || material.SellUnit === 0) {
			material.Requirequantity = material.MinQuantity === 0 ? material.SellUnit : material.MinQuantity;
		} else {
			const remainder = material.MinQuantity % material.SellUnit;
			material.Requirequantity = remainder === 0 ? material.MinQuantity : (material.MinQuantity + material.SellUnit - remainder);
		}
	}

	private setCurrencyAfterChangePriceList(material: IMaterialSearchEntity, priceList: IMaterialSearchPriceList) {
		if (material.BasCurrencyFk !== priceList.CurrencyFk) {
			material.BasCurrencyFk = priceList.CurrencyFk;
			material.Currency = isNil(material.BasCurrencyFk) ? '' :
				(this.currencyLookupService.cache.getItem({id: material.BasCurrencyFk})?.Currency ?? '');
		}
	}

	private setCo2SourceAfterChangePriceList(material: IMaterialSearchEntity, priceList: IMaterialSearchPriceList) {
		if (material.BasCo2SourceFk !== priceList.BasCo2SourceFk) {
			material.BasCo2SourceFk = priceList.BasCo2SourceFk;
			material.BasCo2SourceName = isNil(material.BasCo2SourceFk) ? '' :
				(this.co2SourceLookupService.cache.getItem({id: material.BasCo2SourceFk})?.DescriptionInfo?.Translated ?? '');
		}
	}
}
