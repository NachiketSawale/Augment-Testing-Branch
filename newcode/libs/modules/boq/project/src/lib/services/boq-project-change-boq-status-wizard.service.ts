/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';

@Injectable({
	providedIn: 'root',
})

/**
 * Service for Change Boq Status wizard
 */
export class ProjectBoqStatusChangeWizardService extends BasicsSharedChangeStatusService<IProjectEntity, IProjectEntity, IProjectComplete> {
	protected readonly dataService = inject(ProjectMainDataService);

	/**
	 * Configuration for status change options.
	 */
	protected statusConfiguration: IStatusChangeOptions<IProjectEntity, IProjectComplete> = {
		//mainDataService:any //TODO-BOQ: wait for the data service interfaces from FWK (main data service of current module)
		//subDataService?: any; //TODO-BOQ: wait for the data service interfaces from FWK (data service of current sub data if the change status is for the sub data)
		title: 'boq.main.wizardChangeBoqStatus',
		guid: '791e39436c4a44b99469ec38f84f433d',
		isSimpleStatus: false,
		statusName: 'boq',
		checkAccessRight: true,
		statusField: 'BoqStatusFk',
		updateUrl: 'boq/main/changeheaderstatus',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}
