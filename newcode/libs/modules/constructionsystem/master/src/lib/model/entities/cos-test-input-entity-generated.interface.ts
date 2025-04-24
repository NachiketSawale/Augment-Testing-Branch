/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICosTestInputEntity } from './cos-test-input-entity.interface';
import { ICosModelObjectKey } from './cos-model-object-key-entity.interface';

export interface ICosTestInputEntityGenerated extends IEntityBase {
	/**
	 * BoqHeaderFk
	 */
	BoqHeaderFk?: number | null;

	/**
	 * CosHeaderFk
	 */
	CosHeaderFk: number | null;

	/**
	 * CosInsHeaderFk
	 */
	CosInsHeaderFk: number | null;

	/**
	 * EstHeaderFk
	 */
	EstHeaderFk: number | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * ModelFk
	 */
	ModelFk?: number | null;

	/**
	 * ModelObjectIds
	 */
	ModelObjectIds?: ICosModelObjectKey[] | null;

	/**
	 * ParameterList
	 */
	ParameterList?: ICosTestInputEntity[] | null;

	/**
	 * ProjectFk
	 */
	ProjectFk: number | null;

	/**
	 * PsdScheduleFk
	 */
	PsdScheduleFk?: number | null;

	/**
	 * Script
	 */
	Script?: string | null;

	/**
	 * ValidateScriptData
	 */
	ValidateScriptData?: string | null;
}
