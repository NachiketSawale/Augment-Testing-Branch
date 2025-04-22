/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ContainerLayoutConfiguration, EntityInfo, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ProcurementCommonCertificateLayoutService } from '../../services/procurement-common-certificate-layout.service';
import { ProcurementCommonCertificateDataService } from '../../services/procurement-common-certificate-data.service';
import { IPrcCertificateEntity } from '@libs/procurement/interfaces';

/**
 * Procurement common Certificate entity info helper
 */
export class ProcurementCommonCertificateEntityInfo {

    /**
     * Create a real procurement document entity info configuration for different modules
     */
    public static create<T extends IPrcCertificateEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
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
        dataServiceToken: ProviderToken<ProcurementCommonCertificateDataService<T, PT, PU>>,
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
        layout?: ContainerLayoutConfiguration<T>,
        /**
         * Customize layout service by extending ProcurementCommonDocumentLayoutService
         * Default is ProcurementCommonDocumentLayoutService
         */
        layoutServiceToken?: ProviderToken<ProcurementCommonCertificateLayoutService>,

	    behavior?:ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
    }) {
        return EntityInfo.create<T>({
            grid: {
                title: {text: 'Certificate', key: 'procurement.common.certificate.certificatesContainerGridTitle'},
	             behavior: config.behavior ? context => context.injector.get(config.behavior) : undefined
            },
            form: {
                containerUuid: config.formUuid,
                title: {text: 'Certificate Detail', key: 'procurement.common.certificate.certificatesContainerFormTitle'},
            },
            dataService: context => context.injector.get(config.dataServiceToken),
            dtoSchemeId: {moduleSubModule: config.moduleSubModule ?? 'Procurement.Common', typeName: config.typeName ?? 'PrcCertificateDto'},
            permissionUuid: config.permissionUuid,
	         layoutConfiguration:config.layout ? config.layout : context => {
		        return context.injector.get(ProcurementCommonCertificateLayoutService).generateLayout();
	        }
        });
    }


}