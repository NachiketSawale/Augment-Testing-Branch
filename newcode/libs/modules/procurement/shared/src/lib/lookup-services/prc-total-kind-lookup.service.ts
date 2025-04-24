/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';

/**
 * Rfq Status Lookup Service
 */
@Injectable({
	providedIn: 'root',
})
export class PrcTotalKindLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<{ Id: number; Description: string }, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('PrcTotalKind', {
			uuid: '41c16ef8262336e9d30fea99712da00d',
			valueMember: 'Id',
			displayMember: 'Description',
		});
	}
}
