/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { ITransportPackageEntity, TransportPackageComplete } from '../../model/models';
import { inject, Injectable } from '@angular/core';
import { TransportplanningPackageDataService } from '../transportplanning-package-data.service';

@Injectable({
	providedIn: 'root',
})
export class TransportPlanningPackageWizardChangeStatusService extends BasicsSharedChangeStatusService<ITransportPackageEntity, ITransportPackageEntity, TransportPackageComplete> {
	protected readonly dataService = inject(TransportplanningPackageDataService);
	
	protected statusConfiguration: IStatusChangeOptions<ITransportPackageEntity, TransportPackageComplete> = {
		title: 'transportplanning.package.wizard.changePackageStatus',
		guid: '822a54da829149cdbd8b01e26b855d00',
		isSimpleStatus: true,
		statusName: 'trsPackage',
		checkAccessRight: true,
		statusField: 'TrsPkgStatusFk',
		rootDataService: this.dataService,
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}
