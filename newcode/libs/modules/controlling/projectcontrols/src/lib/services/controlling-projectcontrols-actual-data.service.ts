/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ControllingCommonActualDataService, ControllingCommonProjectComplete, IControllingCommonActualEntity, IControllingCommonProjectEntity } from '@libs/controlling/common';
import { ControllingProjectControlsProjectDataService } from './controlling-projectcontrols-project-main-data.service';

@Injectable({
	providedIn: 'root',
})
export class ControllingProjectcontrolsActualDataService extends ControllingCommonActualDataService<IControllingCommonActualEntity, IControllingCommonProjectEntity, ControllingCommonProjectComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(ControllingProjectControlsProjectDataService));
	}
}
