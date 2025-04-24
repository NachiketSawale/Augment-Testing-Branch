/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IFormDataEntity } from '../model/entities/form-data-entity.interface';

/**
 * Business partner header behavior
 */
@Injectable({
	providedIn: 'root'
})
export class BasicUserformDataHeaderGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IFormDataEntity>, IFormDataEntity> {
	public constructor() {
	}

	public onCreate() {
	}
}