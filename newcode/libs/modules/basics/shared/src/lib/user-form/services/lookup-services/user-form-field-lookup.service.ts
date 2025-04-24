/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	UiCommonLookupTypeLegacyDataService
} from '@libs/ui/common';
import { IFormFieldEntity } from '../../model/entities/form-field-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class BasicsSharedUserFormFieldLookupService<TEntity extends object = object> extends UiCommonLookupTypeLegacyDataService<IFormFieldEntity, TEntity> {
	public constructor() {
		super('UserFormField', {
			uuid: 'fe47f69acc894169a26d2151b6a7e8ed',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'FieldName'
		});
	}
}