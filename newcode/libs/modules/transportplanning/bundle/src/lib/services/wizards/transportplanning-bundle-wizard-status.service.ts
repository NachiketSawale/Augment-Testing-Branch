import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IBundleEntity } from '../../model/models';
import { TransportplanningBundleGridDataService } from '../transportplanning-bundle-grid-data.service';
import { inject, Injectable } from '@angular/core';
import { TransportplanningBundleGridComplete } from '../../model/transportplanning-bundle-grid-complete.class';

@Injectable({
	providedIn: 'root',
})
export class TransportPlanningBundleWizardStatusService extends BasicsSharedChangeStatusService<IBundleEntity, IBundleEntity, TransportplanningBundleGridComplete> {
	protected readonly dataService = inject(TransportplanningBundleGridDataService);
	protected statusConfiguration: IStatusChangeOptions<IBundleEntity, TransportplanningBundleGridComplete> = {
		title: 'transportplanning.requisition.wizard.changeRequisitionStatus',
		guid: '5d16a3c4313c4ac5aac5081ed158fd74',
		isSimpleStatus: true,
		statusName: 'trsBundle',
		checkAccessRight: true,
		statusField: 'TrsBundleStatusFk',
		updateUrl: 'transportplanning/bundle/wizard/changeBundleStatus',
		rootDataService: this.dataService,
	};
	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}
