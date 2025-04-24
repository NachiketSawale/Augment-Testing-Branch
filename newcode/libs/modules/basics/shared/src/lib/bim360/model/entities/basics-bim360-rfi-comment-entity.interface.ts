/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360UserEntity } from './basics-bim360-user-entity.interface';

export interface IBasicsBim360RFICommentEntity {
	id: string;
	body: string | null;
	createdBy: IBasicsBim360UserEntity | null;
	createdAt: string | null;
	updatedAt: string | null;
}
