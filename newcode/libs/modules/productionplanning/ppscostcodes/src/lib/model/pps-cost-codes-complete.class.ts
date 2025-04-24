/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICostCodeNewEntity } from './entities/cost-code-new-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class PpsCostCodesComplete implements CompleteIdentification<ICostCodeNewEntity> {
	/*
	 * CostCodes
	 */
	public CostCodes?: ICostCodeNewEntity[] | null = [];

	/*
	 * Id
	 */
	public Id?: number | null = 10;

	/*
	 * MainItemId
	 */
	public MainItemId?: number | null = 10;
}
