/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360UserEntity } from './basics-bim360-user-entity.interface';

export interface IBasicsBim360AttachmentEntity {
	id: string;
	created_at: string | null;
	created_by: IBasicsBim360UserEntity | null;
	updated_at: string | null;
	attachment_type: string | null;
	name: string | null;
	url: string | null;
	urn_type: string | null;
	urn: string | null;
}
