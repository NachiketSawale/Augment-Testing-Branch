/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupSimpleDataService, createLookup } from '@libs/ui/common';
import { BasicsSharedCurrencyLookupService } from './currency-lookup.service';
import { CurrencyEntity } from './entities/currency-entity.class';
import { ICostcodePriceListEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root'
})

export class BasicsSharedCostCodesPriceListLookupService<TEntity extends object = object> extends UiCommonLookupSimpleDataService<ICostcodePriceListEntity, TEntity> {
    public constructor() {
        super('basics.customize.pricelist'
            , {
                uuid: 'a43e18302cee47509027ac8b780326b4',
                valueMember: 'Id',
                displayMember: 'Description',
                gridConfig: {
                    columns: [
                        {
                            id: 'rate',
                            model: 'Rate',
                            type: FieldType.Money,
                            label: { text: 'Rate', key: 'basics.costcodes.priceList.rate' },
                            sortable: true,
                            visible: false,
                            readonly: false
                        },
                        {
                            id: 'salesprice',
                            model: 'SalesPrice',
                            type: FieldType.Money,
                            label: { text: 'SalesPrice', key: 'basics.costcodes.priceList.salesPrice' },
                            sortable: true,
                            visible: false,
                            readonly: false
                        },
                        {
                            id: 'CurrencyFk',
                            model: 'CurrencyFk',
                            type: FieldType.Lookup,

                            lookupOptions: createLookup<ICostcodePriceListEntity, CurrencyEntity>({
                                dataServiceToken: BasicsSharedCurrencyLookupService,
                                displayMember: 'Currency',

                            }),
                            label: { text: 'Currency', key: 'cloud.common.entityCurrency' },
                            width: 150,
                            sortable: true,
                            visible: true
                        },
                    ]
                }
            });
    }
}