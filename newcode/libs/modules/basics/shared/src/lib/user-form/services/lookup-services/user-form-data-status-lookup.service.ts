/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { IUserFormDataStatusEntity } from '../../model/entities/user-form-data-status-entity.interface';


/**
 * State Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedUserFormDataStatusLookupService<TEntity extends object = object> extends UiCommonLookupTypeLegacyDataService<IUserFormDataStatusEntity, TEntity> {
	public constructor() {
		super('UserFormDataStatus', {
			uuid: '09c7222f5e1a4985a0ca2f6ac2e856b9',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			imageSelector: { // TODO-drizzle: Use the global status icon formatter/selector instead.
				select(item: IUserFormDataStatusEntity, context: ILookupContext<IUserFormDataStatusEntity, TEntity>): string {
					return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
				},
				getIconType() {
					return 'css';
				}
			}
		});
	}
}
