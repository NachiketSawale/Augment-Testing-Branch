/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IPrcStructureAccountEntity } from '../model/entities/prc-structure-account-entity.interface';
import { AccountLookupOverloadProvider } from './account-lookup-overload-provider.class';

/**
 * Procurement structure account layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementStructureAccountLayoutService {

	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IPrcStructureAccountEntity>> {

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'PrcAccountTypeFk',
						'TaxCodeFk',
						'Account',
						'OffsetAccount',
						'BasAccountFk',
						'BasAccountOffsetFk',
						'BasControllingCatFk'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'PrcAccountTypeFk': {
						text: 'Type',
						key: 'entityType'
					},
					'TaxCodeFk': {
						text: 'Tax Code',
						key: 'entityTaxCode'
					}
				}),
				...prefixAllTranslationKeys('basics.procurementstructure.', {
					'Account': {
						text: 'Account',
						key: 'account'
					},
					'OffsetAccount': {
						text: 'offset Account',
						key: 'offsetAccount'
					},
					'BasControllingCatFk': {
						text: 'Controlling Cat',
						key: 'controllingCat'
					},
					'BasAccountFk': {
						text: 'Account Description',
						key: 'accountDescription'
					},
					'BasAccountOffsetFk': {
						text: 'Offset Account Description',
						key: 'offsetAccountDescription'
					}
				}),
			},
			overloads: {
				PrcAccountTypeFk: BasicsSharedLookupOverloadProvider.provideAccountTypeLookupOverload(false),
				TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
				Account: AccountLookupOverloadProvider.provideBasAccountLookupOverload(false),
				BasAccountFk: AccountLookupOverloadProvider.provideBasAccountDescriptionLookupOverload(),
				OffsetAccount: AccountLookupOverloadProvider.provideBasAccountLookupOverload(false),
				BasAccountOffsetFk: AccountLookupOverloadProvider.provideBasAccountDescriptionLookupOverload(),
				BasControllingCatFk: BasicsSharedLookupOverloadProvider.provideControllingCatLookupOverload(true),
			}
		};
	}
}