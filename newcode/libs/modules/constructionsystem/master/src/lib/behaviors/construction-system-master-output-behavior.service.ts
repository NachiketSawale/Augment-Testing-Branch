/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ConstructionSystemCommonOutputBehavior, IConstructionSystemCommonScriptErrorEntity } from '@libs/constructionsystem/common';
import { ConstructionSystemMasterOutputDataService } from '../services/construction-system-master-output-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterOutputBehavior extends ConstructionSystemCommonOutputBehavior<IConstructionSystemCommonScriptErrorEntity> {
	public constructor() {
		super(inject(ConstructionSystemMasterOutputDataService));
	}
}
