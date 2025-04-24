/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import {IMaterialPriceConditionEntity} from '@libs/basics/interfaces';
import {IBasicsSharedPriceConditionBaseLayoutService} from './interfaces/price-condition-base-layout.service.interface';
import {merge} from 'lodash';
import { RoundingFieldOverloadSpec } from '../../rounding/model/rounding-field-extensions.type';
import { BasicsSharedRoundingFactoryService } from '../../rounding/services/basics-shared-rounding-factory.service';
import { BasicsSharedRoundingModule as roundingModule } from '../../rounding/model/basics-shared-rounding-module';
import { BasicsSharedLookupOverloadProvider } from '../../lookup-helper/basics-shared-lookup-overload-provider.class';
/**
 * price condition layout service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsSharedPriceConditionLayoutService<T extends IMaterialPriceConditionEntity> implements IBasicsSharedPriceConditionBaseLayoutService<T> {

    private readonly roundingService = BasicsSharedRoundingFactoryService.getService(roundingModule.basicsMaterial);
    public commonLayout(): ILayoutConfiguration<IMaterialPriceConditionEntity> {
        const layout =<ILayoutConfiguration<IMaterialPriceConditionEntity>>{
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: [
                        'PrcPriceConditionTypeFk',
                        'Description',
                        'Value',
                        'Total',
                        'TotalOc',
                        'Code',
                        'Formula',
                        'IsPriceComponent',
                        'IsActivated',
                        'Date',
                        'Userdefined1',
                        'Userdefined2',
                        'Userdefined3',
                        'Userdefined4',
                        'Userdefined5'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    'PrcPriceConditionTypeFk': {
                        text: 'Type',
                        key: 'priceType'
                    },
                    'Description': {
                        text: 'Description',
                        key: 'priceDescription'
                    },
                    'Value': {
                        text: 'Value',
                        key: 'priceValue'
                    },
                    'Total': {
                        text: 'Total',
                        key: 'priceTotal'
                    },
                    'TotalOc': {
                        text: 'TotalOc',
                        key: 'priceTotalOc'
                    },
                    'Code': {
                        text: 'Code',
                        key: 'entityCode'
                    },
                    'Formula': {
                        text: 'Formula',
                        key: 'priceFormula'
                    },
                    'IsPriceComponent': {
                        text: 'Is Price Component',
                        key: 'priceComponent'
                    },
                    'Date': {
                        text: 'Date',
                        key: 'entityDate'
                    },
                    'Userdefined1': {
                        text: 'User-Defined 1',
                        key: 'entityUserDefined',
                        params: {
                            'p_0': '1'
                        }
                    },
                    'Userdefined2': {
                        text: 'User-Defined 2',
                        key: 'entityUserDefined',
                        params: {
                            'p_0': '2'
                        }
                    },
                    'Userdefined3': {
                        text: 'User-Defined 3',
                        key: 'entityUserDefined',
                        params: {
                            'p_0': '3'
                        }
                    },
                    'Userdefined4': {
                        text: 'User-Defined 4',
                        key: 'entityUserDefined',
                        params: {
                            'p_0': '4'
                        }
                    },
                    'Userdefined5': {
                        text: 'User-Defined 5',
                        key: 'entityUserDefined',
                        params: {
                            'p_0': '5'
                        }
                    }
                }),
                ...prefixAllTranslationKeys('basics.pricecondition.', {
                    'IsActivated': {
                        text: 'Is Activated',
                        key: 'entityIsActivated'
                    }
                }),
            },
            overloads: {
                PrcPriceConditionTypeFk: BasicsSharedLookupOverloadProvider.providePriceConditionTypeLookupOverload(false),
                Value: <RoundingFieldOverloadSpec<IMaterialPriceConditionEntity>>{
                    roundingField: 'MdcPriceCondition_Value'
                },
                Total: <RoundingFieldOverloadSpec<IMaterialPriceConditionEntity>>{
                    roundingField: 'MdcPriceCondition_Total'
                },
                TotalOc: <RoundingFieldOverloadSpec<IMaterialPriceConditionEntity>>{
                    roundingField: 'MdcPriceCondition_TotalOc'
                }
            }
        };
        this.roundingService.uiRoundingConfig(layout);
        return layout;
    }

    /**
     * Generate layout
     */
    public async generateLayout(): Promise<ILayoutConfiguration<T>> {
        return this.commonLayout() as ILayoutConfiguration<T>;
    }

    /**
     * extension layout
     * merge common layout and custom layout
     */
    public async mergeLayout(customizeConfig?: object): Promise<ILayoutConfiguration<T>> {
        const commonLayout = this.commonLayout();
        if (!customizeConfig) {
            return commonLayout as ILayoutConfiguration<T>;
        }
        const customizeLayout = customizeConfig as ILayoutConfiguration<T>;
        let standardAttrs: string[] = [];
        if (commonLayout.groups && commonLayout.groups.length > 0) {
            standardAttrs = commonLayout.groups[0].attributes.slice();
        }
        const mergedObject = merge(commonLayout, customizeLayout);
        if (mergedObject.groups && mergedObject.groups.length > 0 && customizeLayout.groups && customizeLayout.groups.length > 0) {
            const uniqueAttributes = [...new Set([...standardAttrs, ...mergedObject.groups[0].attributes])];
            mergedObject.groups[0].attributes = uniqueAttributes;
        }
        return mergedObject;
    }
}