/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360TokenEntity } from '../basics-bim360-token-entity.interface';

export interface IBasicsBim360ProjectRequestEntity {
	TokenInfo: IBasicsBim360TokenEntity | null;
	FilterKey: string | null;
}
