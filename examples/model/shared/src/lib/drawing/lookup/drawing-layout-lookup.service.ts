/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {LookupSimpleEntity, UiCommonLookupTypeDataService} from '@libs/ui/common';

/**
 * Drawing Layout Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class ModelSharedDrawingLayoutLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<LookupSimpleEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('DrawingLayout', {
			uuid: '5a8d29b3fad74e559e03d70442b0c9f0',
			idProperty: 'id',
			valueMember: 'id',
			displayMember: 'name'
		});
	}
}