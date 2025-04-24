/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IEntityIdentification } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';

export class PpsUpstreamItemChangeStatusWizardService<IPpsUpstreamItemEntity extends IEntityIdentification> extends BasicsSharedChangeStatusService<IPpsUpstreamItemEntity, object, object> {
	public constructor(protected override dataService: IEntitySelection<IPpsUpstreamItemEntity>) {
		super();
	}

	protected statusConfiguration: IStatusChangeOptions<object, object> = {
		title: 'Change Upstream Requirement Status',
		guid: '9065e7dd71ab49eba2b6adc4f4001724',
		isSimpleStatus: false,
		statusName: 'upstream',
		checkAccessRight: true,
		statusField: 'PpsUpstreamStatusFk'
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override beforeStatusChanged() {
		//This method should be implemented by subclasses to define specific pre-status change operations. such as validation before changing status
		return Promise.resolve(true);
	}

	public override afterStatusChanged() {
		//this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}