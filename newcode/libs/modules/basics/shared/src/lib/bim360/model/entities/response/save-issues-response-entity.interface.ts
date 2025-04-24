/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360TokenEntity } from '../basics-bim360-token-entity.interface';
import { IBasicsBim360SaveIssuesItemResultEntity } from './save-issues-item-result-entity.interface';

export interface IBasicsBim360SaveIssuesResponseEntity {
	StateCode: string | null;
	Message: string | null;
	TokenInfo: IBasicsBim360TokenEntity | null;
	TokenInfo2: IBasicsBim360TokenEntity | null;

	IssuesSaved: IBasicsBim360SaveIssuesItemResultEntity[] | null;
	FirstException: object | null;
}
