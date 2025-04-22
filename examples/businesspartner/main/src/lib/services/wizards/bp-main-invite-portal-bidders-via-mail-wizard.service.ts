/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IContactEntity } from '@libs/businesspartner/interfaces';
import { Dictionary } from '@libs/platform/common';
import { InvitePortaBiddersViaMailSharedService } from '@libs/businesspartner/shared';
import { BusinesspartnerContactDataService } from '../businesspartner-contact-data.service';

@Injectable({
	providedIn: 'root'
})
/**
 * Buisiness Partner Main Invite Portal Bidders Via Mail wizard Service
 */
export class BpMainInvitePortalBiddersViaMailWizardService extends InvitePortaBiddersViaMailSharedService<IContactEntity>{

	/**
 	* The Data Service
 	*/
	protected readonly dataService = inject(BusinesspartnerContactDataService);

	/**
 	* The Context type of the sub-module
 	*/
	public contextType: string= 'bpcontact';

	/**
 	* The Buisiness Partner Invite Selected Portal Bidders via mail.
 	*/
	public bPMainInviteSelectedPortalBidders(wizardParameters?: Dictionary<string, unknown>) {
		this.inviteSelectedBidder(wizardParameters);
	}
}