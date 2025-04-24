/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { IPrcContractTypeEntity } from './entities/prc-contract-type-entity.interface';

/**
 * prc Contract Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class PrcContractTypeLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IPrcContractTypeEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('PrcContractType', {
			uuid: '2d1d101a4920429397ff6e47014f69a7',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}