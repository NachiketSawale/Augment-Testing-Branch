/*
 * Copyright(c) RIB Software GmbH
 */
import { IContactEntity } from '@libs/businesspartner/interfaces';
import { inject, Injectable, Injector } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { BUSINESS_PARTNER_CONTRACT_INFO } from '../../model/entity-info/businesspartner-contract-info.model';
import { ILookupLayoutGenerator, CONTACT_LOOKUP_LAYOUT_GENERATOR } from '@libs/basics/interfaces';

@Injectable({
    providedIn: 'root',
})

@LazyInjectable<ILookupLayoutGenerator<IContactEntity>>({
    token: CONTACT_LOOKUP_LAYOUT_GENERATOR,
    useAngularInjection: true
})
export class ContactLookupColumnGeneratorService implements ILookupLayoutGenerator<IContactEntity> {

    private readonly injector = inject(Injector);

    public async generateLookupColumns() {
        return await BUSINESS_PARTNER_CONTRACT_INFO.generateLookupColumns(this.injector);
    }
}