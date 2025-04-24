/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360DocumentRequestEntity } from './basics-bim360-document-request-entity.interface';
import { IBasicsDocumentToBim360Entity } from '../basics-document-to-bim360-entity.interface';

export interface IBasicsSaveDocumentsToBim360RequestEntity extends IBasicsBim360DocumentRequestEntity {
	DocumentList: IBasicsDocumentToBim360Entity[] | null;
}
