import {Injectable} from '@angular/core';
import {ILookupContext, LookupSimpleEntity, UiCommonLookupSimpleDataService,} from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})

export class BusinesspartnerSharedCustomerAbcLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('businesspartner.customerabc', {
			displayMember: 'Description',
			uuid: '5bd091bc6141481584e75fe732dbe4b4',
			valueMember: 'Id',
			imageSelector: { // TODO: Use the global status icon formatter/selector instead.
				select(item: LookupSimpleEntity, context: ILookupContext<LookupSimpleEntity, TEntity>): string {
					return item.icon ? `status-icons ico-status${item.icon.toString().padStart(2, '0')}` : '';
				},
				getIconType() {
					return 'css';
				}
			}
		});
	}
}
