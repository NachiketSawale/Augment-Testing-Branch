/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ProjectDropPointsLookupProviderGeneratedService } from './generated/project-drop-points-lookup-provider-generated.service';
import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IProjectDropPointsLookupProvider, PROJECT_DROP_POINTS_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';

@LazyInjectable({
	token: PROJECT_DROP_POINTS_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class ProjectDropPointsLookupProviderService extends ProjectDropPointsLookupProviderGeneratedService implements IProjectDropPointsLookupProvider {}