import {Injectable} from '@angular/core';
import {LookupSimpleEntity, UiCommonLookupSimpleDataService,} from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})

export class BusinesspartnerSharedContactOriginLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('businesspartner.contact.origin', {
			displayMember: 'Description',
			uuid: '84cb12a776bc4858ac222b603886d7de',
			valueMember: 'Id'

		});
	}
}
