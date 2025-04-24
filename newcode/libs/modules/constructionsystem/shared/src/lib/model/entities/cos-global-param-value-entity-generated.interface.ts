/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ICosGlobalParamValueEntityGenerated extends IEntityBase {
	/*
	 * CosGlobalParamFk
	 */
	CosGlobalParamFk: number;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsDefault
	 */
	IsDefault: boolean;

	/*
	 * ParameterValue
	 */
	ParameterValue?: string | number | boolean | Date | null;

	/*
	 * Sorting
	 */
	Sorting: number;
}
