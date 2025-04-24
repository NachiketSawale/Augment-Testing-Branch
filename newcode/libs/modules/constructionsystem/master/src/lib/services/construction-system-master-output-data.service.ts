/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ConstructionSystemCommonOutputDataService, IConstructionSystemCommonScriptErrorEntity } from '@libs/constructionsystem/common';
import { ConstructionSystemMasterScriptDataService } from './construction-system-master-script-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterOutputDataService extends ConstructionSystemCommonOutputDataService {
	public constructor() {
		super(ConstructionSystemMasterScriptDataService);
	}

	protected override async loadData() {
		const scriptResponseEntity = (this.parentService as ConstructionSystemMasterScriptDataService).getExecutionResult();
		return scriptResponseEntity?.ErrorList ?? [];
	}

	protected override getOnScriptResultUpdatedSubject() {
		return (this.parentService as ConstructionSystemMasterScriptDataService).onScriptResultUpdated as Subject<IConstructionSystemCommonScriptErrorEntity[] | null>;
	}
}
