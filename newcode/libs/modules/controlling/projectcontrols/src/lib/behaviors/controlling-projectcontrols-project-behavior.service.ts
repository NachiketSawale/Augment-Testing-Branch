/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
	ControllingCommonProjectBehavior,
	ControllingCommonProjectComplete,
	IControllingCommonProjectEntity
} from '@libs/controlling/common';
import {
	ControllingProjectControlsProjectDataService
} from '../services/controlling-projectcontrols-project-main-data.service';

@Injectable({
	providedIn: 'root'
})
export class ControllingProjectControlsProjectBehavior extends ControllingCommonProjectBehavior<IControllingCommonProjectEntity, ControllingCommonProjectComplete> {
	public constructor() {
		super(inject(ControllingProjectControlsProjectDataService));
	}
}