/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {LookupSimpleEntity, UiCommonLookupSimpleDataService,} from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class DfmDefect2ProjectChangeTypeLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('basics.customize.defect2projectchangetype', {
			displayMember: 'Description',
			uuid: '74cb12a776bc4858ac282b603886d7ae',
			valueMember: 'Id'
		});
	}
}
