import {Injectable} from '@angular/core';
import {
	LookupSimpleEntity,
	UiCommonLookupSimpleDataService
} from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})

/**
 *
 */
export class BusinesspartnerSharedContactRoleLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('businesspartner.contact.role', {
			displayMember: 'Description',
			uuid: '029af053ab4d41478ab0cb75ff905393',
			valueMember: 'Id'
		});
	}
}
