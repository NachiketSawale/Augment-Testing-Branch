/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IDataEntityFacade } from './data-entity-facade.interface';
import { LazyInjectionToken } from '@libs/platform/common';


export interface IWorkflowEntityFacadeLookupService<T extends object> extends UiCommonLookupEndpointDataService<IDataEntityFacade, T> {

	getEntityFacadeById(uuid: string): IDataEntityFacade | undefined
}

export const WORKFLOW_ENTITY_FACADE_LOOKUP_SERVICE = new LazyInjectionToken<IWorkflowEntityFacadeLookupService<IDataEntityFacade>>('workflow-entity-facade-lookup-service');