/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360TokenEntity } from '../basics-bim360-token-entity.interface';
import { IBasicsBim360SaveDocumentsItemResultEntity } from './save-documents-item-result-entity.interface';

export interface IBasicsBim360SaveDocumentsResponseEntity {
	StateCode: string | null;
	Message: string | null;
	IssuesSaved: IBasicsBim360SaveDocumentsItemResultEntity[] | null;
	TokenInfo: IBasicsBim360TokenEntity | null;
	TokenInfo2: IBasicsBim360TokenEntity | null;
}
