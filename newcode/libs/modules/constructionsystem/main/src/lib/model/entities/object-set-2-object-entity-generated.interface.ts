/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IObjectSet2ObjectEntityGenerated extends IEntityBase {

	/*
	 * Id
	 */
	Id: number;

	/*
	 * ModelFk
	 */
	ModelFk: number;

	/*
	 * ProjectFk
	 */
	ProjectFk: number;

	/*
	 * ObjectSetFk
	 */
	ObjectSetFk: number;

	/*
	 * ObjectFk
	 */
	ObjectFk: number;
}
