/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEstimateProjectHeader2ClerkEntity } from '../model/models';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

/**
 * The layout service for contract entity container
 */
@Injectable({ providedIn: 'root' })

/**
 * Estimate Project Clerk Layout Service
 */
export class EstimateProjectClerkLayoutService {
	public async generateLayout(): Promise<ILayoutConfiguration<IEstimateProjectHeader2ClerkEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					attributes: ['ClerkRoleFk','ClerkFk','CommentText'] // TODO Clerk-Description column
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: { key: 'entityCommentText' }
				}),

				...prefixAllTranslationKeys('basics.clerk.', {
					ClerkFk: { key: 'entityClerk', text: 'Clerk' },
					ClerkRoleFk: { key: 'entityRole', text: 'Role' }
				}),
				...prefixAllTranslationKeys('project.main.', {
					IsActive: { key: 'entityIsActive', text: 'IsActive' }
				}),
			},
			overloads: {
				ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
				ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true)
			},
		};
	}
}
