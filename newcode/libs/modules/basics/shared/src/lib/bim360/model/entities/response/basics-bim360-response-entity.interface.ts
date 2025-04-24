/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360TokenEntity } from '../basics-bim360-token-entity.interface';

export interface IBasicsBim360ResponseEntity {
	StateCode: string | null;
	ResultMsg: string | null;
	Api: string | null;
	TokenInfo: IBasicsBim360TokenEntity | null;
	TokenInfo2: IBasicsBim360TokenEntity | null;
}
