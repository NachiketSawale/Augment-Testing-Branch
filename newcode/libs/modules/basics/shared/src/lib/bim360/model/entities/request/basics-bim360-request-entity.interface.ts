/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360TokenEntity } from '../basics-bim360-token-entity.interface';
import { IBasicsBim360ProjectInfoEntity } from '../basics-bim360-project-info-entity.interface';

export interface IBasicsBim360RequestEntity {
	ProjInfo: IBasicsBim360ProjectInfoEntity | null;
	TokenInfo: IBasicsBim360TokenEntity | null;
	TokenInfo2: IBasicsBim360TokenEntity | null;
}
