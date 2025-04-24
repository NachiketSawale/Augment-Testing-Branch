/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IContactLookupEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerSharedContactLookupService } from '@libs/businesspartner/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { IPpsCommonBizPartnerContactEntity } from '../../model/entities/pps-common-biz-partner-contact-entity.interface';

/**
 * PPS Conmon BusinessPartner Contact layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsCommonBizPartnerContactLayoutService {

	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<IPpsCommonBizPartnerContactEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					attributes: ['ContactFk', 'RoleTypeFk', 'FirstName', 'TelephoneNumberString', 'TelephoneNumber2String', 'TelephoneNumberMobileString', 'Email', 'IsLive', 'Remark']
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					basicData: { key: 'entityProperties' },
					IsLive: { key: 'entityIsLive' },
					Remark: { key: 'entityRemark' },
					TelephoneNumberString: { key: 'TelephoneDialogPhoneNumber' },
					TelephoneNumberMobileString: { key: 'mobile' },
					Email: { key: 'email' },
				}),

				...prefixAllTranslationKeys('basics.customize.', {
					RoleTypeFk: { key: 'projectcontractroletype' },
				}),

				...prefixAllTranslationKeys('project.main.', {
					ContactFk: { key: 'entityContact' },
				}),

				...prefixAllTranslationKeys('businesspartner.main.', {
					TelephoneNumber2String: { key: 'telephoneNumber2' },
				}),

				...prefixAllTranslationKeys('productionplanning.common.', {
					From: { key: 'from' }
				}),

				...prefixAllTranslationKeys('basics.clerk.', {
					FirstName: { key: 'entityFirstName' }
				}),
			},
			overloads: {
				ContactFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IPpsCommonBizPartnerContactEntity, IContactLookupEntity>({
						dataServiceToken: BusinesspartnerSharedContactLookupService,
						showClearButton: true,
						serverSideFilter: {
							key: 'project-main-bizpartner-contact-filter',
							execute(context: ILookupContext<IContactLookupEntity, IPpsCommonBizPartnerContactEntity>) {
								return {
									BusinessPartnerFk: context.entity ? context.entity.BusinessPartnerFk : null,
								};
							}
						}
					})
				},
				RoleTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectContractRoleTypeLookupOverload(false), // because of un-finish of DescriptionInfo, lookup field RoleTypeFk will be "empty" on the UI
				FirstName: {
					readonly: true,
				},
				TelephoneNumberString: {
					readonly: true,
				},
				TelephoneNumber2String: {
					readonly: true,
				},
				TelephoneNumberMobileString: {
					readonly: true,
				},
				// remark: after finish of domainType 'phone' of platform, telephone icon will be displayed on the UI for fields TelephoneNumberString, TelephoneNumber2String and TelephoneNumberMobileString
				Email: {
					readonly: true,
				},
			}
		};
	}
}
