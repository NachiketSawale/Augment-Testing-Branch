/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceSkillLookupProviderGeneratedService } from './generated/resource-skill-lookup-provider-generated.service';
import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IResourceSkillLookupProvider, RESOURCE_SKILL_LOOKUP_PROVIDER_TOKEN } from '@libs/resource/interfaces';

@LazyInjectable({
	token: RESOURCE_SKILL_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class ResourceSkillLookupProviderService extends ResourceSkillLookupProviderGeneratedService implements IResourceSkillLookupProvider {}