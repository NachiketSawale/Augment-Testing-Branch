/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360RequestEntity } from './basics-bim360-request-entity.interface';
import { IBasicsBim360LoadOptionsEntity } from './load-options-entity.interface';

export interface IBasicsBim360LoadIssueRfiRequestEntity extends IBasicsBim360RequestEntity {
	Options: IBasicsBim360LoadOptionsEntity;
}
