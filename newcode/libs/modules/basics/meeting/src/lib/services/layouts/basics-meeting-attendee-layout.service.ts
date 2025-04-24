/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { IMtgAttendeeEntity } from '@libs/basics/interfaces';
import { BasicsSharedClerkLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';

/**
 * The meeting layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMeetingAttendeeLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public async generateLayout(): Promise<ILayoutConfiguration<IMtgAttendeeEntity>> {
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['Title', 'Role', 'FirstName', 'FamilyName', 'Department', 'Email', 'TelephoneNumberFk', 'TelephoneMobilFk', 'AttendeeStatusFk', 'ClerkFk', 'BusinessPartnerFk', 'SubsidiaryFk', 'ContactFk', 'IsOptional'],
				},
				{
					gid: 'userDefTextGroup',
					title: {
						key: 'cloud.common.UserdefTexts',
						text: 'User-Defined Texts',
					},
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.meeting.', {
					Title: {
						key: 'title',
						text: 'Title',
					},
					Role: {
						key: 'role',
						text: 'Role',
					},
					ClerkFk: {
						key: 'entityClerk',
						text: 'Clerk',
					},
					ContactFk: {
						key: 'entityBpdContact',
						text: 'Contact',
					},
					IsOptional: {
						key: 'isOptional',
						text: 'Is Optional',
					},
				}),
				...prefixAllTranslationKeys('basics.clerk.', {
					FirstName: {
						key: 'entityFirstName',
						text: 'First Name',
					},
					FamilyName: {
						key: 'entityFamilyName',
						text: 'Family Name',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Department: {
						key: 'entityDepartment',
						text: 'Department',
					},
					Email: {
						key: 'email',
						text: 'E-Mail',
					},
					TelephoneNumberFk: {
						key: 'TelephoneDialogPhoneNumber',
						text: 'Phone Number',
					},
					TelephoneMobilFk: {
						key: 'mobile',
						text: 'Mobile',
					},
					AttendeeStatusFk: {
						key: 'entityStatus',
						text: 'Status',
					},
					BusinessPartnerFk: {
						key: 'entityBusinessPartner',
						text: 'Business Partner',
					},
					SubsidiaryFk: {
						key: 'entitySubsidiary',
						text: 'Branch',
					},
					Userdefined1: {
						key: 'entityUserDefText',
						params: { p_0: '1' },
					},
					Userdefined2: {
						key: 'entityUserDefText',
						params: { p_0: '2' },
					},
					Userdefined3: {
						key: 'entityUserDefText',
						params: { p_0: '3' },
					},
					Userdefined4: {
						key: 'entityUserDefText',
						params: { p_0: '4' },
					},
					Userdefined5: {
						key: 'entityUserDefText',
						params: { p_0: '5' },
					},
				}),
			},
			overloads: {
				AttendeeStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideMeetingAttendeeStatusReadonlyLookupOverload(),
				ClerkFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
					}),
				},
				BusinessPartnerFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload({
					showClearButton: true,
					filterIsLive: true,
				}),
				SubsidiaryFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload({
					showClearButton: true,
					serverFilterKey: 'businesspartner-main-subsidiary-common-filter',
					restrictToBusinessPartners: (entity) => entity.BusinessPartnerFk,
				}),
				ContactFk: bpRelatedLookupProvider.getContactLookupOverload({
					showClearButton: true,
					serverFilterKey: 'prc-con-contact-filter',
					restrictToBusinessPartners: (entity) => entity.BusinessPartnerFk,
					restrictToSubsidiaries: (entity) => entity.SubsidiaryFk,
				}),
				TelephoneNumberFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
				TelephoneMobilFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
			},
		};
	}
}
