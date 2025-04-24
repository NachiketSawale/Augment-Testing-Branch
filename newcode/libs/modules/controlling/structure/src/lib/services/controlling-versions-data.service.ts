/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ControllingCommonProjectComplete, ControllingCommonVersionDataService, IControllingCommonBisPrjHistoryEntity, IControllingCommonProjectEntity } from '@libs/controlling/common';

import { ProjectMainForCOStructureDataService } from './project-main-for-costructure-data.service';

@Injectable({
	providedIn: 'root'
})

export class ControllingVersionDataService extends ControllingCommonVersionDataService<IControllingCommonBisPrjHistoryEntity, IControllingCommonProjectEntity, ControllingCommonProjectComplete> {

	/**
	 * The constructor
	 */
	public constructor() {
		 super(inject(ProjectMainForCOStructureDataService));
	}
}
