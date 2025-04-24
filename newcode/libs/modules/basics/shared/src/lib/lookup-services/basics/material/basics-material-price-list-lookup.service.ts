/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {FieldType, UiCommonLookupEndpointDataService} from '@libs/ui/common';
import {IBasicsCustomizePriceListEntity} from '@libs/basics/interfaces';

/**
 * Material price list lookup service
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedMaterialPriceListLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePriceListEntity, TEntity> {

    /**
     * The constructor
     */
    public constructor() {
        super({
            httpRead: {
                route: 'basics/material/wizard/updatematerialprice/',
                endPointRead: 'getmatpricelist',
                usePostForRead: false
            },
            filterParam: true,
            prepareListFilter: (context) => {
                if (context) {
                    const tempEntity = context.entity as IBasicsCustomizePriceListEntity;
                    const filterValue = 'MaterialFk=' + tempEntity.Id;
                    return 'filter=' + filterValue;
                }
                return '';
            }
        }, {
            uuid: '0a9ec89855724fa6a8c5026a175ef931',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Cost',
            gridConfig: {
                columns: [
                    {
                        id: 'costPrice',
                        model: 'Cost',
                        type: FieldType.Money,
                        label: {
                            text: 'Cost Price',
                            key: 'basics.material.record.costPrice'
                        },
                        width: 100,
                        visible: true,
                        sortable: false,
                        readonly: true
                    },
                    {
                        id: 'version',
                        model: 'MaterialPriceVersionFk',
                        type: FieldType.Description,
                        /* todo required support formatter function
                        formatter: function(row, cell, value, columnConfig, item){
                            return item.PriceVerDescriptionInfo.Translated;
                        },
                         */
                        label: {
                            text: 'Price Version',
                            key: 'basics.material.priceList.materialPriceVersion'
                        },
                        width: 120,
                        visible: true,
                        sortable: false,
                        readonly: true
                    },
                    {
                        id: 'priceList',
                        model: 'MaterialPriceVersionFk',
                        type: FieldType.Description,
                        /* todo required support formatter function
                        formatter: function(row, cell, value, columnConfig, item){
                            return item.PriceListDescriptionInfo.Translated;
                        },
                         */
                        label: {
                            text: 'Price List',
                            key: 'basics.material.priceList.entityPriceList'
                        },
                        width: 120,
                        visible: true,
                        sortable: false,
                        readonly: true
                    }
                ]
            }
        });
    }
}