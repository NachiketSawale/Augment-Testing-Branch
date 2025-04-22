/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IModelHeaderEntity } from '../model/entities/model-header-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ModelProjectModelHeaderLookupDataService<T extends object> extends UiCommonLookupTypeDataService<IModelHeaderEntity, T> {

	public constructor() {
		super('Model.general', {
			uuid: '1f0de86753374ed1aa76e8981cffd4cd',
			displayMember: 'Description',
			valueMember: 'Id'
		});
	}
}
