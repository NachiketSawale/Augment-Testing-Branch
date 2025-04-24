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
 * Service for Change Schedule Status wizards
 */
export class SchedulingScheduleProjectWizardService extends BasicsSharedChangeStatusService<IProjectEntity, IProjectEntity, IProjectComplete> {
	protected readonly dataService = inject(ProjectMainDataService);

	/**
	 * Configuration for status change options.
	 */

	protected statusConfiguration: IStatusChangeOptions<IProjectEntity, IProjectComplete> = {
		/**
		 * main data service of current module
		 * TODO: wait for the data service interfaces
		 */
		//mainDataService:any
		/**
		 * data service of current sub data if the change status is for the sub data
		 * TODO: wait for the data service interfaces
		 */
		//subDataService?: any;
		title: 'project.main.wizardChangeScheduleStatus',
		guid: '6cbf0ef900e242028c46da3af06b06e5',
		isSimpleStatus: false,
		statusName: 'schedulingschedulestatus',
		checkAccessRight: true,
		statusField: 'ScheduleStatusFk',
		updateUrl: 'scheduling/schedule/changestatus',
		rootDataService: this.dataService
		// /**
		//  * provide status function
		//  */
		// statusProviderFunc?(): Observable<IStatus[]>
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}
