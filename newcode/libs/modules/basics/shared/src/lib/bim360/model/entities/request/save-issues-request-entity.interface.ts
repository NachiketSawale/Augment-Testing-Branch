/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360IssueEntity } from '../basics-bim360-issue-entity.interface';
import { IBasicsBim360SaveOptionsEntity } from './save-options-entity.interface';
import { IBasicsBim360RequestEntity } from './basics-bim360-request-entity.interface';

export interface IBasicsBim360SaveIssuesRequestEntity extends IBasicsBim360RequestEntity {
	IssueList: IBasicsBim360IssueEntity[] | null;
	Options: IBasicsBim360SaveOptionsEntity;
}
