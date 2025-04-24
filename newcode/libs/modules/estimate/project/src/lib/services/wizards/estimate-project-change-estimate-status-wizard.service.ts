/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';

@Injectable({ providedIn: 'root' })

/**
 * Service for estimating project change estimate status.
 */
export class EstimateProjectChangeEstimateStatusService extends BasicsSharedChangeStatusService<IProjectEntity, IProjectEntity, IProjectComplete> {
	protected readonly dataService = inject(ProjectMainDataService);

	/**
	 * Configuration for status change options.
	 */
	protected statusConfiguration: IStatusChangeOptions<IProjectEntity, IProjectComplete> = {
		title: 'estimate.main.wizardChangeEstimateStatus',
		guid: '8981AAD8A8F241B8A18E5EBC12983BF8',
		isSimpleStatus: false,
		statusName: 'estimate',
		checkAccessRight: true,
		statusField: 'EstStatusFk',
		updateUrl: 'estimate/main/header/changestatus',
		rootDataService: this.dataService
	};

	/**
	 * Initiates the change of estimate status.
	 */
	public changeEstimateStatus() {
		this.startChangeStatusWizard();
	}
}
