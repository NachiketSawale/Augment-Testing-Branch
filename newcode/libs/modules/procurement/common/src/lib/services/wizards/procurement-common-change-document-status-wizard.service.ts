/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';
import { IEntitySelection } from '@libs/platform/data-access';
import { IPrcDocumentEntity } from '../../model/entities';

/**
 * Common wizard service for the procurements Change Document status
 */
@Injectable({
	providedIn: 'root',
})

export abstract class ProcurementCommonChangeDocumentStatusWizardService extends BasicsSharedChangeStatusService<IPrcDocumentEntity, object, object> {

	protected override dataService!: IEntitySelection<IPrcDocumentEntity>;

	protected statusConfiguration: IStatusChangeOptions<object, object> = {
		title: 'basics.common.changePrcDocumentStatus',
		isSimpleStatus: false,
		statusName: 'prcdocument',
		checkAccessRight: true,
		statusField: 'PrcDocumentStatusFk',
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		// TODO: after change status
	}
}
