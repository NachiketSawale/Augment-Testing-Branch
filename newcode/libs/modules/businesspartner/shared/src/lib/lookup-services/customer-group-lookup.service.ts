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
export class BusinesspartnerSharedCustomerGroupLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('businesspartner.customergroup', {
			displayMember: 'Description',
			uuid: 'b3799a8e59d0433191a499cfafd30aee',
			valueMember: 'Id'
		});
	}
}
