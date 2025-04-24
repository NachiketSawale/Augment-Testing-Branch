import {Injectable} from '@angular/core';
import {LookupSimpleEntity, UiCommonLookupSimpleDataService} from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class BasicsSharedGuarantorTypeLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {


	/**
	 * constructor
	 */
	public constructor() {
		super('basics.customize.guarantortype', {
			uuid: 'f59643dabf2e4f808ab531a506110511',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}
