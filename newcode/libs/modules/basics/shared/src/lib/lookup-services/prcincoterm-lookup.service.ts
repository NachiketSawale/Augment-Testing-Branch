/*
 * Copyright(c) RIB Software GmbH
 */

import {UiCommonLookupTypeLegacyDataService} from '@libs/ui/common';
import {PrcIncotermEntity} from './entities/prcincoterm-entity.class';
import {Injectable} from '@angular/core';

/**
 * Prcincoterm Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedPrcIncotermLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<PrcIncotermEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('Prcincoterm', {
			uuid: '',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code'
		});
	}
}