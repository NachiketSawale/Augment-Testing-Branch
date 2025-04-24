/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IProjectGroupEntity } from '@libs/project/interfaces';
import { ProjectGroupDataService } from '../project-group-data.service';
import { ProjectGroupComplete } from '../../model/project-group-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ProjectGroupStatusWizardService extends BasicsSharedChangeStatusService<IProjectGroupEntity, IProjectGroupEntity, ProjectGroupComplete>{

	protected readonly dataService = inject(ProjectGroupDataService);

	protected statusConfiguration: IStatusChangeOptions<IProjectGroupEntity, ProjectGroupComplete> = {
		title: 'basics.customize.projectgroupstatus',
		isSimpleStatus: false,
		statusName: 'projectgroupstatus',
		checkAccessRight: true,
		statusField: 'ProjectGroupStatusFk',
		updateUrl: 'project/group/changestatus',
		rootDataService: this.dataService
	};

	public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		//this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
	}
}