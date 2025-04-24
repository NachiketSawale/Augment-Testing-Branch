/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsClerkEntity } from '../model/basics-clerk-entity.interface';
import { BasicsSharedClerkLookupService } from '../../lookup-services/basics-clerk-lookup.service';
import { BasicsSharedClerkRoleLookupService } from '../../lookup-services/customize';
/**
 * Basics Clerk layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedClerkLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IBasicsClerkEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['ClerkFk', 'ClerkRoleFk', 'CommentText', 'ValidFrom', 'ValidTo'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.common.', {
					ClerkFk: { key: 'entityClerk', text: 'Clerk' },
					ClerkRoleFk: { key: 'entityClerkRole', text: 'ClerkRole' },
					CommentText: { key: 'entityCommentText', text: 'Comment Text' },
					ValidFrom: { key: 'entityValidFrom', text: 'Valid From' },
					ValidTo: { key: 'entityValidTo', text: 'Valid To' },
				}),
			},
			overloads: {
				ClerkFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showDescription: true,
						showClearButton: true,
						descriptionMember: 'Description',
					}),
				},
				ClerkRoleFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkRoleLookupService,
						showDescription: true,
						descriptionMember: 'Description',
					}),
				},
			},
		};
	}
}
