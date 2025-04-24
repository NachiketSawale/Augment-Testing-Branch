/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { WorkflowInstanceService } from '../../../services/workflow-instance/workflow-instance.service';

/**
 * Class that provides support for workflow instance legacy service
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowInstanceLegacyService extends WorkflowInstanceService {

}