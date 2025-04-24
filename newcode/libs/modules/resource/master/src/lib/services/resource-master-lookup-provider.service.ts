/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceMasterLookupProviderGeneratedService } from './generated/resource-master-lookup-provider-generated.service';
import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IResourceMasterLookupProvider, RESOURCE_MASTER_LOOKUP_PROVIDER_TOKEN } from '@libs/resource/interfaces';

@LazyInjectable({
	token: RESOURCE_MASTER_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class ResourceMasterLookupProviderService extends ResourceMasterLookupProviderGeneratedService implements IResourceMasterLookupProvider {}