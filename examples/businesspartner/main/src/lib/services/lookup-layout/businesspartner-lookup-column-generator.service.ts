/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, Injector } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { BUSINESS_PARTNER_ENTITY_INFO } from '../../model/entity-info/businesspartner-entity-info.model';
import { ILookupLayoutGenerator, BUSINESSPARTNER_LOOKUP_LAYOUT_GENERATOR } from '@libs/basics/interfaces';

@Injectable({
    providedIn: 'root',
})

@LazyInjectable<ILookupLayoutGenerator<IBusinessPartnerEntity>>({
    token: BUSINESSPARTNER_LOOKUP_LAYOUT_GENERATOR,
    useAngularInjection: true
})
export class BusinessPartnerLookupColumnGeneratorService implements ILookupLayoutGenerator<IBusinessPartnerEntity> {
    private readonly injector = inject(Injector);

    public async generateLookupColumns() {
        return await BUSINESS_PARTNER_ENTITY_INFO.generateLookupColumns(this.injector);
    }
}
