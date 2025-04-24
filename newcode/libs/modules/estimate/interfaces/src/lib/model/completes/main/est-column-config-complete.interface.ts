/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstColumnConfigEntity } from '../../entities/main/est-column-config-entity.interface';
import { IEstColumnConfigDetailEntity } from '../../entities/main/est-column-config-detail-entity.interface';
import { IEstColumnConfigTypeEntity } from '../../entities/main/est-column-config-type-entity.interface';
import { IEstConfigEntity } from '../../entities/main/est-config-entity.interface';
import { IEstHeaderEntity } from '../../entities/main/est-header-base-entity.interface';

export interface IEstColumnConfigComplete {
	/*
	 * EstHeaderId
	 */
	EstHeaderId?: number | null;

	/*
	 * editType
	 */
	editType?: string;

	/*
	 * IsDefaultColConfig
	 */
	IsDefaultColConfig?: boolean | null;

	/*
	 * estColumnConfig
	 */
	estColumnConfig?: IEstColumnConfigEntity | null;

	/*
	 * estColumnConfigDetailsToDelete
	 */
	estColumnConfigDetailsToDelete?: IEstColumnConfigDetailEntity[] | null;

	/*
	 * estColumnConfigDetailsToSave
	 */
	estColumnConfigDetailsToSave?: IEstColumnConfigDetailEntity[] | null;

	/*
	 * estColumnConfigType
	 */
	estColumnConfigType?: IEstColumnConfigTypeEntity | null;

	/*
	 * estConfig
	 */
	estConfig?: IEstConfigEntity | null;

	/*
	 * estHeader
	 */
	estHeader?: IEstHeaderEntity | null;

	/*
	 * estConfigColumnConfigFk
	 */
	IsUpdColumnConfig?: boolean | null;
}
