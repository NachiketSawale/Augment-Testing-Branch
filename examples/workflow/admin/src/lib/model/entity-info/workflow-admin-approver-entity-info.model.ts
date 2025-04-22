/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityApproverConfigurationService } from '@libs/workflow/common';
import { IWorkflowInstance } from '@libs/workflow/interfaces';
import { WorkflowInstanceComplete } from '@libs/workflow/shared';
import { BasicsWorkflowInstanceDataService } from '../../services/basics-workflow-instance-data.service';

/**
 * Entity Info of Workflow Approver.
 */
export const WFE_ADMIN_APPROVER_ENTITY_INFO = EntityApproverConfigurationService.prepareApproverEntity<IWorkflowInstance, WorkflowInstanceComplete>({
	containerUuid: 'd1a0148cf99b4402be51caad2f7e5681',
	entityGUID: '',
	containerTitle: 'basics.workflowAdministration.approver.containerHeader',
	moduleName: 'Basics.Workflow',
	parentServiceContext: (ctx) => {
		return ctx.injector.get(BasicsWorkflowInstanceDataService);
	},
});