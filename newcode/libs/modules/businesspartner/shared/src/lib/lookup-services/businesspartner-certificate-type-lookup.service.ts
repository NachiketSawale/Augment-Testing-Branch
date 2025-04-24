/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {LookupSimpleEntity, UiCommonLookupSimpleDataService} from '@libs/ui/common';
/**
 * Business Partner certificate type Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerSharedCertificateTypeLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('businesspartner.main.certificatetype', {
			displayMember: 'Description',
			idProperty: 'Id',
			uuid: '789cf44c0b894d99b0be230304b2728c',
			valueMember: 'Id'
		});
	}
}