/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceMaintenanceLookupProviderGeneratedService } from './generated/resource-maintenance-lookup-provider-generated.service';
import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IResourceMaintenanceLookupProvider, RESOURCE_MAINTENANCE_LOOKUP_PROVIDER_TOKEN } from '@libs/resource/interfaces';

@LazyInjectable({
	token: RESOURCE_MAINTENANCE_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class ResourceMaintenanceLookupProviderService extends ResourceMaintenanceLookupProviderGeneratedService implements IResourceMaintenanceLookupProvider {}