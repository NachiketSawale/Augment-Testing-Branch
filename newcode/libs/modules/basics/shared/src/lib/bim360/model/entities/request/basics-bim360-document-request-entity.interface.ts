/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360DocumentOptionsEntity } from './basics-bim360-document-options-entity.interface';
import { IBasicsBim360RequestEntity } from './basics-bim360-request-entity.interface';

export interface IBasicsBim360DocumentRequestEntity extends IBasicsBim360RequestEntity {
	Options: IBasicsBim360DocumentOptionsEntity | null;
}
