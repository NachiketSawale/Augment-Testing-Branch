/*
 * Copyright(c) RIB Software GmbH
 */

import { IControlContext } from '@libs/ui/common';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';

/**
 * The configuration required to create a domain control context object.
 */
export type DomainControlContextConfig<Entity> = Omit<IControlContext, 'value'> & {
	/**
	 * Entity against which domain control is bound
	 */
	entity: Entity;

	/**
	 * Path of model property of the domain
	 */
	propertyPath: string;

	/**
	 * action service used for change tracking
	 */
	actionService: BasicsWorkflowActionDataService;
};