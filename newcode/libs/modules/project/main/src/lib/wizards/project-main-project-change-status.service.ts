/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';
import { IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
/*
 * Copyright(c) RIB Software GmbH
 */

@Injectable({
	providedIn: 'root'
})
export class ProjectMainProjectChangeStatusService extends BasicsSharedChangeStatusService<IProjectEntity, IProjectEntity, IProjectComplete> {
	protected readonly dataService = inject(ProjectMainDataService);

	protected statusConfiguration: IStatusChangeOptions<IProjectEntity, IProjectComplete> = {
		title: 'project.main.changeStatus',
		guid: '6039d1766dc74505968418cb699c0c5a',
		isSimpleStatus: false,
		statusName: 'project',
		checkAccessRight: true,
		statusField: 'StatusFk',
		updateUrl: 'project/main/changestatus',
		rootDataService: this.dataService
	};

	public changeProjectStatus() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		//TODO: only refresh the selected entities not support yet. wait framework done
	}
}