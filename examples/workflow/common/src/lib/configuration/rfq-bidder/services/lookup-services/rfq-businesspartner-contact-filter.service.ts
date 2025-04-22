/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IRfqBusinessPartnerEntity } from '@libs/procurement/interfaces';
import { IContactLookupEntity } from '@libs/businesspartner/interfaces';

/**
 * Represents the lookup filter binding to the context IRfqBusinessPartnerEntity.
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementRfqBusinesspartnerContactFilterService implements ILookupServerSideFilter<IContactLookupEntity, IRfqBusinessPartnerEntity> {
    /**
     * Key
     */
    public key: string = 'procurement-rfq-businesspartner-contact-filter';

    /**
     * Executor
     * @param context
     */
    public execute(context: ILookupContext<IContactLookupEntity, IRfqBusinessPartnerEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
        return {
            BusinessPartnerFk: context.entity?.BusinessPartnerFk,            
        };
    }
}