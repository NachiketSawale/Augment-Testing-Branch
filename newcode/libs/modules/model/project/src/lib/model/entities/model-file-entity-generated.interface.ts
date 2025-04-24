/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IModelEntity } from './model-entity.interface';

export interface IModelFileEntityGenerated extends IEntityBase {

	/*
	 * Conversion
	 */
	Conversion?: boolean | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * FileArchiveDocFk
	 */
	FileArchiveDocFk?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * ImportProfileFk
	 */
	ImportProfileFk?: number | null;

	/*
	 * IsCompositeModel
	 */
	IsCompositeModel?: boolean | null;

	/*
	 * JobFk
	 */
	JobFk?: number | null;

	/*
	 * ModelCode
	 */
	ModelCode?: string | null;

	/*
	 * ModelDescription
	 */
	ModelDescription?: string | null;

	/*
	 * ModelEntity
	 */
	ModelEntity?: IModelEntity | null;

	/*
	 * ModelFk
	 */
	ModelFk: number;

	/*
	 * OriginFileName
	 */
	OriginFileName?: string | null;

	/*
	 * PkTagIds
	 */
	PkTagIds?: number[] | null;

	/*
	 * State
	 */
	State: number;

	/*
	 * Trace
	 */
	Trace: boolean;
}
