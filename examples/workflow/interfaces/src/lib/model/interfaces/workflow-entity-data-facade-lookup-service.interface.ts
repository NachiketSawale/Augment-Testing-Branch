/*
 * Copyright(c) RIB Software GmbH
 */


import { LazyInjectionToken } from '@libs/platform/common';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWorkflowEntityDataFacade } from './workflow-entity-data-facade.interface';


export interface IWorkflowEntityDataFacadeLookupService<T extends object>  extends UiCommonLookupEndpointDataService<IWorkflowEntityDataFacade, T> {

}

export const WORKFLOW_ENTITY_DATA_FACADE_LOOKUP_SERVICE = new LazyInjectionToken<IWorkflowEntityDataFacadeLookupService<IWorkflowEntityDataFacade>>('workflow-entity-data-facade-lookup-service');