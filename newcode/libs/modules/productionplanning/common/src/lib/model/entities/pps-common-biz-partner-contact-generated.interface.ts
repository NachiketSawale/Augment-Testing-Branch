/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsCommonBizPartnerContactEntityGenerated extends IEntityBase {
	
	Id: number;
	
	MainEntityFk?: number | null;

	Entity2BusinessPartnerFk: number;

	BusinessPartnerFk: number;

	ContactFk: number;

	RoleTypeFk: number;

	IsLive: boolean;

	Remark?: string | null;
		
	/*
	* ContactFk -> BPD_CONTACT -> BPD_CONTACT.FIRST_NAME
	*/
	FirstName?: string | null;

	/*
	* ContactFk -> BPD_CONTACT -> BPD_CONTACT.EMAIL
	*/
	Email?: string | null;

	/*
	* ContactFk -> BPD_CONTACT -> BPD_CONTACT.BAS_TELEPHONE_NUMBER_FK
	*/
	TelephoneNumberFk?: number | null;

	/*
	* ContactFk -> BPD_CONTACT -> BPD_CONTACT.BAS_TELEPHONE_NUMBER_2_FK
	*/
	TelephoneNumber2Fk?: number | null;

	/*
	* ContactFk -> BPD_CONTACT -> BPD_CONTACT.BAS_TELEPHONE_MOBILE_FK
	*/
	TelephoneNumberMobileFk?: string | null;

	/*
	* 
	*/
	TelephoneNumberString?: string | null;

	/*
	* 
	*/
	TelephoneNumber2String?: string | null;

	/*
	* 
	*/
	TelephoneNumberMobileString?: string | null;

	// todo...

	// /*
	// * 
	// */
	// TelephoneNumber?: TelephoneNumberDto | null;

	// /*
	// * 
	// */
	// TelephoneNumber2?: TelephoneNumberDto | null;

	// /*
	// * 
	// */
	// TelephoneNumberMobile?: TelephoneNumberDto | null;
}
