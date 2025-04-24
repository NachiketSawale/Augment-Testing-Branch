/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectable } from '@libs/platform/common';
import { IBusinessModuleAddOn } from '@libs/ui/business-base';
import { CONSTRUCTION_SYSTEM_PROJECT_MODULE_ADD_ON_TOKEN } from '@libs/constructionsystem/interfaces';
import { CONSTRUCTION_SYSTEM_PROJECT_INSTANCE_HEADER_ENTITY_INFO } from './entity-info/constructionsystem-project-instance-header-entity-info.model';

@LazyInjectable({
	token: CONSTRUCTION_SYSTEM_PROJECT_MODULE_ADD_ON_TOKEN,
})
export class ConstructionSystemProjectModuleAddOn implements IBusinessModuleAddOn {
	public readonly entities = [CONSTRUCTION_SYSTEM_PROJECT_INSTANCE_HEADER_ENTITY_INFO];
}
