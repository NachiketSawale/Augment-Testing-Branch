/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IEntityIdentification } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';

export class PpsProductPhaseRequirementChangeStatusWizardService<IPpsPhaseRequirementEntity extends IEntityIdentification> extends BasicsSharedChangeStatusService<IPpsPhaseRequirementEntity, object, object> {
	public constructor(protected override dataService: IEntitySelection<IPpsPhaseRequirementEntity>) {
		super();
	}

	protected statusConfiguration: IStatusChangeOptions<object, object> = {
		title: 'productionplanning.product.wizard.changePhaseReqStatus',
		guid: 'b3ebe4845d254f138d06679cbf885921',
		isSimpleStatus: true,
		statusName: 'ppsphaserequirement',
		checkAccessRight: true,
		statusField: 'PpsPhaseReqStatusFk',
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
