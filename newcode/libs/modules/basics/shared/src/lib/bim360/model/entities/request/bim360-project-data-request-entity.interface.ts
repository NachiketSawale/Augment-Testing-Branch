/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360TokenEntity } from '../basics-bim360-token-entity.interface';

export interface IBasicsBim360ProjectDataRequestEntity {
	TokenInfo: IBasicsBim360TokenEntity | null;
	ProjInfo: IBasicsBim360ProjectDataRequestProjectInfoEntity | null;
}

export interface IBasicsBim360ProjectDataRequestProjectInfoEntity {
	projectNo?: string;
}
