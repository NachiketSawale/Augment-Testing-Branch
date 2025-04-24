/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { PpsCommonClerkFromsHelper } from '@libs/productionplanning/common';
import {
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider
} from '@libs/basics/shared';
import { IPpsHeader2ClerkEntity } from '../../model/entities/pps-header2clerk-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration, UiCommonLookupDataFactoryService } from '@libs/ui/common';

/**
 * PPS Header Clerk layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsHeader2ClerkLayoutService {
	private lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
	private fromsHelper = inject(PpsCommonClerkFromsHelper);

	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<IPpsHeader2ClerkEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					attributes: ['ClerkRoleFk', 'ClerkFk', 'ValidFrom', 'ValidTo', 'CommentText', 'From']
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					basicData: { key: 'entityProperties' },
					CommentText: { key: 'entityComment' },
				}),
				...prefixAllTranslationKeys('basics.common.', {
					ClerkRoleFk: { key: 'entityClerkRole' },
					ClerkFk: { key: 'entityClerk' },
					ValidFrom: { key: 'entityValidFrom' },
					ValidTo: { key: 'entityValidTo' },
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					From: { key: 'from' },
				}),
			},
			overloads: {
				ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true), // because of un-finish of DescriptionInfo, lookup field ClerkRoleFk will be "empty" on the UI
				ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
				From: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataService: this.lookupServiceFactory.fromItems(this.fromsHelper.getFroms(), {
							uuid: '',
							idProperty: 'id',
							valueMember: 'id',
							displayMember: 'description'
						})
					})
				},
			}
		};
	}
}
