/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, Injector } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { BASICS_PRC_CONFIG_LOOKUP_LAYOUT_GENERATOR, ILookupLayoutGenerator } from '@libs/basics/interfaces';
import { BASICS_PROCUREMENT_CONFIGURATION_CONFIGURATION_ENTITY_INFO } from '../../model/entity-info/basics-procurement-configuration-configuration-entity-info.model';
import { IPrcConfigurationEntity } from '../../model/entities/prc-configuration-entity.interface';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable<ILookupLayoutGenerator<IPrcConfigurationEntity>>({
	token: BASICS_PRC_CONFIG_LOOKUP_LAYOUT_GENERATOR,
	useAngularInjection: true,
})
export class BasicsProcurementConfigLookupLayoutService implements ILookupLayoutGenerator<IPrcConfigurationEntity> {
	private readonly injector = inject(Injector);

	public async generateLookupColumns() {
		return await BASICS_PROCUREMENT_CONFIGURATION_CONFIGURATION_ENTITY_INFO.generateLookupColumns(this.injector);
	}
}
