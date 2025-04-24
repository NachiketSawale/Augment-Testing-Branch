/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ControllingCommonActualDataService, ControllingCommonProjectComplete, IControllingCommonActualEntity, IControllingCommonProjectEntity } from '@libs/controlling/common';
import { ProjectMainForCOStructureDataService } from './project-main-for-costructure-data.service';


@Injectable({
	providedIn: 'root'
})
export class ControllingStructureActualDataService extends ControllingCommonActualDataService<IControllingCommonActualEntity, IControllingCommonProjectEntity, ControllingCommonProjectComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(ProjectMainForCOStructureDataService));
	}
}

