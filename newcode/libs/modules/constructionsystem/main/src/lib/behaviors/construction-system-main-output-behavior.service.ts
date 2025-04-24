/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ICosInsErrorEntity } from '../model/entities/cos-ins-error-entity.interfae';
import { ConstructionSystemCommonOutputBehavior } from '@libs/constructionsystem/common';
import { ConstructionSystemMainOutputDataService } from '../services/construction-system-main-output-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainOutputBehavior extends ConstructionSystemCommonOutputBehavior<ICosInsErrorEntity> {
	public constructor() {
		super(inject(ConstructionSystemMainOutputDataService));
	}
}
