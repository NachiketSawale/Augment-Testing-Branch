/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ContactDataService } from '../contact-data.service';
import { BusinessPartnerSharedReOrInActivatePortalUserService } from '@libs/businesspartner/shared';

@Injectable({
    providedIn: 'root',
})
/*
 * Re/In Activate Portal User Service for the Business Partner Contact.
 */
export class BusinessPartnerContactReOrInActivatePortalUserService extends BusinessPartnerSharedReOrInActivatePortalUserService {
    
	/**
     * Injected data service specific to manage contact entities.
     */
    protected override readonly dataService = inject(ContactDataService);	

	/**
     * Initiates the process to reactivate or inactivate portal users for Business Partner Contacts.
     * Utilizes the shared functionality from the base class.
     */
	public async ContactReactivateOrInactivatePortalUser(): Promise<void>{
		this.reactivateOrInactivatePortalUser(this.dataService);	
	}   
}
