/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IFormFieldEntity } from '../model/entities/form-field-entity.interface';

/**
 * Business partner header behavior
 */
@Injectable({
	providedIn: 'root'
})
export class BasicUserformFieldHeaderGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IFormFieldEntity>, IFormFieldEntity> {
	public constructor() {
	}

	public onCreate() {
	}
}