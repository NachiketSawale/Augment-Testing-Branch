/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys} from '@libs/platform/common';
import { ILayoutConfiguration, ILookupContext} from '@libs/ui/common';
import { ITaxCodeEntity, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IPrcStructureTaxEntity } from '@libs/basics/interfaces';



/**
 * Procurement structure tax code layout service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsProcurementStructureTaxCodeLayoutService {

    /**
     * Generate layout config
     */
    public async generateLayout(): Promise<ILayoutConfiguration<IPrcStructureTaxEntity>> {

        return {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: [
                        'MdcLedgerContextFk',
                        'MdcTaxCodeFk',
                        'MdcSalesTaxGroupFk',
                        'CommentText'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    'MdcTaxCodeFk': {
                        text: 'Tax Code',
                        key: 'entityTaxCode'
                    },
                    'CommentText': {
                        text: 'Comment',
                        key: 'entityCommentText'
                    }
                }),
                ...prefixAllTranslationKeys('basics.procurementstructure.', {
                    'MdcLedgerContextFk': {
                        text: 'Ledger Context',
                        key: 'entityLedgerContextFk'
                    },

                    'MdcSalesTaxGroupFk': {
                        text: 'Sales Tax Group',
                        key: 'entityMdcSalesTaxGroup'
                    }
                }),
            },
            overloads: {
                MdcLedgerContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideLedgerContextLookupOverload(false), 
                MdcTaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true, {
                    execute(item: ITaxCodeEntity, context: ILookupContext<ITaxCodeEntity, IPrcStructureTaxEntity>): boolean {
                        return context.entity?.MdcLedgerContextFk === item.LedgerContextFk;
                    }
                }),
                MdcSalesTaxGroupFk: BasicsSharedLookupOverloadProvider.provideSalesTaxGroupLookupOverload(true), 
            }
        };
    }
}