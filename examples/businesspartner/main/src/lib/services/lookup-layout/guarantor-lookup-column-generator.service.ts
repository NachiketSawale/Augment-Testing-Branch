/*
 * Copyright(c) RIB Software GmbH
 */

import { IGuarantorEntity } from '@libs/businesspartner/interfaces';
import { LazyInjectable } from '@libs/platform/common';
import { GUARANTOR_INFO_ENTITY } from '../../model/entity-info/guarantor-entity-info.model';
import { inject, Injectable, Injector } from '@angular/core';
import { ILookupLayoutGenerator, GUARANTOR_LOOKUP_LAYOUT_GENERATOR } from '@libs/basics/interfaces';

@Injectable({
    providedIn: 'root',
})

@LazyInjectable<ILookupLayoutGenerator<IGuarantorEntity>>({
    token: GUARANTOR_LOOKUP_LAYOUT_GENERATOR,
    useAngularInjection: true
})
export class GuarantorLookupColumnGeneratorService implements ILookupLayoutGenerator<IGuarantorEntity> {
    private readonly injector = inject(Injector);

    public async generateLookupColumns() {
        return await GUARANTOR_INFO_ENTITY.generateLookupColumns(this.injector);
    }
}
