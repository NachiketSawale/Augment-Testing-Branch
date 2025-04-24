/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectable } from '@libs/platform/common';
import { IBusinessModuleAddOn } from '@libs/ui/business-base';
import { RESOURCE_CATALOG_MODULE_ADD_ON_TOKEN } from '@libs/resource/interfaces';
import { RESOURCE_CATALOG_RECORD_ENTITY_INFO } from './resource-catalog-record-entity-info.model';
@LazyInjectable({
	token: RESOURCE_CATALOG_MODULE_ADD_ON_TOKEN
})
export class ResourceCatalogModuleAddOn implements IBusinessModuleAddOn {

	public readonly entities = [
		RESOURCE_CATALOG_RECORD_ENTITY_INFO,
	];

}
