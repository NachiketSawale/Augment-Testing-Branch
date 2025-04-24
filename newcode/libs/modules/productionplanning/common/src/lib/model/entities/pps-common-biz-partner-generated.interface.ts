/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsCommonBizPartnerEntityGenerated extends IEntityBase {
	
	Id: number;
		
	/*
	* Initial Id on creation of client when Version is 0. It is only useful on creation/first-time-saving
	*/
	InitialId: number;
		
	MainEntityFk: number;

	ProjectFk?: number | null;

	PpsHeaderFk?: number | null;

	BusinessPartnerFk: number;

	// /*
	// * to be confirmed:
	// * to be used in the client code for showing the telephonenumber lookup
	// */
	// TelephoneNumber?: TelephoneNumberDto | null;

	/*
	* SubsidiaryFk -> BPD_SUBSIDIARY -> BPD_SUBSIDIARY.BAS_TELEPHONE_NUMBER_FK
	*/
	TelephoneNumberFk?: number | null;

	/*
	* BusinessPartnerFk -> BPD_BUSINESSPARTNER -> BPD_BUSINESSPARTNER.EMAIL
	*/
	Email?: string | null;

	/*
	* BusinessPartnerFk -> BPD_BUSINESSPARTNER -> BPD_BUSINESSPARTNER.BP_NAME1
	*/
	BusinessPartnerName1?: string | null;

	SubsidiaryFk: number;

	RoleFk: number;

	Remark?: string | null;

	IsLive: boolean;

	From?: string | null;


}
