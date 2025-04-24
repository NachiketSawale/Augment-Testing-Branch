/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { IProjectLookupOptions, IProjectLookupProvider, PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import { createLookup, FieldType, ILookupFieldOverload } from '@libs/ui/common';
import { ProjectSharedLookupService } from './project-lookup.service';

/**
 * Provides project-related lookups.
 */
@LazyInjectable({
	token: PROJECT_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true,
})
@Injectable({
	providedIn: 'root',
})
export class ProjectSharedProjectLookupProviderService implements IProjectLookupProvider {
	public generateProjectLookup<T extends object>(options?: IProjectLookupOptions<T>): ILookupFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProjectSharedLookupService,
				...options?.lookupOptions,
			}),
		};
	}
}
