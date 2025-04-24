/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360CreateProjectEntity, IBasicsBim360CreateProjectUserEntity } from '../basics-bim360-createproject-entity.interface';
import { IBasicsBim360TokenEntity } from '../basics-bim360-token-entity.interface';

export interface IBasicsCreateBim360ProjectRequestEntity {
	TokenInfo: IBasicsBim360TokenEntity | null;
	TokenInfo2: IBasicsBim360TokenEntity | null;

	CreateProjectData: IBasicsBim360CreateProjectEntity | null;
	UserData: IBasicsBim360CreateProjectUserEntity | null;
}
