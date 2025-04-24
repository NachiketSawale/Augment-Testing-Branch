/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IMaterialPriceListEntity } from '../model/entities/material-price-list-entity.interface';
/**
 * Material Price List layout service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsMaterialPriceListLayoutService {
    public async generateConfig(): Promise<ILayoutConfiguration<IMaterialPriceListEntity>> {
        return {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: [
                        'MaterialFk',
                        'MaterialPriceVersionFk',
                        'CurrencyFk',
                        'RetailPrice',
                        'ListPrice',
                        'Discount',
                        'Charges',
                        'PrcPriceConditionFk',
                        'PriceExtras',
                        'Cost',
                        'EstimatePrice',
                        'LeadTime',
                        'TaxCodeFk',
                        'MinQuantity',
                        'SellUnit',
                        'Source',
                        'DayworkRate',
                        'Co2Source',
                        'BasCo2SourceFk',
                        'Co2Project'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('basics.material.', {
                    MaterialFk:{ key: 'record.material', text: 'Material'},
                    MaterialPriceVersionFk:{ key: 'priceList.materialPriceVersion', text: 'Price Version'},
                    RetailPrice:{ key: 'record.retailPrice', text: 'Retail Price'},
                    ListPrice:{ key: 'record.listPrice', text: 'List Price'},
                    Discount:{ key: 'record.discount', text: 'Discount'},
                    Charges:{ key: 'record.charges', text: 'Charges'},
                    PriceExtras:{ key: 'record.priceExtras', text: 'Extras'},
                    Cost:{ key: 'record.costPrice', text: 'Cost Price'},
                    EstimatePrice:{ key: 'record.estimatePrice', text: 'Estimate Price'},
                    LeadTime:{ key: 'materialSearchLookup.htmlTranslate.leadTimes', text: 'Lead Time(Days)'},
                    MinQuantity:{ key: 'record.minQuantity', text: 'Minimum Order Qty'},
                    SellUnit:{ key: 'record.sellUnit', text: 'Sell Unit'},
                    Source:{ key: 'record.source', text: 'Source'},
                    DayworkRate:{ key: 'record.dayworkRate', text: 'Daywork Rate'},
                    Co2Source:{ key: 'record.entityCo2Source', text: 'CO2/kg (Source)'},
                    BasCo2SourceFk:{ key: 'record.entityBasCo2SourceFk', text: 'CO2/kg (Source Name)'},
                    Co2Project:{ key: 'record.entityCo2Project', text: 'CO2/kg (Project)'},
                }),
                ...prefixAllTranslationKeys('cloud.common.', {
                    CurrencyFk:{ key: 'entityCurrency', text: 'Currency'},
                    PrcPriceConditionFk:{ key: 'entityPriceCondition', text: 'Price Condition'},
                    TaxCodeFk:{ key: 'entityTaxCode', text: 'Tax Code'}
                })
            },
            overloads: {
                PriceExtras: {readonly: true},
                Cost:{readonly:true},
                Co2Source:{readonly:true},
                MaterialPriceVersionFk:{
                    //to-do : lookup
                },
                CurrencyFk:{
                    //to-do : lookup
                },
                PrcPriceConditionFk:{
                    //to-do : lookup
                },
                TaxCodeFk:{
                    //to-do : lookup
                },
                BasCo2SourceFk:{
                    //to-do : lookup
                }
            }
        };
    }
}