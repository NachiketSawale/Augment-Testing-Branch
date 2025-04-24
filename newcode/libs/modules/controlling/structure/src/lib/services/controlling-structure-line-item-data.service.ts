/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { ControllingCommonLineItemDataService, ControllingCommonProjectComplete, IControllingCommonProjectEntity } from '@libs/controlling/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { ProjectMainForCOStructureDataService } from './project-main-for-costructure-data.service';

export const CONTROLLING_STRUCTURE_LINE_ITEM_DATA_TOKEN = new InjectionToken<ControllingStructureLineItemDataService>('controllingStructureLineItemDataToken');

@Injectable({
	providedIn: 'root'
})

export class ControllingStructureLineItemDataService extends ControllingCommonLineItemDataService<IEstLineItemEntity,IControllingCommonProjectEntity, ControllingCommonProjectComplete>{
	public constructor() {
		 super(inject(ProjectMainForCOStructureDataService));
	}
}

