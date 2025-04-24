/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { AsyncReadonlyFunctions, EntityAsyncReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';

import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';
import { IContactEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerContactDataService } from '../businesspartner-contact-data.service';

@Injectable({
	providedIn: 'root',
})
export class ContactReadonlyProcessorService extends EntityAsyncReadonlyProcessorBase<IContactEntity> {
	private readonly businesspartnerMainHeaderDataService = inject(BusinesspartnerMainHeaderDataService);

	public constructor(protected dataService: BusinesspartnerContactDataService) {
		super(dataService);
	}

	public generateAsyncReadonlyFunctions(): AsyncReadonlyFunctions<IContactEntity> {
		return {
			ContactRoleFk: {
				shared: [
					'TitleFk',
					'Title',
					'FirstName',
					'Initials',
					'FamilyName',
					'Pronunciation',
					'CompanyFk',
					'IsLive',
					'IsDefaultBaseline',
					'TelephoneNumberDescriptor',
					'TelephoneNumber2Descriptor',
					'TeleFaxDescriptor',
					'MobileDescriptor',
					'Internet',
					'Email',
					'BasLanguageFk',
					'EmailPrivate',
					'CountryFk',
					'SubsidiaryFk',
					'AddressDescriptor',
					'PrivateTelephoneNumberDescriptor',
					'ClerkResponsibleFk',
					'ContactTimelinessFk',
					'ContactOriginFk',
					'ContactAbcFk',
					'BirthDate',
					'NickName',
					'PartnerName',
					'Children',
					'Remark',
					'IsDefault',
					'Provider',
					'ProviderId',
					'ProviderFamilyName',
					'ProviderEmail',
					'ProviderAddress',
					'ProviderComment',
					'PortalUserGroupName',
					'LogonName',
					'IdentityProviderName',
					'LastLogin',
					'Statement',
					'SetInactiveDate',
				],
				readonly: async () => {
					const bpStatus = this.businesspartnerMainHeaderDataService.getItemStatus();
					return !!(bpStatus?.IsReadonly);

				},
			},
		};
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IContactEntity> {
		return {};
	}
}
