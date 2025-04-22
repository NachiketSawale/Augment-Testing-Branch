/*
 * Copyright(c) RIB Software GmbH
 */

import {ProviderToken} from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import {EntityInfo} from '@libs/ui/business-base';
import { IPrcDocumentEntity} from '../entities';
import {ProcurementCommonDocumentLayoutService} from '../../services/procurement-common-document-layout.service';
import {ProcurementCommonDocumentDataService} from '../../services/procurement-common-document-data.service';
import {DocumentsSharedBehaviorService} from '@libs/documents/shared';

/**
 * Procurement common Document entity info helper
 */
export class ProcurementCommonDocumentEntityInfo {

    /**
     * Create a real procurement document entity info configuration for different modules
     */
    public static create<T extends IPrcDocumentEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
        /**
         * Permission uuid in lower case
         */
        permissionUuid: string,
        /**
         * Form uuid in lower case
         */
        formUuid: string;
        /**
         * Data service
         */
        dataServiceToken: ProviderToken<ProcurementCommonDocumentDataService<T, PT, PU>>,
        /**
         * Type Name
         */
        typeName?:string
        /**
         * Layout
         */
        layout?:object,
        /**
         * gridTitle
         */
        gridTitle?:string,
        /**
         * gridTitleKey
         */
        gridTitleKey?:string,
        /**
         * formTitle
         */
        formTitle?:string,
        /**
         * formTitleKey
         */
        formTitleKey?:string,
        /**
         * Customize layout service by extending ProcurementCommonDocumentLayoutService
         * Default is ProcurementCommonDocumentLayoutService
         */
        
        layoutServiceToken?: ProviderToken<ProcurementCommonDocumentLayoutService>
    }) {
        return EntityInfo.create<T>({
            grid: {
                title: {text: config.gridTitle ?? 'Document', key: config.gridTitleKey ?? 'procurement.common.document.prcDocumentContainerGridTitle'},
                behavior : ctx => new DocumentsSharedBehaviorService<T>(ctx.injector.get(config.dataServiceToken!), ctx.injector)
            },
            form: {
                containerUuid: config.formUuid,
                title: {text: config.formTitle ?? 'Document Detail', key: config.formTitleKey ?? 'procurement.common.document.prcDocumentContainerFormTitle'}
            },
            dataService: context => context.injector.get(config.dataServiceToken),
            dtoSchemeId: {moduleSubModule: 'Procurement.Common', typeName: config.typeName ?? 'PrcDocumentDto'},
            permissionUuid: config.permissionUuid,
            layoutConfiguration: config.layout ? config.layout : context => {
                return context.injector.get(ProcurementCommonDocumentLayoutService).generateLayout();
            }
        });
    }
}