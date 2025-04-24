import {Injectable} from '@angular/core';
import {LookupSimpleEntity, UiCommonLookupSimpleDataService} from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})

export class BusinesspartnerSharedContactTimelinessLookService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('businesspartner.contact.timeliness', {
			displayMember: 'Description',
			uuid: '246d5924d2e3414c9700ae88540f25d0',
			valueMember: 'Id'
		});
	}
}
