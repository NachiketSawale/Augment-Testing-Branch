/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360DocumentEntity } from '../basics-bim360-document-entity.interface';
import { IBasicsBim360DocumentRequestEntity } from './basics-bim360-document-request-entity.interface';

export interface IBasicsBim360SaveDocumentsRequestEntity extends IBasicsBim360DocumentRequestEntity {
	DocumentList: IBasicsBim360DocumentEntity[] | null;
}
