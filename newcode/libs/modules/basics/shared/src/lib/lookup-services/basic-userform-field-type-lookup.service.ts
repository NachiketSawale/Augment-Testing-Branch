/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import {
	UiCommonLookupItemsDataService
} from '@libs/ui/common';
import { IBasicUserFormFieldTypeEntity } from './entities/userform-field-type-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class BasicsUserFormFieldTypeLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<IBasicUserFormFieldTypeEntity, TEntity> {

	public constructor() {
		const items = [
			{ Id: 0, SortIndx: 1, Value: 0, Description: 'Normal' },
			{ Id: 1, SortIndx: 2, Value: 1, Description: 'Json' }
		];
		super(items, {
			uuid: 'e94dc0f2f60240eca746426f6B5c3e74',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}
