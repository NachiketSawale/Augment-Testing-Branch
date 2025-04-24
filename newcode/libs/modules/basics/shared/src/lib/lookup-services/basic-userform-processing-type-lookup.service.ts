/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import {
	UiCommonLookupItemsDataService,
} from '@libs/ui/common';
import { IBasicUserFormProcessingTypeEntity } from './entities/userform-processing-type-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class BasicsUserFormProcessingTypeLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<IBasicUserFormProcessingTypeEntity, TEntity> {

	public constructor() {
		const items = [
			{ Id: 0, Description: 'IN' },
			{ Id: 1, Description: 'OUT' },
			{ Id: 3, Description: 'PLACEHOLDER' }
		];
		super(items, {
			uuid: 'd5955ad458834b5fa4341a7a4fb7a7b9',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}
