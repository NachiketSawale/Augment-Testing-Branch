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
export class BusinesspartnerSharedCustomerSectorLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('businesspartner.customersector', {
			displayMember: 'Description',
			uuid: '856935594bc04acb93731738177d1bfb',
			valueMember: 'Id'
		});
	}
}
