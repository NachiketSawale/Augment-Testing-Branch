/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import { BusinessPartnerContactRequest } from '../model/business-partner-contact-request';
import { BusinessPartnerContactResponse } from '../model/business-partner-contact-response';
import { IBusinessPartnerSearchContactEntity } from '@libs/businesspartner/interfaces';



/**
 * Business Partner Contact search Service
 */
@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerSearchContactService {

	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);

	/**
	 * Searches for business partner contacts by business partner ID
	 * Filtering conditions can be specified
	 * @param bpId  - Business partner ID
	 * @param subsidiaryFk - Branch ID [Optional]
	 * @param selectedContactFk  - ID of the selected contact [Optional]
	 * @param needSetDefaultContact  Whether to set the default contact [Optional]
	 * @returns {Promise<Array>}  Contains all contacts and filtered results
	 */
	public async search(bpId: number, subsidiaryFk: number | undefined, selectedContactFk: number | undefined, needSetDefaultContact: boolean): Promise<IBusinessPartnerSearchContactEntity[]> {
		const request = new BusinessPartnerContactRequest();
		request.Value = bpId;
		const resp = await firstValueFrom(this.http.post<BusinessPartnerContactResponse>(this.configService.webApiBaseUrl + 'businesspartner/contact/listbybusinesspartnerid', request));
		let contactEntities = resp.Main;
		contactEntities = subsidiaryFk ? contactEntities?.filter(e => e.SubsidiaryFk === subsidiaryFk) : contactEntities;

		if (selectedContactFk) {
			const selectedContact = contactEntities?.find(item => item.Id === selectedContactFk);
			if (selectedContact) {
				selectedContact.bpContactCheck = true;
			}
		} else if (needSetDefaultContact) {
			const firstContact = contactEntities?.[0];
			if (firstContact) {
				firstContact.bpContactCheck = true;
			}
		}
		return contactEntities || [];
	}
}
