/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICostcodePriceVerEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export interface IBasicsCostCodesPriceVersionComplete extends CompleteIdentification<ICostcodePriceVerEntity> {
	/*
	 * MainItemId
	 */
	MainItemId: number | null;
	/*
	 * EntitiesCount
	 */
	EntitiesCount: number | null;
	/*
	 * PriceVersion
	 */
	PriceVersion: ICostcodePriceVerEntity;
}
