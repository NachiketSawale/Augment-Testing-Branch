/*
 * Copyright(c) RIB Software GmbH
 */

import {UiCommonLookupTypeDataService } from '@libs/ui/common';
import {Injectable} from '@angular/core';
import { LegalFormEntity } from '@libs/businesspartner/interfaces';

/**
 * LegalForm Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerSharedLegalFormLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<LegalFormEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('legalForm', {
			uuid: '',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated'
		});
	}
}