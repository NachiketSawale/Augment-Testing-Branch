/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IInstanceHeaderEntity } from '@libs/constructionsystem/shared';
import { constructionSystemProjectInstanceHeaderService } from '../instance-header.service';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectComplete, IProjectEntity } from '@libs/project/interfaces';

@Injectable({ providedIn: 'root' })

/**
 * Service for construction system project change instance header status.
 */
export class ConstructionSystemProjectChangeInstanceHeaderStatusService extends BasicsSharedChangeStatusService<IInstanceHeaderEntity, IProjectEntity, IProjectComplete> {
	protected readonly dataService = inject(constructionSystemProjectInstanceHeaderService);
	protected readonly rootDataService = inject(ProjectMainDataService);

	/**
	 * Configuration for status change options.
	 */
	protected statusConfiguration: IStatusChangeOptions<IProjectEntity, IProjectComplete> = {
		title: 'constructionsystem.project.changeInstanceHeaderStatus',
		guid: 'a041c4f180c74d6fb1ac5ebef949a2d1',
		isSimpleStatus: false,
		statusName: 'instanceheader',
		checkAccessRight: true,
		statusField: 'StateFk',
		updateUrl: 'constructionsystem/project/instanceheader/changestatus',
		rootDataService: this.rootDataService
	};

	/**
	 * Initiates the change of instance header status.
	 */
	public changeInstanceHeaderStatus() {
		this.startChangeStatusWizard();
	}
}
