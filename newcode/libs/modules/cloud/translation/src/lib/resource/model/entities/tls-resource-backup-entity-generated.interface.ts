/*
 * Copyright(c) RIB Software GmbH
 */

import { IResourceEntity } from './resource-entity.interface';
import { IEntityBase } from '@libs/platform/common';

/**
 * ITls Resource Backup Entity Generated
 */

export interface ITlsResourceBackupEntityGenerated extends IEntityBase {
	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * ResourceEntity
	 */
	ResourceEntity?: IResourceEntity | null;

	/*
	 * ResourceFk
	 */
	ResourceFk?: number | null;

	/*
	 * ResourceTerm
	 */
	ResourceTerm?: string | null;
}
