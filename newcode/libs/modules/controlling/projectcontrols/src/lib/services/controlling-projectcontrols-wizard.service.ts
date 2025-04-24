/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { ControllingProjectControlsProjectDataService } from './controlling-projectcontrols-project-main-data.service';
import { ControllingProjectControlsVersionDataService } from './controlling-projectcontrols-version-data.service';
import { ControllingCommonTransferDataToBisDataWziardService } from '@libs/controlling/common';

@Injectable({
	providedIn: 'root',
})
export class ControllingProjectcontrolsWizardService {
	public static transferDataToBisDataWizard(context: IInitializationContext): void {
		const projectSvc = context.injector.get(ControllingProjectControlsProjectDataService);
		const vsersionSvc = context.injector.get(ControllingProjectControlsVersionDataService);

		const svc = context.injector.get(ControllingCommonTransferDataToBisDataWziardService);
		svc.setService(projectSvc, vsersionSvc);

		void svc.showTransferToBisWizard();
	}
}
