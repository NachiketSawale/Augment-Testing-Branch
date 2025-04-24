/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, Injector } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { ILookupLayoutGenerator, IBasicsClerkEntity, BASICS_CLERK_LOOKUP_LAYOUT_GENERATOR } from '@libs/basics/interfaces';
import { BASICS_CLERK_ENTITY_INFO } from '../../model/basics-clerk-entity-info.model';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable<ILookupLayoutGenerator<IBasicsClerkEntity>>({
	token: BASICS_CLERK_LOOKUP_LAYOUT_GENERATOR,
	useAngularInjection: true,
})
export class BasicClerkLookupColumnGeneratorService implements ILookupLayoutGenerator<IBasicsClerkEntity> {
	private readonly injector = inject(Injector);

	public async generateLookupColumns() {
		return await BASICS_CLERK_ENTITY_INFO.generateLookupColumns(this.injector);
	}
}
