/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ControllingCommonLineItemDataService, ControllingCommonProjectComplete, IControllingCommonProjectEntity } from '@libs/controlling/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { ControllingProjectControlsProjectDataService } from './controlling-projectcontrols-project-main-data.service';

@Injectable({
	providedIn: 'root',
})
export class ControllingProjectcontrolsLineItemDataService extends ControllingCommonLineItemDataService<IEstLineItemEntity, IControllingCommonProjectEntity, ControllingCommonProjectComplete> {
	public constructor() {
		super(inject(ControllingProjectControlsProjectDataService));
	}
}
