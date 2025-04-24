/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IProjectMainLookupProvider, PROJECT_MAIN_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import { ProjectMainLookupProviderGeneratedService } from './generated/project-lookup-provider-generated.service';

@LazyInjectable({
	token: PROJECT_MAIN_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class ProjectLookupProviderService extends ProjectMainLookupProviderGeneratedService implements IProjectMainLookupProvider {}