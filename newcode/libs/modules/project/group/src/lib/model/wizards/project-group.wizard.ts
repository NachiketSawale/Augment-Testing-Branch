/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ProjectGroupStatusWizardService } from '../../services/wizards/project-group-status-wizard.service';

export class ProjectGroupWizard {

	public setGroupStatus(context: IInitializationContext){
		const service = context.injector.get(ProjectGroupStatusWizardService);
		service.onStartChangeStatusWizard();
	}
}