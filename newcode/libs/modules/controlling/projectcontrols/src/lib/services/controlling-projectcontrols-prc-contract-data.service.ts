/*
 * Copyright(c) RIB Software GmbH
 */

import { ControllingCommonPrcContractDataService, ControllingCommonProjectComplete, IControllingCommonPrcContractEntity, IControllingCommonProjectEntity } from '@libs/controlling/common';
import { inject, Injectable } from '@angular/core';
import { ControllingProjectControlsProjectDataService } from './controlling-projectcontrols-project-main-data.service';
@Injectable({
	providedIn: 'root',
})
export class ControllingProjectcontrolsPrcContractDataService extends ControllingCommonPrcContractDataService<IControllingCommonPrcContractEntity, IControllingCommonProjectEntity, ControllingCommonProjectComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		super(inject(ControllingProjectControlsProjectDataService));
	}
}
