/*
 * Copyright (c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { isArray } from 'lodash';
import { IContactEntity, RFQ_BPM_PORTAL_USER_MANAGEMENT_SERVICE, IRfqBusinessPartnerMainPortalUserManagementService } from '@libs/businesspartner/interfaces';
import { LazyInjectable, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IUserExtPrvdrInfoVEntity } from '@libs/usermanagement/interfaces';

/**
 * Loads portal user details
 */
@LazyInjectable({
	token: RFQ_BPM_PORTAL_USER_MANAGEMENT_SERVICE,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class RfqBusinessPartnerMainPortalUserManagementService implements IRfqBusinessPartnerMainPortalUserManagementService {

	private readonly httpService = inject(PlatformHttpService);
	private readonly translationService = inject(PlatformTranslateService);

	public async getAndMapProviderInfo(contacts: IContactEntity[]): Promise<IContactEntity[]> {
		if (!isArray(contacts) || contacts.length === 0) {
			return [];
		}

		const contactIds = contacts.map(contact => contact.Id);
		const providers = await this.getUserExternalProviderInfoVEntities(contactIds);

		contacts.forEach(contact => {
			const provider = providers.find(provider => provider.contactId === contact.Id);
			if (provider) {
				this.mapDataToContact(contact, provider);
			}
		});
		return contacts;
	}

	private mapDataToContact(contact: IContactEntity, providerInfo: IUserExtPrvdrInfoVEntity) {
		if (contact && providerInfo) {
			const addressInfo = [];
			contact.Provider = providerInfo.provider;
			contact.ProviderId = providerInfo.providerId;
			contact.ProviderFamilyName = providerInfo.familyName;
			contact.ProviderEmail = providerInfo.email;
			if (providerInfo.zipCode) {
				addressInfo.push(providerInfo.zipCode);
			}
			if (providerInfo.city) {
				addressInfo.push(providerInfo.city);
			}
			if (providerInfo.street) {
				addressInfo.push(providerInfo.street);
			}
			contact.ProviderAddress = addressInfo.join(',');
			contact.ProviderComment = providerInfo.comment;
			contact.PortalUserGroupName = providerInfo.portalUserGroupName;
			contact.LogonName = providerInfo.logonName;
			contact.IdentityProviderName = providerInfo.identityProviderName;
			//contact.LastLogin = providerInfo.lastLogin ? moment.utc(providerInfo.lastLogin) : null; //TODO: Replace with moment
			contact.State = providerInfo.state;
			contact.Statement = contact.State === 1 ? this.translationService.instant('businesspartner.contact.portalUserActiveState').text : (contact.State === 2 ? this.translationService.instant('businesspartner.contact.portalUserInactiveState').text : null);
			//contact.SetInactiveDate = providerInfo.setinactivedate ? moment.utc(providerInfo.setinactivedate) : null; //TODO: Replace with moment
			contact.PortalUserGroupFk = providerInfo.portalusergroupFk ?? 0;
			//contact.UserId = providerInfo.userId;
		}
	}

	private getUserExternalProviderInfoVEntities(contactIds: number[]): Promise<IUserExtPrvdrInfoVEntity[]> {
		return this.httpService.post('usermanagement/main/portal/getuserexternalproviderinfoventities', contactIds);
	}
}