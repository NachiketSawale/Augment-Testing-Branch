/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {UiCommonLookupTypeDataService} from '@libs/ui/common';
import {IRubricCategoryEntity} from '@libs/basics/interfaces';

/**
 * Rubric Category Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedRubricCategoryByRubricAndCompanyLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IRubricCategoryEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('RubricCategoryByRubricAndCompany', {
			uuid: 'aacb6844a44847228b143ee8419c9c8b',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}