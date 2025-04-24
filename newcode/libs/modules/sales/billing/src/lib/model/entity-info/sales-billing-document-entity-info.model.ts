/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { DocumentsSharedBehaviorService } from '@libs/documents/shared';
import { SalesBillingDocumentDataService } from '../../services/sales-billing-document-data.service';
import { IDocumentEntity } from '@libs/sales/interfaces';

export const SALES_BILLING_DOCUMENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IDocumentEntity>({
    grid: {
        title: {key: 'sales.common.document.containerGridTitle'},
        behavior: ctx => new DocumentsSharedBehaviorService<IDocumentEntity>(ctx.injector.get(SalesBillingDocumentDataService), ctx.injector),
    },
    form: {
        title: {key: 'sales.common.document.containerFormTitle'},
        containerUuid: '0934ac0577174ad9b00a473235d02109'
    },
    dataService: ctx => ctx.injector.get(SalesBillingDocumentDataService),
    dtoSchemeId: {moduleSubModule: 'Sales.Billing', typeName: 'DocumentDto'},
    permissionUuid: 'c34718f7f1b446aba797b056a0b1dde0',
    layoutConfiguration: {
        groups: [
            {gid: 'Basic Data', attributes: ['Description', 'DocumentTypeFk', 'SalesDocumentTypeFk', 'DocumentDate', 'OriginFileName']},
        ],
        overloads: {
            DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(true),
            SalesDocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesDocumentTypeLookupOverload(true),
        },
        labels: {
            ...prefixAllTranslationKeys('sales.common.', {
                SalesDocumentTypeFk: {key: 'document.salesDocumentTypeFk'}
            }),
            ...prefixAllTranslationKeys('cloud.common.', {
                DocumentTypeFk: {key: 'entityType'},
                DocumentDate: {key: 'entityDate'},
                OriginFileName: {key: 'documentOriginFileName'},
                Description: {key : 'entityDescription'}
            })
        },
    }
});