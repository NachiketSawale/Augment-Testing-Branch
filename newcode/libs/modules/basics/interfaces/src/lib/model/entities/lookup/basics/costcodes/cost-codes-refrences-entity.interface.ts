/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface ICostCodesRefrenceEntity {
	/*
	 * Id
	 */
	Id: number;

	/*
	 * DetailsStack
	 */
	DetailsStack: number | number;

	/*
	 * Source
	 */
	Source: IDescriptionInfo | null;
}
