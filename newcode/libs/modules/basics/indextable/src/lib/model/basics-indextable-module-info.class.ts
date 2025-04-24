/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsIndexHeaderEntity } from './basics-index-header-entity.class';
import { BasicsIndexHeaderDataService } from '../services/basics-index-header-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {BasicsIndexDetailDataService} from '../services/basics-index-detail-data.service';
import {BasicsIndexDetailEntity} from './basics-index-detail-entity.class';
import {BasicsSharedCurrencyLookupService,BasicsSharedIndexRateFactorLookupService} from '@libs/basics/shared';
import {createLookup, FieldType} from '@libs/ui/common';
export class BasicsIndextableModuleInfo extends BusinessModuleInfoBase {
    private basicsIndexHeaderEntityInfoEvaluated: EntityInfo | null = null;
    public override get internalModuleName(): string {
        return 'basics.indextable';
    }
    private get moduleSubModule(): string {
        return 'Basics.IndexTable';
    }
    public static readonly instance = new BasicsIndextableModuleInfo();
    public override get entities(): EntityInfo[] {
        return [this.basicsIndexHeaderEntityInfo,this.basicsIndexDetailEntityInfo];
    }

    /**
     * Loads the translation file used for workflow main
     */
    public override get preloadedTranslations(): string[] {
        return [this.internalModuleName, 'cloud.common'];
    }

    private readonly basicsIndexHeaderEntityInfo: EntityInfo = EntityInfo.create({
        grid: {
            title: { text: 'Index Header', key: this.internalModuleName + '.indexHeaderTitle' }
        },
        form: {
            title: {text: 'Index Header Detail', key: this.internalModuleName + '.indexHeaderDetails'},
            containerUuid:'65cadb68e8484235ba460341a509db7f'
        },
        dataService: (ctx) => ctx.injector.get((BasicsIndexHeaderDataService),),
        dtoSchemeId: { moduleSubModule: this.moduleSubModule, typeName: 'BasIndexHeaderDto' },
        permissionUuid: 'b20d865ca3594fa98ad281468419baeb',
        layoutConfiguration: {
            groups: [
                {
                    gid: 'indexHeader',
                    attributes: ['Code','DescriptionInfo','CommentText','UserDefined1','UserDefined2','UserDefined3','UserDefined4','UserDefined5','CurrencyFk','RateFactorFk'],
                }
            ],
            overloads: {
                CurrencyFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedCurrencyLookupService,
                        showDescription: true,
                        descriptionMember: 'Currency'
                    })
                },
                RateFactorFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedIndexRateFactorLookupService,
                        showDescription: true,
                        descriptionMember: 'Rate/Factor'
                    })
                }
            },
            labels: {
                ...prefixAllTranslationKeys('basics.indextable.', {
                    Code : {key : 'code'},
                    DescriptionInfo : {key : 'descriptionInfo'},
                    CommentText : {key : 'commentText'},
                    UserDefined1 : {key : 'userDefined1'},
                    UserDefined2 : {key : 'userDefined2'},
                    UserDefined3 : {key : 'userDefined3'},
                    UserDefined4 : {key : 'userDefined4'},
                    UserDefined5 : {key : 'userDefined5'},
                    CurrencyFk : {key : 'currencyFk'},
                    RateFactorFk : {key : 'rateFactorFk'}
                }),
            }
        }} as IEntityInfo<BasicsIndexHeaderEntity>);

    private readonly basicsIndexDetailEntityInfo: EntityInfo = EntityInfo.create({
        grid: {
            title: { text: 'Index Detail', key: this.internalModuleName + '.indexDetailTitle' }
        },
        form: {
            title: {text: 'Index Detail', key: this.internalModuleName + '.indexDetailDetails'},
            containerUuid:'85204b8ecc5e4921a5c004b18fd01507'
        },
        dataService: (ctx) => ctx.injector.get((BasicsIndexDetailDataService),),
        dtoSchemeId: { moduleSubModule: this.moduleSubModule, typeName: 'BasIndexDetailDto' },
        permissionUuid: 'e6a6f3d969ce4265955ef17465f662fe',
        layoutConfiguration: {
            groups: [
                {
                    gid: 'indexDetail',
                    attributes: ['Date','Quantity','CommentText','LowQuantity','HighQuantity'],
                }
            ],
            overloads: {

            },
            labels: {
                ...prefixAllTranslationKeys('basics.indextable.', {
                    Date : {key : 'date'},
                    Quantity : {key : 'quantity'},
                    CommentText : {key : 'commentText'},
                    LowQuantity : {key : 'lowQuantity'},
                    HighQuantity : {key : 'highQuantity'},
                }),
            }
        }} as IEntityInfo<BasicsIndexDetailEntity>);
}
