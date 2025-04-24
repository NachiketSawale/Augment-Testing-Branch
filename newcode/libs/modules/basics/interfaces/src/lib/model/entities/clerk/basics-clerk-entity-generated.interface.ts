/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IBasicsSupportsIsLive } from '../basics-supports-is-live.interface';

export interface IBasicsClerkEntityGenerated extends IEntityBase , IEntityIdentification, IBasicsSupportsIsLive {

	Description?: string;
	TitleFk?: number;
	FamilyName?: string;
	FirstName?: string;
	Code?: string;
	UserFk?: number;
	ValidFrom?: Date | null;
	ValidTo?: Date | null;
	CompanyFk?: number;
	Title?: string;
	Department?: string;
	Signature?: string;
	TelephonePattern?: string;
	TelephoneNumberFk?: number;
	TelefaxPattern?: string;
	TelephoneTelefaxFk?: number;
	MobilPattern?: string;
	TelephoneMobilFk?: number;
	Email?: string;
	BlobsFooterFk?: number;
	BlobsEmailfooterFk?: number;
	AddressFk?: number;
	PrivatTelephonePattern?: string;
	TelephonePrivatFk?: number;
	PrivatMobilPattern?: string;
	TelephonePrivatMobilFk?: number;
	PrivatEmail?: string;
	Birthdate?: Date | null;
	WorkflowType?: number;
	NotificationEmails?: boolean;
	EscalationEmails?: boolean;
	EscalationTo?: string;
	ClerkProxyFk?: number;
	Userdefined1?: string;
	Userdefined2?: string;
	Userdefined3?: string;
	Userdefined4?: string;
	Userdefined5?: string;
	Remark?: string;
	BlobsPhotoFk?: number;
	TxUser?: string;
	TxPw?: string;
	SearchPattern?: string;
	ClerkSuperiorFk?: number;
	ProcurementOrganization?: string;
	ProcurementGroup?: string;
	IsAnonymized?: boolean;
	IsClerkGroup?: boolean;
	IsTxUserChanged?: boolean;
}
