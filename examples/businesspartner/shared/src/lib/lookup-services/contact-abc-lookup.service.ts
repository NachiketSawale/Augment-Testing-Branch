/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, LookupSimpleEntity, UiCommonLookupSimpleDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})

export class BusinesspartnerSharedContactAbcLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {
	/**
	 * Default constructor.
	 */
	public constructor() {
		super('businesspartner.contact.abc', {
			uuid: 'ce9bc25fbd294cb2a64655c326708679',
			valueMember: 'Id',
			displayMember: 'Description',
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