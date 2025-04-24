/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

export interface IProjectStockValuationRuleEntityGenerated extends IEntityIdentification {

	/*
	 * Description
	 */
	Description: string | null;

	/*
	 * DescriptionTr
	 */
	DescriptionTr: number | null;

	/*
	 * Islive
	 */
	Islive: boolean;


	/*
	 * sorting
	 */
	Sorting: number;

}