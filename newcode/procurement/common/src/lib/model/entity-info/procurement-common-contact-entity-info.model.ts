/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementCommonContactLayoutService } from '../../services/procurement-common-contact-layout.service';
import { ProcurementCommonContactDataService } from '../../services/procurement-common-contact-data.service';
import { IPrcContactEntity } from '../entities/prc-contact-entity.interface';

/**
 * Procurement common Contact entity info helper
 */
export class ProcurementCommonContactEntityInfo {

    /**
     * Create a real procurement Contact entity info configuration for different modules
     */
    public static create<T extends IPrcContactEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
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
        dataServiceToken: ProviderToken<ProcurementCommonContactDataService<T, PT, PU>>,
        /**
         * module SubModule
         */
        moduleSubModule?: string,
        /**
         * Type Name
         */
        typeName?: string,
        /**
         * Layout
         */
        layout?: object,
        /**
         * Customize layout service by extending ProcurementCommonContactLayoutService
         */
        layoutServiceToken?: ProviderToken<ProcurementCommonContactLayoutService>,
    }) {
        return EntityInfo.create<T>({
            grid: {
                title: {text: 'Contact', key: 'procurement.common.contact.contactContainerGridTitle'},
            },
            form: {
                containerUuid: config.formUuid,
                title: {text: 'Contact Detail', key: 'procurement.common.contact.contactContainerFormTitle'},
            },
            dataService: context => context.injector.get(config.dataServiceToken),
            dtoSchemeId: {moduleSubModule: config.moduleSubModule ?? 'Procurement.Common', typeName: config.typeName ?? 'PrcContactDto'},
            permissionUuid: config.permissionUuid,
            layoutConfiguration: context => {
                return context.injector.get(ProcurementCommonContactLayoutService).generateLayout({
                    dataServiceToken: config.dataServiceToken
                });
            }
        });
    }


}