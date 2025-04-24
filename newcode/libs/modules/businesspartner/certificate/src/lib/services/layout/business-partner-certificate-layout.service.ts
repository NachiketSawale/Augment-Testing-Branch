/*
 * Copyright(c) RIB Software GmbH
 */

import { BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN, IBusinessPartnerCertificateLayout, ICertificateEntity } from '@libs/businesspartner/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BP_CERTIFICATE_LAYOUT } from '../../model/entity-info/certificate-layout.model';
import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';

/**
 * Business partner certificate layout service.
 */
@LazyInjectable({
    token: BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN,
    useAngularInjection: true
})
@Injectable({
    providedIn: 'root'
})
export class BusinessPartnerCertificateLayoutService implements IBusinessPartnerCertificateLayout {
    /**
     * Prepares the layout for business partner certificate container.
     * @returns 
     */
    public generateLayout(): ILayoutConfiguration<ICertificateEntity> {
        return BP_CERTIFICATE_LAYOUT;
    }
}