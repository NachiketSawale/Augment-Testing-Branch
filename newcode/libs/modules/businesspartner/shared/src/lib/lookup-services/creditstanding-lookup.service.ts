import {Injectable} from '@angular/core';
import { CreditstandingEntity } from '@libs/businesspartner/interfaces';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';

/**
 *
 */
@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerSharedCreditstandingLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<CreditstandingEntity, TEntity> {


	/**
	 * constructor
	 */
	public constructor() {
		super('creditstanding', {
			uuid: 'acdb63f1556c493481a7c302161e4d38',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated'
		});
	}
}
