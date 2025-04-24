/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, Injector } from '@angular/core';
import { ISubsidiaryEntity } from '@libs/businesspartner/interfaces';
import { LazyInjectable } from '@libs/platform/common';
import { SUBSIDIARY_INFO_ENTITY } from '../../model/entity-info/subsidiary-entity-info.model';
import { ILookupLayoutGenerator, SUBSIDIARY_LOOKUP_LAYOUT_GENERATOR } from '@libs/basics/interfaces';

@Injectable({
    providedIn: 'root',
})
@LazyInjectable<ILookupLayoutGenerator<ISubsidiaryEntity>>({
    token: SUBSIDIARY_LOOKUP_LAYOUT_GENERATOR,
    useAngularInjection: true
})
export class SubsidiaryLookupColumnGeneratorService implements ILookupLayoutGenerator<ISubsidiaryEntity> {

    private readonly injector = inject(Injector);

    public async generateLookupColumns() {
        return await SUBSIDIARY_INFO_ENTITY.generateLookupColumns(this.injector);
    }
}