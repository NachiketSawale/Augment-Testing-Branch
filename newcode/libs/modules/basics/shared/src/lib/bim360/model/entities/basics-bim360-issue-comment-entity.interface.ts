/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360UserEntity } from './basics-bim360-user-entity.interface';

export interface IBasicsBim360IssueCommentEntity {
	Id: string;
	Body: string | null;
	CreatedBy: IBasicsBim360UserEntity | null;
	CreatedAt: string | null;
	UpdatedAt: string | null;
}
