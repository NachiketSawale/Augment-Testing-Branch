/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BasicsBim360AuthenticationType } from '../enums/basics-bim360-authentication-type.enum';

export interface IBasicsBim360TokenEntity {
	tokenLegged: BasicsBim360AuthenticationType;
	authCode?: string | null;
	scope?: string | null;
	token_type?: string | null;
	expires_in: number;
	access_token?: string | null;
	refresh_token?: string | null;
	getTokenTime: Date | null;
}
