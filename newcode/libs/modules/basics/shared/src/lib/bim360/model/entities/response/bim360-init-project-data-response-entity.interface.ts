/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360TokenEntity } from '../basics-bim360-token-entity.interface';
import { IBasicsBim360ResponseEntity } from './basics-bim360-response-entity.interface';
import { IBasicsBim360InitProjectDataRequestEntity } from '../request/bim360-init-project-data-request-entity.interface';

export interface IBasicsBim360InitProjectDataResponseEntity extends IBasicsBim360ResponseEntity {
	tokenInfo?: IBasicsBim360TokenEntity | null;
	paramsInfo?: IBasicsBim360InitProjectDataRequestEntity | null;
	usersInfo?: IBasicsBim360ResponseEntity | null;
	projectsInfo?: IBasicsBim360ResponseEntity | null;
}
