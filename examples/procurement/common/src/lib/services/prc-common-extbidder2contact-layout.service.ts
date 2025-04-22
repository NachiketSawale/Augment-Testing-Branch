/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable, Injector } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
	BusinesspartnerSharedContactLookupService,
	BusinesspartnerSharedContactRoleLookupService,
} from '@libs/businesspartner/shared';
import { IPrcCommonExtBidder2contactEntity } from '../model/entities/prc-common-extbidder2contact-entity.interface';

/**
 * extbidder2contact layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PrcCommonExtBidder2contactLayout {
	private readonly injector = inject(Injector);

	public async generateConfig<T extends IPrcCommonExtBidder2contactEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: [
						'BpdContactFk',
						'BpdContactRoleFk'
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					BpdContactRoleFk: {key: 'contactRole'},
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					BpdContactFk: {key: 'contactFirstName'},
				})
			},
			overloads: {
				BpdContactRoleFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedContactRoleLookupService
					})
				},
				BpdContactFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedContactLookupService
					}),
					additionalFields:[
						{
							displayMember: 'FamilyName',
							label: {
								key: 'procurement.package.contactFamilyName',
							},
							column: true,
							singleRow: true,
						},
						{
							displayMember: 'Title',
							label: {
								key: 'procurement.package.businessPartnerContactTitle',
							},
							column: true,
							singleRow: true,
						},
						{
							displayMember: 'Telephone1',
							label: {
								key: 'procurement.package.businessPartnerContactTel1',
							},
							column: true,
							singleRow: true,
						},
						{
							displayMember: 'Telephone2',
							label: {
								key: 'procurement.package.businessPartnerContactTel2',
							},
							column: true,
							singleRow: true,
						},
						{
							displayMember: 'Telefax',
							label: {
								key: 'procurement.package.businessPartnerContactTelefax',
							},
							column: true,
							singleRow: true,
						},
						{
							displayMember: 'Mobile',
							label: {
								key: 'procurement.package.businessPartnerContactMobile',
							},
							column: true,
							singleRow: true,
						},
						{
							displayMember: 'Internet',
							label: {
								key: 'procurement.package.businessPartnerContactInternet',
							},
							column: true,
							singleRow: true,
						},
						{
							displayMember: 'Email',
							label: {
								key: 'procurement.package.businessPartnerContactEmail',
							},
							column: true,
							singleRow: true,
						},
						{
							displayMember: 'Description',
							label: {
								key: 'procurement.package.businessPartnerContactSubsidiaryDescription',
							},
							column: true,
							singleRow: true,
						},
						{
							displayMember: 'AddressLine',
							label: {
								key: 'procurement.package.businessPartnerContactSubsidiaryAddress',
							},
							column: true,
							singleRow: true,
						}
					]
				},
			}
		};
	}
}
