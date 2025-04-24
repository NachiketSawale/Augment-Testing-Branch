/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360TokenEntity } from '../basics-bim360-token-entity.interface';
import { IBasicsBim360SaveRFIsItemResultEntity } from './save-rfis-item-result-entity.interface';

export interface IBasicsBim360SaveRFIsResponseEntity {
	StateCode: string | null;
	Message: string | null;
	TokenInfo: IBasicsBim360TokenEntity | null;
	TokenInfo2: IBasicsBim360TokenEntity | null;

	RFIsSaved: IBasicsBim360SaveRFIsItemResultEntity[] | null;
}
